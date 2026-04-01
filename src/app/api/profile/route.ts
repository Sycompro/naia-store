import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    return payload;
}

export async function GET() {
    try {
        const tokenUser = await getUser();
        if (!tokenUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: tokenUser.userId as number },
            select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const tokenUser = await getUser();
        if (!tokenUser) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { name, phone } = await request.json();

        const user = await prisma.user.update({
            where: { id: tokenUser.userId as number },
            data: {
                ...(name !== undefined && { name }),
                ...(phone !== undefined && { phone })
            },
            select: { id: true, email: true, name: true, phone: true, role: true }
        });

        return NextResponse.json({ message: 'Perfil actualizado', user });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}
