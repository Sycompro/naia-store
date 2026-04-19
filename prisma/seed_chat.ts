import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Chat data...');

    // Create some conversations
    const c1 = await prisma.conversation.upsert({
        where: { phone: '51987654321' },
        update: {},
        create: {
            phone: '51987654321',
            name: 'Maria Garcia',
            lastMessage: 'Hola, ¿tienen stock del Serum Vitality?',
            unreadCount: 1,
            status: 'ACTIVE',
        },
    });

    const c2 = await prisma.conversation.upsert({
        where: { phone: '51900112233' },
        update: {},
        create: {
            phone: '51900112233',
            name: 'Juan Perez',
            lastMessage: 'Pedido recibido, ¡muchas gracias!',
            unreadCount: 0,
            status: 'ACTIVE',
        },
    });

    // Add messages for Maria
    await prisma.message.createMany({
        data: [
            {
                conversationId: c1.id,
                content: 'Hola, ¿tienen stock del Serum Vitality?',
                sender: 'USER',
                type: 'TEXT',
            },
            {
                conversationId: c1.id,
                content: 'Hola Maria! Sí, tenemos stock disponible. ¿Deseas que lo separemos por ti?',
                sender: 'ADMIN',
                type: 'TEXT',
            },
        ],
    });

    // Add messages for Juan
    await prisma.message.createMany({
        data: [
            {
                conversationId: c2.id,
                content: 'Hola, mi pedido ya llegó?',
                sender: 'USER',
                type: 'TEXT',
            },
            {
                conversationId: c2.id,
                content: 'Hola Juan, sí, tu pedido está en camino y debería llegar en 30 minutos.',
                sender: 'ADMIN',
                type: 'TEXT',
            },
            {
                conversationId: c2.id,
                content: 'Pedido recibido, ¡muchas gracias!',
                sender: 'USER',
                type: 'TEXT',
            },
        ],
    });

    console.log('Chat seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
