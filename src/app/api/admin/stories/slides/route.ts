export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get('groupId');
        if (!groupId) return NextResponse.json({ error: 'groupId required' }, { status: 400 });

        const slides = await prisma.storySlide.findMany({
            where: { groupId: parseInt(groupId) },
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(slides);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const slide = await prisma.storySlide.create({
            data: {
                groupId: parseInt(body.groupId),
                mediaUrl: body.mediaUrl,
                type: body.type || 'IMAGE',
                duration: body.duration || 5000,
                order: body.order || 0
            }
        });
        return NextResponse.json(slide);
    } catch (error) {
        console.error('Create slide error:', error);
        return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
    }
}
