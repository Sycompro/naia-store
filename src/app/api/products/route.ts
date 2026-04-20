export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Prisma, Gender, PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/lib/utils/validation';
import { 
  createProductSchema, 
  updateProductSchema, 
  paginationSchema 
} from '@/lib/utils/validation';
import { handleError, ForbiddenError, NotFoundError, ValidationAppError } from '@/lib/utils/errors';
import { createContextLogger } from '@/lib/utils/logger';
import { requireAdmin } from '@/middleware/auth';

const logger = createContextLogger('ProductsAPI');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '20',
      search: searchParams.get('search') || undefined,
      gender: searchParams.get('gender')?.toUpperCase() as 'MALE' | 'FEMALE' | 'UNISEX' | undefined,
      stockBelow: searchParams.get('stockBelow') || undefined,
    };

    const validation = validateRequest(paginationSchema, params);
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Parámetros inválidos');
    }

    const { page, pageSize, search, gender, stockBelow } = validation.data!;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ProductWhereInput = {};
    
    if (gender) {
      where.gender = gender;
    }

    if (stockBelow) {
      where.stock = { lte: parseInt(stockBelow) };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Math.min(pageSize, 100),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    logger.info('Products fetched', { count: products.length, page, pageSize });

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
    logger.error('Error fetching products', error);
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin(request as unknown as import('next/server').NextRequest);
    
    const body = await request.json();
    const validation = validateRequest(createProductSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const { 
      name, 
      barcode, 
      description, 
      unitPrice, 
      wholesalePrice, 
      presentation, 
      category, 
      gender, 
      imageUrl, 
      stock 
    } = validation.data!;

    const product = await prisma.product.create({
      data: {
        name,
        barcode: barcode || null,
        description: description || null,
        unitPrice: new Prisma.Decimal(unitPrice),
        wholesalePrice: new Prisma.Decimal(wholesalePrice),
        presentation: presentation || 'Unidad',
        category: category || 'General',
        gender: gender || 'FEMALE',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571',
        stock: stock || 0,
      }
    });

    logger.info('Product created', { productId: product.id });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    logger.error('Error creating product', error);
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin(request as unknown as import('next/server').NextRequest);
    
    const body = await request.json();
    const validation = validateRequest(updateProductSchema, body);
    
    if (!validation.success) {
      throw new ValidationAppError(validation.error || 'Datos inválidos');
    }

    const { id, ...data } = validation.data!;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new NotFoundError('Producto');
    }

    const updateData: Prisma.ProductUpdateInput = { ...data };
    
    if (data.unitPrice !== undefined) {
      updateData.unitPrice = new Prisma.Decimal(data.unitPrice);
    }
    if (data.wholesalePrice !== undefined) {
      updateData.wholesalePrice = new Prisma.Decimal(data.wholesalePrice);
    }
    if (data.gender !== undefined) {
      updateData.gender = data.gender;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });

    logger.info('Product updated', { productId: product.id });
    
    return NextResponse.json(product);
  } catch (error) {
    logger.error('Error updating product', error);
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin(request as unknown as import('next/server').NextRequest);
    
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    
    if (!idParam) {
      throw new ValidationAppError('ID requerido');
    }

    const id = parseInt(idParam);
    
    if (isNaN(id) || id <= 0) {
      throw new ValidationAppError('ID inválido');
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new NotFoundError('Producto');
    }

    await prisma.product.delete({
      where: { id }
    });

    logger.info('Product deleted', { productId: id });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting product', error);
    return handleError(error);
  }
}