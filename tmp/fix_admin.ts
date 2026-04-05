import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const updatedUser = await prisma.user.update({
        where: { email: 'admin@naia.com' },
        data: { role: 'ADMIN' }
    });
    console.log('User upgraded to ADMIN:', JSON.stringify(updatedUser, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
