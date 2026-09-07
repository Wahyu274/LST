import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { portfolioSchema } from '@/lib/validations/schemas';
import { validateInput } from '@/lib/validations/validate';

export async function GET() {
  try {
    const items = await prisma.portfolioProject.findMany({
      where: { deletedAt: null } as any,
      orderBy: { title: 'asc' } as any,
    });
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateInput(portfolioSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const portfolio = await prisma.portfolioProject.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        sector: validated.sector,
        location: validated.location,
        solutionType: validated.solutionType,
        challengeText: validated.challengeText,
        scopeText: validated.scopeText,
        resultText: validated.resultText,
        coverImageUrl: validated.coverImageUrl,
        status: validated.status,
        isPublished: validated.isPublished,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'PortfolioProject',
        details: `Created portfolio "${portfolio.title}"`,
      },
    });

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Portfolio ID required' }, { status: 400 });

    const body = await req.json();
    const validation = validateInput(portfolioSchema, body);
    if (!validation.success || !validation.data) {
      return validation.response!;
    }
    const validated = validation.data;

    const portfolio = await prisma.portfolioProject.update({
      where: { id },
      data: {
        title: validated.title,
        slug: validated.slug,
        sector: validated.sector,
        location: validated.location,
        solutionType: validated.solutionType,
        challengeText: validated.challengeText,
        scopeText: validated.scopeText,
        resultText: validated.resultText,
        coverImageUrl: validated.coverImageUrl,
        status: validated.status,
        isPublished: validated.isPublished,
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'PortfolioProject',
        details: `Updated portfolio "${portfolio.title}"`,
      },
    });

    return NextResponse.json({ success: true, data: portfolio });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Portfolio ID required' }, { status: 400 });

    await prisma.portfolioProject.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
