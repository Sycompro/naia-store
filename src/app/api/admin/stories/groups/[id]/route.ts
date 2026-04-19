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

        const group = await prisma.storyGroup.update({
            where: { id },
            data: {
                name: body.name,
                thumbnailUrl: body.thumbnailUrl,
                gender: body.gender,
                isActive: body.isActive ?? true
            }
        });
        return NextResponse.json(group);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        await prisma.storyGroup.delete({ where: { id } });
        return NextResponse.json({ message: 'Group deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
    }
}
