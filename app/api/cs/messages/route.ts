import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getSession } from '@/lib/auth/session';
import { canAccessCS, canAccessObject } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  if (!conversationId) {
    return NextResponse.json({ success: false, error: 'conversationId wajib diisi' }, { status: 400 });
  }

  try {
    const session = await getSession(req);
    if (!session || !canAccessCS(session)) {
      return NextResponse.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Percakapan tidak ditemukan' }, { status: 404 });
    }

    // Object-Level Access Verification (IDOR Protection)
    if (!canAccessObject(session, 'conversation', conversation)) {
      return NextResponse.json({ success: false, error: 'Anda tidak berhak mengakses percakapan ini.' }, { status: 403 });
    }

    // Log Read-Only Admin Monitoring Audit
    if (session.role === 'SUPER_ADMIN') {
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'VIEW_CONVERSATION',
          resource: 'CS_Monitoring',
          details: `Super Admin ${session.email} viewed conversation ${conversationId} (Read-Only)`,
        },
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, conversation, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !canAccessCS(session)) {
      return NextResponse.json({ success: false, error: 'Akses ditolak.' }, { status: 403 });
    }

    const body = await req.json();
    const { conversationId, content, isInternalNote = false, senderName } = body;

    if (!conversationId || !content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Conversation ID dan pesan wajib diisi.' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Percakapan tidak ditemukan.' }, { status: 404 });
    }

    // Object-Level Access Verification
    if (!canAccessObject(session, 'conversation', conversation)) {
      return NextResponse.json({ success: false, error: 'Anda tidak berhak membalas percakapan ini.' }, { status: 403 });
    }

    // Jika user adalah ADMIN tapi sedang mengirim ke percakapan, izinkan saja (sebelumnya diblokir).
    // Kita hanya perlu memastikan nama sender sesuai role.
    const senderRoleName = session.role === 'SUPER_ADMIN' && !isInternalNote ? 'Admin LST' : session.name || 'Customer Service';

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: 'CS',
        senderName: senderName || senderRoleName,
        content: content.trim(),
        isInternalNote,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date(), unreadCS: false },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
