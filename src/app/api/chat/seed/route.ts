import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
    try {
        console.log('Seeding Chat content via API...');

        // 1. Create a demo conversation
        const conv = await prisma.conversation.upsert({
            where: { phone: '51999888777' },
            create: {
                phone: '51999888777',
                name: 'Cliente Demo (Naia)',
                lastMessage: '¡Hola! Me encanta el catálogo.',
                unreadCount: 1,
            },
            update: {
                lastMessage: '¡Hola! Me encanta el catálogo.',
                unreadCount: 1,
            }
        });

        // 2. Add some messages
        await prisma.message.createMany({
            data: [
                {
                    conversationId: conv.id,
                    content: 'Hola, ¿qué productos me recomiendan para piel seca?',
                    sender: 'USER',
                },
                {
                    conversationId: conv.id,
                    content: '¡Hola! Para piel seca te recomendamos nuestro Serum Hidratante Pro y la Crema de Noche Vitality.',
                    sender: 'ADMIN',
                },
                {
                    conversationId: conv.id,
                    content: '¡Hola! Me encanta el catálogo.',
                    sender: 'USER',
                }
            ],
            skipDuplicates: true
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Seed error:', error);
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
