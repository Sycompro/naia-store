export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const groups = await prisma.storyGroup.findMany({
            include: {
                _count: {
                    select: { slides: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(groups);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const group = await prisma.storyGroup.create({
            data: {
                name: body.name,
                thumbnailUrl: body.thumbnailUrl,
                gender: body.gender || 'FEMALE',
                isActive: true
            }
        });
        return NextResponse.json(group);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
    }
}
