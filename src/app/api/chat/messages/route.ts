export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest, sendMessageDirectSchema, paginationSchema } from '@/lib/utils/validation';
import { handleError, NotFoundError, ValidationAppError, UnauthorizedError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';
import { verifyAuth, requireAdmin } from '@/middleware/auth';

const logger = createContextLogger('MessagesAPI');

export async function GET(request: Request) {
  try {
    const admin = await verifyAuth(request as unknown as import('next/server').NextRequest);
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedError('Acceso denegado');
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const phone = searchParams.get('phone');

    if (!conversationId && !phone) {
      throw new ValidationAppError('conversationId o phone son requeridos');
    }

    const query: Record<string, unknown> = {};
    if (conversationId) {
      query.conversationId = conversationId;
    } else if (phone) {
      query.conversation = { phone };
    }

    const messages = await prisma.message.findMany({
      where: query,
      orderBy: { createdAt: 'asc' },
    });

    if (phone) {
      await prisma.conversation.updateMany({
        where: { phone },
        data: { unreadCount: 0 }
      });
      logger.info('Messages marked as read', { phone });
    }

    return NextResponse.json(messages);
  } catch (error) {
    logger.error('Error fetching messages', error);
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAuth(request as unknown as import('next/server').NextRequest);
    
    if (!admin || admin.role !== 'ADMIN') {
      throw new UnauthorizedError('Acceso denegado');
    }

    const body = await request.json();
    const validation = validateRequest(sendMessageDirectSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const { conversationId, phone, content, type, sender } = validation.data!;
    let targetConversationId = conversationId;

    if (!targetConversationId && phone) {
      const conversation = await prisma.conversation.upsert({
        where: { phone },
        update: { lastMessage: content, updatedAt: new Date() },
        create: {
          phone,
          lastMessage: content,
          status: 'OPEN'
        }
      });
      targetConversationId = conversation.id;
    }

    if (!targetConversationId) {
      throw new ValidationAppError('conversationId o phone son requeridos');
    }

    const message = await prisma.message.create({
      data: {
        conversationId: targetConversationId,
        content,
        sender: sender || 'ADMIN',
        type: type || 'TEXT',
      }
    });

    await prisma.conversation.update({
      where: { id: targetConversationId },
      data: {
        lastMessage: content,
        updatedAt: new Date(),
        unreadCount: sender === 'USER' ? { increment: 1 } : 0
      }
    });

    if (sender === 'ADMIN') {
      const conv = targetConversationId 
        ? await prisma.conversation.findUnique({ where: { id: targetConversationId }, select: { phone: true } })
        : null;
      
      if (conv?.phone) {
        try {
          const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
          const waResult = await sendWhatsAppMessage(conv.phone, content);
          
          if (waResult.messageId) {
            await prisma.message.update({
              where: { id: message.id },
              data: { externalId: waResult.messageId }
            });
          }
        } catch (waError) {
          logger.error('WhatsApp send failed', waError);
        }
      }
    }

    logger.info('Message sent', { conversationId: targetConversationId });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    logger.error('Error sending message', error);
    return handleError(error);
  }
}