import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getRoleFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !(await verifyToken(token)) || (await getRoleFromToken(token)) !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        // @ts-ignore - Prisma might be out of sync
        let settings = await prisma.setting.findUnique({
            where: { id: 1 }
        });

        if (!settings) {
            // @ts-ignore
            settings = await prisma.setting.create({
                data: { id: 1 }
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !(await verifyToken(token)) || (await getRoleFromToken(token)) !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const body = await request.json();

        // Ignoramos el campo id y updatedAt del body para evitar errores
        const { id, updatedAt, ...updateData } = body;

        // @ts-ignore
        const settings = await prisma.setting.upsert({
            where: { id: 1 },
            update: updateData,
            create: { id: 1, ...updateData }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 });
    }
}
