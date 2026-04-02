import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // VERIFY_TOKEN should be in .env
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'naia_secret_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // WhatsApp Webhook structure check
        if (!body.object || !body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
            return NextResponse.json({ ok: true }); // Acknowledge even if empty
        }

        const entry = body.entry[0].changes[0].value;
        const messageData = entry.messages[0];
        const contactData = entry.contacts?.[0];
        const phone = messageData.from;

        // Extract content
        let content = '';
        if (messageData.type === 'text') {
            content = messageData.text.body;
        } else {
            content = `[Media: ${messageData.type}]`;
        }

        // Upsert conversation
        const conversation = await prisma.conversation.upsert({
            where: { phone },
            update: {
                lastMessage: content,
                updatedAt: new Date(),
                unreadCount: { increment: 1 },
                name: contactData?.profile?.name || undefined
            },
            create: {
                phone,
                lastMessage: content,
                name: contactData?.profile?.name || 'Cliente WhatsApp',
                status: 'OPEN'
            }
        });

        // Save message
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                content,
                sender: 'USER',
                createdAt: new Date()
            }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 200 }); // Always 200 to WhatsApp unless critical
    }
}
