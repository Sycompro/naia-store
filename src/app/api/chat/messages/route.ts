export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    try {
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'ADMIN') return null;
        return payload;
    } catch (e) {
        return null;
    }
}

export async function GET(request: Request) {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

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

        // If it was by phone and we need to clear unread count
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
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

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

        // WhatsApp Integration (only for Admin replies)
        if (sender === 'ADMIN') {
            const waResult = await sendWhatsAppMessage(phone || '', content);
            if (waResult.messageId) {
                // Link our message with WhatsApp's external ID
                await prisma.message.update({
                    where: { id: message.id },
                    // @ts-ignore
                    data: { externalId: waResult.messageId }
                });
            } else if (waResult.error) {
                console.error('WhatsApp sending failed:', waResult);
            }
        }

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
