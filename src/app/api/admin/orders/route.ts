import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return payload && payload.role === 'ADMIN';
}

export async function GET(request: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const status = searchParams.get('status');
        const skip = (page - 1) * pageSize;

        const where: any = {};
        if (status) where.status = status.toUpperCase();

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } }
            }),
            prisma.order.count({ where })
        ]);

        const parsedOrders = orders.map(o => ({
            ...o,
            items: JSON.parse(o.items)
        }));

        return NextResponse.json({
            orders: parsedOrders,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }
}
