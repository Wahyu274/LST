export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  confidenceScore?: number;
  shouldEscalateToCS?: boolean;
  handoffSummary?: string;
  provider: 'openrouter' | 'claude' | 'gemini' | 'openai' | 'fallback' | 'rate-limited';
}

export interface AIProviderAdapter {
  generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    knowledgeContext: string
  ): Promise<AIResponse>;
}
