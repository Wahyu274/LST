import { AIMessage } from './types';

import { getAIProvider } from './index';

export interface StructuredHandoffSummary {
  intentCategory: string;
  institutionName?: string;
  customerName?: string;
  phone?: string;
  summaryText: string;
  urgencyLevel: 'NORMAL' | 'HIGH' | 'URGENT';
}

export async function generateHandoffSummary(messages: AIMessage[]): Promise<StructuredHandoffSummary> {
  if (messages.length === 0) {
    return {
      intentCategory: 'Konsultasi General IT',
      summaryText: 'Percakapan kosong.',
      urgencyLevel: 'NORMAL',
    };
  }

  const aiProvider = getAIProvider();
  const systemPrompt = `
Kamu adalah penganalisis percakapan untuk serah terima (handoff) dari Bot AI ke Customer Service manusia.
Analisis riwayat obrolan berikut dan hasilkan rangkuman terstruktur HANYA dalam format JSON yang sah, tanpa tambahan teks atau markdown apapun.
Format JSON yang diharapkan:
{
  "intentCategory": "Pilih salah satu dari: Smart Classroom & EduTech, CCTV & Security System, Network & Infrastructure, IT Equipment & Hardware, System & Software Solutions, Konsultasi General IT",
  "summaryText": "Rangkuman singkat (1-2 kalimat) tentang apa yang diinginkan/ditanyakan pelanggan.",
  "urgencyLevel": "Pilih salah satu dari: NORMAL, HIGH, URGENT"
}
`;

  try {
    const response = await aiProvider.generateResponse(messages, systemPrompt, '');
    let jsonText = response.content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(jsonText);
    return {
      intentCategory: parsed.intentCategory || 'Konsultasi General IT',
      summaryText: parsed.summaryText || 'Pelanggan meminta bantuan CS.',
      urgencyLevel: parsed.urgencyLevel || 'NORMAL',
    };
  } catch (error) {
    console.error('Failed to parse AI summary:', error);
    // Fallback to basic string parsing if JSON fails or AI fails
    const fullText = messages.map((m) => m.content).join(' ');
    const lowerText = fullText.toLowerCase();

    let intentCategory = 'Konsultasi General IT';
    if (lowerText.includes('kelas') || lowerText.includes('smart classroom') || lowerText.includes('ifp')) {
      intentCategory = 'Smart Classroom & EduTech';
    } else if (lowerText.includes('cctv') || lowerText.includes('kamera') || lowerText.includes('keamanan')) {
      intentCategory = 'CCTV & Security System';
    } else if (lowerText.includes('jaringan') || lowerText.includes('wifi') || lowerText.includes('fiber')) {
      intentCategory = 'Network & Infrastructure';
    } else if (lowerText.includes('komputer') || lowerText.includes('server') || lowerText.includes('laptop')) {
      intentCategory = 'IT Equipment & Hardware';
    } else if (lowerText.includes('software') || lowerText.includes('aplikasi') || lowerText.includes('erp')) {
      intentCategory = 'System & Software Solutions';
    }

    let urgencyLevel: 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL';
    if (lowerText.includes('segera') || lowerText.includes('penawaran') || lowerText.includes('urgent')) {
      urgencyLevel = 'HIGH';
    }

    const userMessages = messages.filter((m) => m.role === 'user').map((m) => m.content);
    const keyPoints = userMessages.join(' | ');

    return {
      intentCategory,
      summaryText: `Klien berkonsultasi mengenai [${intentCategory}]. Poin utama: "${keyPoints.slice(0, 200)}..."`,
      urgencyLevel,
    };
  }
}

