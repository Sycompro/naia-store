export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';
import { validateRequest, registerSchema } from '@/lib/utils/validation';
import { handleError, ConflictError, ValidationAppError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';

const logger = createContextLogger('RegisterAPI');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(registerSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const { email, password, name, phone } = validation.data!;

    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      throw new ConflictError('El email ya está registrado');
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
        role: 'USER'
      }
    });

    const token = await signToken({ 
      userId: user.id, 
      role: user.role, 
      email: user.email 
    });

    logger.info('User registered', { userId: user.id });

    const response = NextResponse.json({
      message: 'Registrado con éxito',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return response;
  } catch (error) {
    logger.error('Register error', error);
    return handleError(error);
  }
}