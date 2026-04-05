export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get('gender');

        // Fallback filtering
        const allStories = await prisma.story.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        const filteredStories = allStories.filter(story => {
            if (gender === 'MALE') return story.title.includes('[MALE]');
            return !story.title.includes('[MALE]');
        });

        return NextResponse.json(filteredStories);
    } catch (error) {
        console.error('API Stories Error:', error);
        return NextResponse.json([]);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const title = body.gender === 'MALE' ? `[MALE] ${body.title}` : body.title;

        const story = await prisma.story.create({
            data: {
                title: title,
                imageUrl: body.imageUrl,
                isActive: true,
            }
        });
        return NextResponse.json(story);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
    }
}
