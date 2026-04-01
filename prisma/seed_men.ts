import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Men's Stories
    const stories = [
        {
            title: 'Facial Masculino',
            imageUrl: '/C:/Users/Administrador/.gemini/antigravity/brain/f5ca64bf-284f-4edb-b9ed-4809d5c8ba4b/naia_men_story_face_wash_1775012610467.png',
            gender: 'MALE',
            isActive: true,
        },
        {
            title: 'Kit Barba Premium',
            imageUrl: '/C:/Users/Administrador/.gemini/antigravity/brain/f5ca64bf-284f-4edb-b9ed-4809d5c8ba4b/naia_men_story_beard_oil_kit_1775012625996.png',
            gender: 'MALE',
            isActive: true,
        }
    ];

    for (const story of stories) {
        // @ts-ignore - unblock if types aren't synced
        await prisma.story.create({ data: story });
    }

    console.log('Men stories seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
