import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider, LST_SYSTEM_PROMPT } from '@/lib/ai';
import { getApprovedKnowledgeContext } from '@/lib/ai/knowledge';
import { checkRateLimit } from '@/lib/security/rateLimiter';
import { sanitizePromptBoundary } from '@/lib/ai/gateway';
import { AIMessage } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    // Rate limit check: Max 20 requests per minute per IP
    const rateLimit = checkRateLimit(req, { limit: 20, windowMs: 60 * 1000, identifier: 'ai-chat' });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          content: `Terlalu banyak permintaan ke AI Chat. Silakan tunggu ${rateLimit.retryAfterSec} detik sebelum mengirim pesan lagi.`,
          shouldEscalateToCS: false,
          provider: 'rate-limited',
        },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
      );
    }
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const safeMessages: AIMessage[] = messages.map((m: any) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: sanitizePromptBoundary(m.content || ''),
    }));

    const lastUserMsg = safeMessages[safeMessages.length - 1]?.content || '';

    const knowledgeContext = await getApprovedKnowledgeContext(lastUserMsg);
    const provider = getAIProvider();

    const response = await provider.generateResponse(
      safeMessages,
      LST_SYSTEM_PROMPT,
      knowledgeContext
    );

    if (response && response.content) {
      response.content = response.content
        .replace(/<\/?untrusted_user_input>/gi, '')
        .replace(/<\/?system_override>/gi, '')
        .replace(/\*\*/g, '')
        .trim();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      {
        content: 'Maaf, terjadi masalah koneksi pada AI Consultant. Apakah Anda ingin langsung berkonsultasi dengan Customer Service kami?',
        shouldEscalateToCS: true,
        provider: 'fallback',
      },
      { status: 200 }
    );
  }
}
