export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('API Product GET Error:', error);
        return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);
        const body = await request.json();

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                unitPrice: parseFloat(body.unitPrice),
                wholesalePrice: parseFloat(body.wholesalePrice),
                presentation: body.presentation,
                category: body.category,
                gender: body.gender,
                imageUrl: body.imageUrl,
                isBestSeller: body.isBestSeller,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
