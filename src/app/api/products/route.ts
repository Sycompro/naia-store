import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const gender = searchParams.get('gender')?.toUpperCase();
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '20');
        const skip = (page - 1) * pageSize;

        const where: any = {};
        if (gender && (gender === 'MALE' || gender === 'FEMALE' || gender === 'UNISEX')) {
            where.gender = gender;
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
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
                unitPrice: new Prisma.Decimal(body.unitPrice || 0) as any,
                wholesalePrice: new Prisma.Decimal(body.wholesalePrice || 0) as any,
                presentation: body.presentation || 'Unidad',
                category: body.category || 'General',
                gender: (body.gender?.toUpperCase() || 'FEMALE') as any,
                imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
                stock: parseInt(body.stock) || 0
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
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        // Handle price conversions if they exist in the body
        const updateData: any = { ...data };
        if (data.unitPrice !== undefined) updateData.unitPrice = new Prisma.Decimal(data.unitPrice || 0) as any;
        if (data.wholesalePrice !== undefined) updateData.wholesalePrice = new Prisma.Decimal(data.wholesalePrice || 0) as any;
        if (data.stock !== undefined) updateData.stock = parseInt(data.stock) || 0;
        if (data.gender !== undefined) updateData.gender = (data.gender.toUpperCase()) as any;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
    }
}

