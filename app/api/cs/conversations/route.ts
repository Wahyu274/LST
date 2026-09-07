import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';
import { canAccessCS, canAccessObject } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !canAccessCS(session)) {
      return NextResponse.json({ success: false, error: 'Akses ditolak (Otorisasi tidak sah).' }, { status: 403 });
    }

    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { customer: true },
    });

    // Filter conversations with Object-Level Access Control
    const authorizedConversations = conversations.filter((conv) =>
      canAccessObject(session, 'conversation', conv)
    );

    // Audit Log for Admin Monitoring (READ ONLY mode)
    if (session.role === 'SUPER_ADMIN') {
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'VIEW_CONVERSATION',
          resource: 'CS_Monitoring',
          details: `Super Admin ${session.email} monitored CS conversation queue (Read-Only)`,
        },
      });
    }

    return NextResponse.json({ success: true, data: authorizedConversations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch queue' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !canAccessCS(session)) {
      return NextResponse.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    const existingConv = await prisma.conversation.findUnique({ where: { id } });
    if (!existingConv) {
      return NextResponse.json({ success: false, error: 'Percakapan tidak ditemukan.' }, { status: 404 });
    }

    // Verify Object-Level Access before update
    if (!canAccessObject(session, 'conversation', existingConv)) {
      return NextResponse.json({ success: false, error: 'Anda tidak memiliki hak untuk mengubah percakapan ini.' }, { status: 403 });
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data: { status, unreadCS: false },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update conversation' }, { status: 500 });
  }
}
