import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const sources = await prisma.aIKnowledgeSource.findMany({
      where: { deletedAt: null } as any,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: sources });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, type, content, category, priority, isApproved, status } = body;

    const source = await prisma.aIKnowledgeSource.create({
      data: {
        title,
        type: type || 'DOCUMENT',
        content,
        category: category || 'General',
        priority: priority || 1,
        isApproved: isApproved ?? true,
        status: status || 'ACTIVE',
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resource: 'AIKnowledgeSource',
        details: `Created knowledge source "${source.title}"`,
      },
    });

    return NextResponse.json({ success: true, data: source });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Knowledge Source ID required' }, { status: 400 });

    const body = await req.json();
    const { title, type, content, category, priority, isApproved, status } = body;

    const source = await prisma.aIKnowledgeSource.update({
      where: { id },
      data: {
        title,
        type: type || 'DOCUMENT',
        content,
        category: category || 'General',
        priority: priority || 1,
        isApproved: isApproved ?? true,
        status: status || 'ACTIVE',
        lastSyncAt: new Date(),
      } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resource: 'AIKnowledgeSource',
        details: `Updated knowledge source "${source.title}" (${id})`,
      },
    });

    return NextResponse.json({ success: true, data: source });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Knowledge Source ID required' }, { status: 400 });

    await prisma.aIKnowledgeSource.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'ARCHIVED' } as any,
    });

    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        resource: 'AIKnowledgeSource',
        details: `Archived knowledge source ID ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
