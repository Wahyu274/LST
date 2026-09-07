import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { deletedAt: null } as any,
      orderBy: { sortOrder: 'asc' } as any,
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, sortOrder, status } = body;

    const category = await prisma.productCategory.create({
      data: {
        name,
        slug,
        description,
        sortOrder: sortOrder || 0,
        status: status || 'PUBLISHED',
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'ProductCategory',
        details: `Created category "${category.name}"`,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });

    const body = await req.json();
    const { name, slug, description, sortOrder, status } = body;

    const category = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        sortOrder: sortOrder || 0,
        status: status || 'PUBLISHED',
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'ProductCategory',
        details: `Updated category "${category.name}" (${id})`,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });

    await prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'ProductCategory',
        details: `Archived category ID ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

