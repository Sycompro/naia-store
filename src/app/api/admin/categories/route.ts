export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return false;
    try {
        const payload = await verifyToken(token);
        return payload && payload.role === 'ADMIN';
    } catch (e) { return false; }
}

export async function GET() {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    try {
        const categories = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                _all: true
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
