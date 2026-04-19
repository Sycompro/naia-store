export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get('gender')?.toUpperCase();

        const where: any = { isActive: true };
        if (gender && (gender === 'MALE' || gender === 'FEMALE' || gender === 'UNISEX')) {
            where.gender = gender as any;
        }

        const groups = await prisma.storyGroup.findMany({
            where,
            include: {
                slides: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(groups);
    } catch (error) {
        console.error('API Stories Error:', error);
        return NextResponse.json([]);
    }
}
