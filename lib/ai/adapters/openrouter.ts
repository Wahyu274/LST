import OpenAI from 'openai';
import { AIProviderAdapter, AIMessage, AIResponse } from '../types';
import { GeminiAdapter } from './gemini';

const DEFAULT_OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

export class OpenRouterAdapter implements AIProviderAdapter {
  private getApiKey(): string {
    const rawKey = process.env.OPENROUTER_API_KEY || '';
    return rawKey.replace(/['"]/g, '').trim();
  }

  private getModel(): string {
    const custom = process.env.OPENROUTER_MODEL?.trim();
    return custom && custom.length > 0 ? custom : DEFAULT_OPENROUTER_MODEL;
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    knowledgeContext: string
  ): Promise<AIResponse> {
    const userLastMessage = messages[messages.length - 1]?.content || '';
    const isRequestingHuman = /cs|human|manusia|admin|sales|telepon|hubungi|whatsapp/i.test(userLastMessage);
    const apiKey = this.getApiKey();

    if (apiKey && apiKey !== 'mock-openrouter-key' && apiKey.length > 8) {
      try {
        const client = new OpenAI({
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey,
          defaultHeaders: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://lifesolution.co.id',
            'X-Title': 'CV Life Solution Technology',
          },
        });

        // Filter valid messages and map to OpenAI format
        const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: `${systemPrompt}\n\n=== RELEVAN KNOWLEDGE BASE & FAQ ===\n${knowledgeContext}`,
          },
          ...messages
            .filter((m) => m.content && m.content.trim().length > 0)
            .map((m) => ({
              role: (m.role === 'user' ? 'user' : m.role === 'system' ? 'system' : 'assistant') as 'user' | 'system' | 'assistant',
              content: m.content,
            })),
        ];

        const model = this.getModel();
        const response = await client.chat.completions.create({
          model,
          messages: formattedMessages,
          temperature: 0.6,
          max_tokens: 1200,
        });

        const text = response.choices[0]?.message?.content || '';

        if (text.trim().length > 0) {
          return {
            content: text.trim(),
            shouldEscalateToCS: isRequestingHuman,
            provider: 'openrouter',
          };
        }
      } catch (err: any) {
        console.error(`[OpenRouter Error] Provider call failed with model ${this.getModel()}:`, err?.message || err);
      }
    }

    // Fallback to intelligent offline knowledge engine if OpenRouter is unavailable or key not configured
    return new GeminiAdapter().fallbackEngine(userLastMessage, isRequestingHuman, knowledgeContext);
  }
}
