export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { validateRequest, createOrderSchema } from '@/lib/utils/validation';
import { handleError, UnauthorizedError, ValidationAppError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';
import { verifyAuth, requireAuth } from '@/middleware/auth';

const logger = createContextLogger('OrdersAPI');

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request as unknown as import('next/server').NextRequest);
    
    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100);
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where: { userId: user.userId } })
    ]);

    const parsedOrders = orders.map(o => ({
      ...o,
      items: JSON.parse(o.items as string)
    }));

    logger.info('Orders fetched', { userId: user.userId, count: orders.length });

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
    logger.error('Error fetching orders', error);
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request as unknown as import('next/server').NextRequest);
    
    const body = await request.json();
    const validation = validateRequest(createOrderSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const { items, total, note, customerName, customerPhone, customerAddress } = validation.data!;

    const order = await prisma.order.create({
      data: {
        userId: user?.userId,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerAddress: customerAddress || null,
        items: JSON.stringify(items),
        total: new Prisma.Decimal(total),
        note: note || null,
        status: 'PENDIENTE'
      }
    });

    logger.info('Order created', { orderId: order.id, userId: user?.userId });

    // Send WhatsApp notification (non-blocking)
    sendOrderNotification(order.id, user?.userId, total, note)
      .catch(err => logger.error('WhatsApp notification failed', err));

    return NextResponse.json({ 
      message: 'Pedido creado', 
      order: { ...order, items } 
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating order', error);
    return handleError(error);
  }
}

async function sendOrderNotification(
  orderId: number, 
  userId: number | undefined,
  total: number, 
  note: string | undefined
) {
  const settings = await prisma.setting.findFirst({ 
    where: { id: 1 } 
  });

  if (!settings?.notifyOrderWS) return;

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { phone: true }
  });

  if (!admin?.phone) return;

  const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
  
  const message = `🛍️ *Nuevo Pedido Naia*\n\n` +
    `ID: #${String(orderId).padStart(5, '0')}\n` +
    `Total: S/ ${total.toFixed(2)}\n` +
    `Nota: ${note || 'Ninguna'}\n\n` +
    `Revisa los detalles en el panel.`;

  await sendWhatsAppMessage(admin.phone, message);
}