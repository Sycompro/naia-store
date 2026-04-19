export const dynamic = 'force-dynamic';
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

        const slide = await prisma.storySlide.update({
            where: { id },
            data: {
                mediaUrl: body.mediaUrl,
                type: body.type,
                duration: body.duration,
                order: body.order
            }
        });
        return NextResponse.json(slide);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        await prisma.storySlide.delete({ where: { id } });
        return NextResponse.json({ message: 'Slide deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
    }
}
