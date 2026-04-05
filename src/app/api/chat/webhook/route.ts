export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Fetch settings for dynamic Verify Token
    const settings = await prisma.setting.findFirst({ where: { id: 1 } });
    const VERIFY_TOKEN = settings?.whatsappVerifyToken || process.env.WHATSAPP_VERIFY_TOKEN || 'naia_secret_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    }
    return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // WhatsApp Webhook structure check
        if (!body.object || !body.entry?.[0]?.changes?.[0]?.value) {
            return NextResponse.json({ ok: true });
        }

        const value = body.entry[0].changes[0].value;

        // Handle Status Updates (sent, delivered, read)
        if (value.statuses?.[0]) {
            const statusData = value.statuses[0];
            const externalId = statusData.id;
            const status = statusData.status.toUpperCase(); // DELIVERED, READ, etc.

            await prisma.message.updateMany({
                where: { externalId },
                data: { status }
            });
            return NextResponse.json({ ok: true });
        }

        // Handle Incoming Messages
        if (value.messages?.[0]) {
            const messageData = value.messages[0];
            const contactData = value.contacts?.[0];
            const phone = messageData.from;
            const externalId = messageData.id;

            // Extract content
            let content = '';
            if (messageData.type === 'text') {
                content = messageData.text.body;
            } else if (messageData.type === 'image') {
                content = '[Imagen recibida]';
            } else {
                content = `[Mensaje tipo: ${messageData.type}]`;
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

            // Save message with externalId
            await prisma.message.create({
                data: {
                    externalId,
                    conversationId: conversation.id,
                    content,
                    sender: 'USER',
                    type: messageData.type.toUpperCase(),
                    createdAt: new Date()
                }
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 200 });
    }
}
