export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { validateRequest, updateOrderSchema, updateOrderStatusSchema } from '@/lib/utils/validation';
import { handleError, NotFoundError, ValidationAppError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';
import { requireAdmin } from '@/middleware/auth';

const logger = createContextLogger('AdminOrderAPI');

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request as unknown as import('next/server').NextRequest);
    
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    
    if (isNaN(id) || id <= 0) {
      throw new ValidationAppError('ID inválido');
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { 
        user: { 
          select: { id: true, name: true, email: true, phone: true } 
        } 
      }
    });

    if (!order) {
      throw new NotFoundError('Pedido');
    }

    logger.info('Order fetched', { orderId: order.id });

    return NextResponse.json({
      ...order,
      items: JSON.parse(order.items as string)
    });
  } catch (error) {
    logger.error('Error fetching order', error);
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request as unknown as import('next/server').NextRequest);
    
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    
    if (isNaN(id) || id <= 0) {
      throw new ValidationAppError('ID inválido');
    }

    const body = await request.json();
    const validation = validateRequest(updateOrderSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      throw new NotFoundError('Pedido');
    }

    const updateData: Prisma.OrderUpdateInput = {};
    
    if (validation.data!.customerName !== undefined) {
      updateData.customerName = validation.data.customerName;
    }
    if (validation.data!.customerPhone !== undefined) {
      updateData.customerPhone = validation.data.customerPhone;
    }
    if (validation.data!.note !== undefined) {
      updateData.note = validation.data.note;
    }
    if (validation.data!.status !== undefined) {
      updateData.status = validation.data.status;
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData
    });

    logger.info('Order updated', { orderId: order.id, status: order.status });

    return NextResponse.json(order);
  } catch (error) {
    logger.error('Error updating order', error);
    return handleError(error);
  }
}