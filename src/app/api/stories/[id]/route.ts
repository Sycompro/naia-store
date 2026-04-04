import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        const body = await request.json();

        const story = await prisma.story.update({
            where: { id },
            data: {
                title: body.title,
                imageUrl: body.imageUrl,
                gender: body.gender,
                isActive: body.isActive ?? true
            }
        });

        return NextResponse.json(story);
    } catch (error) {
        console.error('Update story error:', error);
        return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        await prisma.story.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Story deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
}
