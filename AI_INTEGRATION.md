# AI Integration & Knowledge Engine Blueprint
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini menjelaskan arsitektur integrasi AI Virtual Consultant pada platform LST.

---

## 1. AI Provider Adapter Pattern

Backend menggunakan Provider Adapter (`lib/ai/`) sehingga penyedia LLM dapat diganti secara dinamis tanpa mengubah komponen UI atau logika bisnis:

```typescript
export interface AIProviderAdapter {
  generateResponse(
    messages: AIMessage[],
    systemPrompt: string,
    knowledgeContext: string
  ): Promise<AIResponse>;
}
```

- **Primary Provider**: OpenRouter API (`lib/ai/adapters/openrouter.ts`) via OpenAI SDK, default model `google/gemini-2.0-flash-001` atau model pilihan lain (`openai/gpt-4o-mini`, `anthropic/claude-3.5-haiku`, `deepseek/deepseek-chat`).
- **Secondary / Legacy Providers**: Google Gemini, Anthropic Claude, OpenAI direct adapters.
- **Off-line Fallback**: Intelligent Knowledge Search Engine berbasis aturan LST jika kuota/koneksi provider terputus atau API key belum dipasang.

---

## 2. RAG Knowledge Retrieval

Setiap kali pengguna mengirimkan pertanyaan di widget AI Consultant, `lib/ai/knowledge.ts` mengambil:
1. FAQ publik yang telah disetujui admin dan ditandai `syncToAI = true`.
2. Dokumen resmi LST (`AIKnowledgeSource`).
3. Informasi profil perusahaan, alamat Temanggung, dan nomor WhatsApp resmi (0821-3555-0007).

---

## 3. Structured Handoff to CS Queue

Saat pengguna meminta berbicara dengan manusia atau AI mendeteksi niat pembelian tinggi (Quotation), fungsi `generateHandoffSummary` merangkum percakapan menjadi:
- Intent Category (e.g. `Smart Classroom & EduTech`)
- Key Requirements
- Urgency Level (`NORMAL`, `HIGH`, `URGENT`)

Sistem mengubah status percakapan menjadi `WAITING_FOR_CS` dan mengirimkannya ke antrean CS Workspace.
