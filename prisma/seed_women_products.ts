import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'Crema Hidratante de Rosas',
            description: 'Hidratación profunda con extracto de rosas naturales. Ideal para pieles sensibles.',
            unitPrice: 25.00,
            wholesalePrice: 20.00,
            presentation: '50g',
            category: 'Facial',
            gender: 'FEMALE',
            imageUrl: 'https://images.unsplash.com/photo-1570172619666-acfa94838634?q=80&w=300',
        },
        {
            name: 'Aceite Capilar de Argán',
            description: 'Brillo y suavidad extrema para tu cabello. Oro líquido de Marruecos.',
            unitPrice: 30.00,
            wholesalePrice: 24.00,
            presentation: '100ml',
            category: 'Capilar',
            gender: 'FEMALE',
            imageUrl: 'https://images.unsplash.com/photo-1626784213176-f48d8055ca51?q=80&w=300',
        },
        {
            name: 'Serum de Vitamina C',
            description: 'Antioxidante potente para una piel radiante. Combate manchas y líneas de expresión.',
            unitPrice: 35.00,
            wholesalePrice: 28.00,
            presentation: '30ml',
            category: 'Facial',
            gender: 'FEMALE',
            imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?q=80&w=300',
        }
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    console.log('Women products seeded in Production!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
