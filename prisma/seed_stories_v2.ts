import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Reseeding Professional Stories System ---');

    // Clean existing data
    await prisma.storySlide.deleteMany({});
    await prisma.storyGroup.deleteMany({});

    const groups = [
        {
            name: 'Ofertas Mayo',
            thumbnailUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=300',
            gender: 'FEMALE',
            slides: [
                { mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=600', type: 'IMAGE', duration: 4500, order: 0 },
                { mediaUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600', type: 'IMAGE', duration: 4000, order: 1 },
                { mediaUrl: 'https://res.cloudinary.com/demo/video/upload/c_fill,h_800,w_450/dog.mp4', type: 'VIDEO', duration: 10000, order: 2 }
            ]
        },
        {
            name: 'Cuidado Facial',
            thumbnailUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300',
            gender: 'FEMALE',
            slides: [
                { mediaUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600', type: 'IMAGE', duration: 5000, order: 0 },
                { mediaUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600', type: 'IMAGE', duration: 5000, order: 1 }
            ]
        },
        {
            name: 'Kit Barba Premium',
            thumbnailUrl: 'https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=300',
            gender: 'MALE',
            slides: [
                { mediaUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600', type: 'IMAGE', duration: 5000, order: 0 },
                { mediaUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600', type: 'IMAGE', duration: 5000, order: 1 }
            ]
        }
    ];

    for (const g of groups) {
        const { slides, ...groupData } = g;
        const createdGroup = await prisma.storyGroup.create({
            data: {
                ...groupData as any,
                slides: {
                    create: slides
                }
            }
        });
        console.log(`Created group: ${createdGroup.name} with ${slides.length} slides.`);
    }

    console.log('--- Seeding Done Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
