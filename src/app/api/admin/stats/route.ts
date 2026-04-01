import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') return null;
    return payload;
}

export async function GET() {
    try {
        const admin = await getAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const [totalProducts, totalUsers, totalOrders, products, recentOrders, orders] = await Promise.all([
            prisma.product.count(),
            prisma.user.count(),
            prisma.order.count(),
            prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                select: { id: true, name: true, stock: true, category: true, unitPrice: true, imageUrl: true }
            }),
            prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } }
            }),
            prisma.order.findMany({
                select: { total: true, createdAt: true, status: true }
            })
        ]);

        // Calculate revenue
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

        // Monthly sales (last 6 months)
        const monthlySales: { month: string; total: number; count: number }[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthOrders = orders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= date && d < nextDate;
            });
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            monthlySales.push({
                month: monthNames[date.getMonth()],
                total: monthOrders.reduce((s, o) => s + o.total, 0),
                count: monthOrders.length
            });
        }

        // Low stock products
        const lowStock = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);

        // Parse recent orders items
        const parsedRecentOrders = recentOrders.map(o => ({
            ...o,
            items: JSON.parse(o.items)
        }));

        return NextResponse.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            monthlySales,
            lowStock,
            recentOrders: parsedRecentOrders,
            products
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
    }
}
