import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return false;
    const payload = await verifyToken(token);
    return payload && payload.role === 'ADMIN';
}

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
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
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

export async function PATCH(request: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    try {
        const { id, stock } = await request.json();
        if (!id || stock === undefined) {
            return NextResponse.json({ error: 'ID y stock requeridos' }, { status: 400 });
        }
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { stock: parseInt(stock) }
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Error al actualizar stock' }, { status: 500 });
    }
}

