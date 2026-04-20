export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleError, UnauthorizedError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';
import { verifyAuth } from '@/middleware/auth';

const logger = createContextLogger('StatsAPI');

interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export async function GET(request: Request) {
  try {
    const admin = await verifyAuth(request as unknown as import('next/server').NextRequest);
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedError('Acceso denegado');
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

    const activeOrders = orders.filter(o => o.status !== 'CANCELADO');
    const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    const monthlySales = calculateMonthlySales(activeOrders, 6);

    const currentMonthRevenue = monthlySales[monthlySales.length - 1]?.total || 0;
    const prevMonthRevenue = monthlySales[monthlySales.length - 2]?.total || 0;
    
    let revenueTrend = 0;
    if (prevMonthRevenue > 0) {
      revenueTrend = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      revenueTrend = 100;
    }

    const lowStock = products
      .filter(p => p.stock < 10)
      .sort((a, b) => a.stock - b.stock);

    const parsedRecentOrders = recentOrders.map(o => ({
      ...o,
      items: JSON.parse(o.items as string)
    }));

    logger.info('Stats fetched', { totalOrders, totalRevenue: totalRevenue.toFixed(2) });

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      revenueTrend,
      monthlySales,
      lowStock,
      recentOrders: parsedRecentOrders,
      products
    });
  } catch (error) {
    logger.error('Error fetching stats', error);
    return handleError(error);
  }
}

function calculateMonthlySales(orders: Array<{ total: unknown; createdAt: Date; status: string }>, months: number): MonthlyData[] {
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const now = new Date();
  const result: MonthlyData[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const monthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= date && d < nextDate;
    });

    const total = monthOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    result.push({
      month: monthNames[date.getMonth()],
      total: Math.round(total * 100) / 100,
      count: monthOrders.length
    });
  }

  return result;
}