import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const partners = await prisma.partnerLogo.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, data: partners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, logoUrl, category, sortOrder, status } = body;

    if (!name || !logoUrl) {
      return NextResponse.json({ success: false, error: 'Nama dan Logo URL wajib diisi' }, { status: 400 });
    }

    const partner = await prisma.partnerLogo.create({
      data: {
        name,
        logoUrl,
        category: category || 'PARTNER',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        status: status || 'PUBLISHED',
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'PartnerLogo',
        details: `Created partner logo "${partner.name}"`,
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 });

    const body = await req.json();
    const { name, logoUrl, category, sortOrder, status } = body;

    const partner = await prisma.partnerLogo.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(logoUrl && { logoUrl }),
        ...(category && { category }),
        ...(typeof sortOrder === 'number' && { sortOrder }),
        ...(status && { status }),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'PartnerLogo',
        details: `Updated partner logo "${partner.name}" (${id})`,
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Partner ID required' }, { status: 400 });

    await prisma.partnerLogo.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
