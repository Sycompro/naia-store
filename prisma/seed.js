const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.product.deleteMany();
    await prisma.story.deleteMany();

    // Seed Products
    const products = [
        {
            name: 'Sérum Facial Vitamina C',
            description: 'Potente antioxidante para iluminar y proteger tu piel.',
            unitPrice: 25.00,
            wholesalePrice: 18.50,
            presentation: 'Unidad (30ml)',
            category: 'Facial',
            gender: 'FEMALE',
            isBestSeller: true,
            stock: 50,
            imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143af7be?q=80&w=400&h=400&auto=format&fit=crop'
        },
        {
            name: 'Mascarilla Capilar Keratina',
            description: 'Tratamiento intensivo para cabellos dañados y secos.',
            unitPrice: 45.00,
            wholesalePrice: 32.00,
            presentation: 'Pote 500g',
            category: 'Capilar',
            gender: 'FEMALE',
            isBestSeller: false,
            stock: 30,
            imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e738589?q=80&w=400&h=400&auto=format&fit=crop'
        },
        {
            name: 'Pack Limpieza Profunda',
            description: 'Kit completo de limpieza facial diaria.',
            unitPrice: 120.00,
            wholesalePrice: 95.00,
            presentation: 'Caja Regalo',
            category: 'Sets',
            gender: 'FEMALE',
            isBestSeller: true,
            stock: 15,
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&h=400&auto=format&fit=crop'
        },
        {
            name: 'Aceite de Argán Puro',
            description: 'Hidratación profunda para rostro y cabello.',
            unitPrice: 35.00,
            wholesalePrice: 25.00,
            presentation: 'Frasco 100ml',
            category: 'Capilar',
            gender: 'FEMALE',
            isBestSeller: false,
            stock: 40,
            imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=400&h=400&auto=format&fit=crop'
        },
        {
            name: 'Bálsamo Labial Hidratante',
            description: 'Cuidado intensivo para labios secos.',
            unitPrice: 10.00,
            wholesalePrice: 7.50,
            presentation: 'Stick 5g',
            category: 'Facial',
            gender: 'FEMALE',
            isBestSeller: false,
            stock: 100,
            imageUrl: 'https://images.unsplash.com/photo-1599733589046-10c005739ef0?q=80&w=400&h=400&auto=format&fit=crop'
        }
    ];

    for (const product of products) {
        await prisma.product.create({ data: product });
    }

    // Seed Stories
    const stories = [
        { title: 'Ofertas', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=200&h=200&auto=format&fit=crop' },
        { title: 'Facial', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200&h=200&auto=format&fit=crop' },
        { title: 'Capilar', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=200&h=200&auto=format&fit=crop' },
        { title: 'Skincare', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=200&h=200&auto=format&fit=crop' },
        { title: 'Nuevos', imageUrl: 'https://images.unsplash.com/photo-1512496011212-323a784629c7?q=80&w=200&h=200&auto=format&fit=crop' },
        { title: 'Hombres', imageUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=200&h=200&auto=format&fit=crop' },
    ];

    for (const story of stories) {
        await prisma.story.create({ data: story });
    }

    console.log('Seeding finished successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
