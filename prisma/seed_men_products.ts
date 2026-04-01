import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'Limpiador Facial Carbon Activo',
            description: 'Limpieza profunda para piel de hombre. Elimina impurezas y exceso de grasa.',
            unitPrice: 15.00,
            wholesalePrice: 12.00,
            presentation: '200ml',
            category: 'Facial',
            gender: 'MALE',
            imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=300',
        },
        {
            name: 'Serum Hidratante Matte',
            description: 'Hidratación intensa sin brillo. Efecto refrescante instantáneo.',
            unitPrice: 22.00,
            wholesalePrice: 18.00,
            presentation: '50ml',
            category: 'Facial',
            gender: 'MALE',
            imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?q=80&w=300',
        },
        {
            name: 'Aceite de Barba Premium',
            description: 'Nutre y suaviza el vello facial. Aroma a sándalo y cedro.',
            unitPrice: 18.00,
            wholesalePrice: 14.00,
            presentation: '30ml',
            category: 'Barba',
            gender: 'MALE',
            imageUrl: '/men-story-2.png',
        },
        {
            name: 'Shampoo Energizante 3 en 1',
            description: 'Limpieza total para cabello, barba y cuerpo. Con mentol revitalizante.',
            unitPrice: 12.00,
            wholesalePrice: 10.00,
            presentation: '500ml',
            category: 'Capilar',
            gender: 'MALE',
            imageUrl: '/men-story-1.png',
        }
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    console.log('Men products seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
