import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { UserRole } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-only-for-local'
);

export interface AuthUser {
  userId: number;
  role: UserRole;
  email: string;
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      userId: payload.userId as number,
      role: payload.role as UserRole,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request);
  
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  
  return user;
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request);
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  
  return user;
}

export function createAuthResponse(user: AuthUser, basePath: string = '/'): NextResponse {
  const response = NextResponse.redirect(new URL(basePath, request.url));
  return response;
}

export function clearAuth(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  return response;
}