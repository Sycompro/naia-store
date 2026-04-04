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

        // Calculate revenue (excluding CANCELADO)
        const activeOrders = orders.filter(o => o.status !== 'CANCELADO');
        const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

        // Monthly sales (last 6 months)
        const monthlySales: { month: string; total: number; count: number }[] = [];
        const now = new Date();

        // Month comparison for real trends
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let currentMonthRevenue = 0;
        let prevMonthRevenue = 0;

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

            const monthOrders = activeOrders.filter(o => {
                const d = new Date(o.createdAt);
                return d >= date && d < nextDate;
            });

            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const rev = monthOrders.reduce((s, o) => s + Number(o.total || 0), 0);

            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) currentMonthRevenue = rev;
            if (date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear) prevMonthRevenue = rev;

            monthlySales.push({
                month: monthNames[date.getMonth()],
                total: rev,
                count: monthOrders.length
            });
        }

        // Calculate Revenue Trend
        let revenueTrend = 0;
        if (prevMonthRevenue > 0) {
            revenueTrend = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
        } else if (currentMonthRevenue > 0) {
            revenueTrend = 100;
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
            revenueTrend, // New field for real percentages
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
