const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@naia.com' },
        update: {
            password: hashedPassword,
            role: 'ADMIN'
        },
        create: {
            email: 'admin@naia.com',
            name: 'Administrador Naia',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('Admin user created/updated:', user.email);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
