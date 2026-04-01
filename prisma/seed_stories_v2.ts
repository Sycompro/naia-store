import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear old stories to avoid confusion
    await prisma.story.deleteMany({});

    const stories = [
        { title: 'Ofertas Mayo', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300', isActive: true },
        { title: 'Cuidado Facial', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300', isActive: true },
        { title: '[MALE] Facial Masculino', imageUrl: '/men-story-1.png', isActive: true },
        { title: '[MALE] Kit Barba Premium', imageUrl: '/men-story-2.png', isActive: true }
    ];

    for (const story of stories) {
        await prisma.story.create({ data: story });
    }

    console.log('Stories re-seeded with naming convention and public paths!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
