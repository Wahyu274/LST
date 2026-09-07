import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { faqSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { deletedAt: null } as any,
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    const categories = await prisma.fAQCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: faqs, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateInput(faqSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    let finalCatId = validated.categoryId;
    if (!finalCatId) {
      let defaultCat = await prisma.fAQCategory.findFirst();
      if (!defaultCat) {
        defaultCat = await prisma.fAQCategory.create({
          data: { name: 'Umum & Layanan', slug: 'umum-layanan' },
        });
      }
      finalCatId = defaultCat.id;
    }

    const faq = await prisma.fAQ.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        categoryId: finalCatId,
        syncToAI: validated.syncToAI ?? true,
        status: validated.status || 'PUBLISHED',
        sortOrder: validated.sortOrder || 0,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'FAQ',
        details: `Created FAQ "${faq.question}"`,
      },
    });

    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    const body = await req.json();
    const validation = validateInput(faqSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: validated.question,
        answer: validated.answer,
        ...(validated.categoryId ? { categoryId: validated.categoryId } : {}),
        syncToAI: validated.syncToAI ?? true,
        status: validated.status || 'PUBLISHED',
        sortOrder: validated.sortOrder || 0,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'FAQ',
        details: `Updated FAQ "${faq.question}" (${id})`,
      },
    });

    return NextResponse.json({ success: true, data: faq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'FAQ ID required' }, { status: 400 });

    await prisma.fAQ.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'FAQ',
        details: `Archived FAQ ID ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
