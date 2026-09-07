import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ success: false, error: 'conversationId is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, status: true, visitorId: true, updatedAt: true },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Percakapan tidak ditemukan.' }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        isInternalNote: false,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        senderType: true,
        senderName: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, content, senderName } = body;

    if (!conversationId || !content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'conversationId dan content wajib diisi.' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Percakapan tidak ditemukan.' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: 'VISITOR',
        senderName: senderName || 'Visitor',
        content: content.trim(),
        isInternalNote: false,
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        unreadCS: true,
        status: conversation.status === 'CLOSED' ? 'WAITING_FOR_CS' : conversation.status,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
