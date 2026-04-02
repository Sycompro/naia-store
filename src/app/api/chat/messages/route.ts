import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const phone = searchParams.get('phone');

    if (!conversationId && !phone) {
        return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
    }

    try {
        const query: any = {};
        if (conversationId) {
            query.conversationId = conversationId;
        } else if (phone) {
            query.conversation = { phone: phone as string };
        }

        const messages = await prisma.message.findMany({
            where: query,
            orderBy: { createdAt: 'asc' },
        });

        // If it was by phone and we need to clear unread count (simplified logic)
        if (phone) {
            await prisma.conversation.updateMany({
                where: { phone },
                data: { unreadCount: 0 }
            });
        }

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { conversationId, content, sender, type, phone } = body;

        let targetConversationId = conversationId;

        // If no conversationId but phone is provided, find or create it
        if (!targetConversationId && phone) {
            const conversation = await prisma.conversation.upsert({
                where: { phone },
                update: { lastMessage: content, updatedAt: new Date() },
                create: {
                    phone,
                    lastMessage: content,
                    status: 'OPEN'
                }
            });
            targetConversationId = conversation.id;
        }

        if (!targetConversationId) {
            return NextResponse.json({ error: 'No conversation target' }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                conversationId: targetConversationId,
                content,
                sender,
                type: type || 'TEXT',
            }
        });

        // Update conversation summary
        await prisma.conversation.update({
            where: { id: targetConversationId },
            data: {
                lastMessage: content,
                updatedAt: new Date(),
                unreadCount: sender === 'USER' ? { increment: 1 } : undefined
            }
        });

        // REAL WhatsApp API Integration
        if (sender === 'ADMIN') {
            const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
            const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

            if (ACCESS_TOKEN && PHONE_ID && phone) {
                try {
                    const waResponse = await fetch(`https://graph.facebook.com/v21.0/${PHONE_ID}/messages`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${ACCESS_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messaging_product: 'whatsapp',
                            to: phone.startsWith('51') ? phone : `51${phone}`, // Added Peru prefix if missing
                            type: 'text',
                            text: { body: content }
                        })
                    });
                    const waData = await waResponse.json();
                    if (!waResponse.ok) {
                        console.error('WhatsApp API Error:', waData);
                        // Update message status to FAILED in DB if needed
                    }
                } catch (waErr) {
                    console.error('WhatsApp Fetch Error:', waErr);
                }
            } else {
                console.warn('MISSING WHATSAPP CREDENTIALS - Message saved only in local DB');
            }
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
