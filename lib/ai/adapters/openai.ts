import { AIProviderAdapter, AIMessage, AIResponse } from '../types';

export class OpenAIAdapter implements AIProviderAdapter {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    knowledgeContext: string
  ): Promise<AIResponse> {
    const userLastMessage = messages[messages.length - 1]?.content || '';
    const isRequestingHuman = /cs|human|manusia|admin|sales|telepon|hubungi|whatsapp/i.test(userLastMessage);

    if (this.apiKey && this.apiKey !== 'mock-openai-key') {
      try {
        const { OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey: this.apiKey });

        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `${systemPrompt}\n\n${knowledgeContext}` },
            ...messages.map((m) => ({
              role: m.role as 'user' | 'assistant' | 'system',
              content: m.content,
            })),
          ],
        });

        const text = response.choices[0]?.message?.content || '';

        return {
          content: text,
          shouldEscalateToCS: isRequestingHuman,
          provider: 'openai',
        };
      } catch (err) {
        console.warn('OpenAI API call failed:', err);
      }
    }

    return {
      content:
        'Terima kasih telah menghubungi LST Technology Consultant. Kami menyediakan perangkat IT, Smart Classroom, Jaringan FO/WiFi, dan CCTV Enterprise. Apakah Anda ingin langsung dihubungkan dengan Customer Service kami?',
      shouldEscalateToCS: isRequestingHuman,
      provider: 'fallback',
    };
  }
}
