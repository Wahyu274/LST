import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { productSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';
import { withPermission, withAuth } from '@/lib/auth/guard';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { sku: { contains: search } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status === 'ARCHIVED') {
      where.deletedAt = { not: null };
    } else if (status) {
      where.status = status;
      where.deletedAt = null;
    } else {
      where.deletedAt = null;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const POST = withPermission('product.create', async (req: NextRequest, session) => {
  try {
    const body = await req.json();
    const validation = validateInput(productSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku,
        categoryId: validated.categoryId,
        brand: validated.brand,
        shortDescription: validated.shortDescription,
        description: validated.description,
        specifications: validated.specifications,
        price: validated.price,
        showPrice: validated.showPrice,
        availability: validated.availability,
        status: validated.status,
        isFeatured: validated.isFeatured,
        imageUrl: validated.imageUrl,
      } as any,
    });

    // Log Audit
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'CREATE',
        resource: 'Product',
        details: `User ${session.email} created product "${product.name}" (${product.id})`,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
});

export const PUT = withPermission('product.update', async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    const body = await req.json();
    const validation = validateInput(productSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        slug: validated.slug,
        sku: validated.sku,
        categoryId: validated.categoryId,
        brand: validated.brand,
        shortDescription: validated.shortDescription,
        description: validated.description,
        specifications: validated.specifications,
        price: validated.price,
        showPrice: validated.showPrice,
        availability: validated.availability,
        status: validated.status,
        isFeatured: validated.isFeatured,
        imageUrl: validated.imageUrl,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'UPDATE',
        resource: 'Product',
        details: `User ${session.email} updated product "${product.name}" (${product.id})`,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
});

export const DELETE = withPermission('product.archive', async (req: NextRequest, session) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    if (permanent) {
      await prisma.product.delete({ where: { id } });
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'PERMANENT_DELETE',
          resource: 'Product',
          details: `User ${session.email} hard deleted product ID ${id}`,
        },
      });
    } else {
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
      });
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'ARCHIVE',
          resource: 'Product',
          details: `User ${session.email} archived product ID ${id}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
});
