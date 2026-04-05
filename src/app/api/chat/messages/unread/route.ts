export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getRoleFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !(await verifyToken(token)) || (await getRoleFromToken(token)) !== 'ADMIN') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const unreadCount = await prisma.conversation.aggregate({
            _sum: { unreadCount: true }
        });

        return NextResponse.json({ count: unreadCount._sum.unreadCount || 0 });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return NextResponse.json({ count: 0 });
    }
}
