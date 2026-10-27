import Anthropic from '@anthropic-ai/sdk';
import { AIProviderAdapter, AIMessage, AIResponse } from '../types';
import { GeminiAdapter } from './gemini';

const DEFAULT_CLAUDE_MODEL = 'claude-opus-5-5';

export class ClaudeAdapter implements AIProviderAdapter {
  private getApiKey(): string {
    const rawKey = process.env.ANTHROPIC_API_KEY || '';
    return rawKey.replace(/['"]/g, '').trim();
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    knowledgeContext: string
  ): Promise<AIResponse> {
    const userLastMessage = messages[messages.length - 1]?.content || '';
    const isRequestingHuman = /cs|human|manusia|admin|sales|telepon|hubungi|whatsapp/i.test(userLastMessage);
    const apiKey = this.getApiKey();

    if (apiKey && apiKey.startsWith('sk-ant-')) {
      try {
        const client = new Anthropic({ apiKey, timeout: 60_000 });

        // Claude requires the conversation to start with a user turn, so drop the
        // widget's opening greeting and any system-role entries from history
        const chatMessages: Anthropic.Beta.BetaMessageParam[] = messages
          .filter((m) => m.role !== 'system' && m.content.trim().length > 0)
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
        while (chatMessages.length > 0 && chatMessages[0].role !== 'user') {
          chatMessages.shift();
        }

        if (chatMessages.length > 0) {
          const response = await client.beta.messages.create({
            model: process.env.CLAUDE_MODEL || DEFAULT_CLAUDE_MODEL,
            max_tokens: 16000,
            // Chat replies are short; low effort keeps latency and cost down
            output_config: { effort: 'low' },
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
            system: [
              { type: 'text', text: systemPrompt },
              { type: 'text', text: `=== RELEVAN KNOWLEDGE BASE & FAQ ===\n${knowledgeContext}` },
            ],
            messages: chatMessages,
          });

          if (response.stop_reason === 'refusal') {
            return {
              content:
                'Maaf, pertanyaan tersebut tidak dapat saya jawab. Silakan hubungi Customer Service LST untuk bantuan lebih lanjut.',
              shouldEscalateToCS: true,
              provider: 'claude',
            };
          }

          const text = response.content
            .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
            .map((b) => b.text)
            .join('\n')
            .trim();

          if (text.length > 0) {
            return {
              content: text,
              shouldEscalateToCS: isRequestingHuman,
              provider: 'claude',
            };
          }
        }
      } catch (err) {
        if (err instanceof Anthropic.AuthenticationError) {
          console.error('Claude API key tidak valid. Periksa ANTHROPIC_API_KEY.');
        } else if (err instanceof Anthropic.RateLimitError) {
          console.warn('Claude API rate limited:', err.message);
        } else if (err instanceof Anthropic.APIError) {
          console.warn(`Claude API error ${err.status}:`, err.message);
        } else {
          console.warn('Claude API call failed:', err);
        }
      }
    }

    // Fallback Intelligent Knowledge Engine when API key is missing or offline
    return new GeminiAdapter().fallbackEngine(userLastMessage, isRequestingHuman, knowledgeContext);
  }
}
