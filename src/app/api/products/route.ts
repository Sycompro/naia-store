import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description || '',
                unitPrice: parseFloat(body.unitPrice),
                wholesalePrice: parseFloat(body.wholesalePrice),
                presentation: body.presentation,
                category: body.category || 'General',
                gender: body.gender || 'FEMALE',
                imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
