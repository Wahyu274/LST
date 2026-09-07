import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateHandoffSummary } from '@/lib/ai/handoff';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, visitorId = 'visitor-anonymous' } = body;

    const summary = await generateHandoffSummary(messages || []);

    const conversation = await prisma.conversation.create({
      data: {
        visitorId,
        status: 'WAITING_FOR_CS',
        intentCategory: summary.intentCategory,
        summary: summary.summaryText,
        unreadCS: true,
      },
    });

    if (messages && Array.isArray(messages)) {
      for (const m of messages) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderType: m.role === 'user' ? 'VISITOR' : 'AI',
            senderName: m.role === 'user' ? 'Visitor' : 'LST Virtual Consultant',
            content: m.content,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      summary: summary.summaryText,
    });
  } catch (error) {
    console.error('Handoff error:', error);
    return NextResponse.json({ error: 'Failed to create handoff' }, { status: 500 });
  }
}
