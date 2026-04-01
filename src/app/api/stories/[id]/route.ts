import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
