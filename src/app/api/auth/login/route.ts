export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';
import { validateRequest, loginSchema } from '@/lib/utils/validation';
import { handleError, UnauthorizedError, ValidationAppError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';

const logger = createContextLogger('AuthAPI');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRequest(loginSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Credenciales inválidas');
    }

    const { email, password } = validation.data!;

    const user = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (!user) {
      logger.warn('Login failed: user not found', { email });
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isMatch = await comparePassword(password, user.password);
    
    if (!isMatch) {
      logger.warn('Login failed: wrong password', { email });
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = await signToken({ 
      userId: user.id, 
      role: user.role, 
      email: user.email 
    });

    logger.info('User logged in', { userId: user.id });

    const response = NextResponse.json({
      message: 'Logueado con éxito',
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
    logger.error('Login error', error);
    return handleError(error);
  }
}