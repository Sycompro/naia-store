export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (!token) return false;
        const payload = await verifyToken(token);
        return payload && payload.role === 'ADMIN';
    } catch (e) {
        return false;
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        const order = await prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

        return NextResponse.json({
            ...order,
            items: JSON.parse(order.items)
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener pedido' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    try {
        const { id: rawId } = await params;
        const { status } = await request.json();
        const id = parseInt(rawId);

        if (isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

        const order = await prisma.order.update({
            where: { id },
            data: { status: (status.toUpperCase()) as any }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 });
    }
}
