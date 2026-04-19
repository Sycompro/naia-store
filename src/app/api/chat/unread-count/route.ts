import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const aggregate = await prisma.conversation.aggregate({
            where: {
                status: 'OPEN'
            },
            _sum: {
                unreadCount: true
            }
        });

        return NextResponse.json({
            count: aggregate._sum.unreadCount || 0
        });
    } catch (error) {
        return NextResponse.json({ count: 0 });
    }
}
