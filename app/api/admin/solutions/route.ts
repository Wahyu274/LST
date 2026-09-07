import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { serviceSolutionSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const solutions = await prisma.serviceSolution.findMany({
      where: { deletedAt: null } as any,
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: solutions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateInput(serviceSolutionSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const solution = await prisma.serviceSolution.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        iconName: validated.iconName,
        tagline: validated.tagline,
        problemText: validated.problemText,
        scopeText: validated.scopeText,
        processText: validated.processText,
        imageUrl: body.imageUrl || null,
        status: validated.status,
        isFeatured: validated.isFeatured,
        sortOrder: validated.sortOrder,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'ServiceSolution',
        details: `Created solution "${solution.title}"`,
      },
    });

    return NextResponse.json({ success: true, data: solution });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Solution ID required' }, { status: 400 });

    const body = await req.json();
    const validation = validateInput(serviceSolutionSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const solution = await prisma.serviceSolution.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        iconName: validated.iconName,
        tagline: validated.tagline,
        problemText: validated.problemText,
        scopeText: validated.scopeText,
        processText: validated.processText,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
        status: validated.status,
        isFeatured: validated.isFeatured,
        sortOrder: validated.sortOrder,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'ServiceSolution',
        details: `Updated solution "${solution.title}" (${id})`,
      },
    });

    return NextResponse.json({ success: true, data: solution });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Solution ID required' }, { status: 400 });

    await prisma.serviceSolution.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
