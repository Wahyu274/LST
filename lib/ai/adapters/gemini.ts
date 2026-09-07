import { AIProviderAdapter, AIMessage, AIResponse } from '../types';

export class GeminiAdapter implements AIProviderAdapter {
  private getApiKey(): string {
    const rawKey = process.env.GEMINI_API_KEY || '';
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

    // If Gemini key is set and valid, call Google Gemini API
    if (apiKey && apiKey !== 'mock-gemini-key' && apiKey.length > 10) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-pro'];

      for (const modelName of modelsToTry) {
        try {
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: modelName });

          const prompt = `${systemPrompt}\n\n=== RELEVAN KNOWLEDGE BASE & FAQ ===\n${knowledgeContext}\n\nRiwayat Percakapan (Sintesiskan jawaban secara ramah & kontekstual):\n${messages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n')}`;

          const result = await model.generateContent(prompt);
          const text = result.response.text();

          if (text && text.trim().length > 0) {
            const cleanText = text.replace(/\*\*/g, '');
            return {
              content: cleanText,
              shouldEscalateToCS: isRequestingHuman,
              provider: 'gemini',
            };
          }
        } catch (err: any) {
          console.warn(`Gemini API call with model ${modelName} failed:`, err?.message || err);
        }
      }
    }

    // Fallback Intelligent Knowledge Engine when API key is missing or offline
    return this.fallbackEngine(userLastMessage, isRequestingHuman, knowledgeContext);
  }

  private fallbackEngine(userQuery: string, isHumanReq: boolean, knowledge: string): AIResponse {
    // Strip any raw prompt boundary tags if present
    const cleanUserQuery = userQuery
      .replace(/<untrusted_user_input>/gi, '')
      .replace(/<\/untrusted_user_input>/gi, '')
      .replace(/<system_override>/gi, '')
      .replace(/<\/system_override>/gi, '')
      .trim();

    const queryLower = cleanUserQuery.toLowerCase();
    
    // Stop words list to prevent accidental matching on generic Indonesian words
    const stopWords = new Set([
      'mau', 'beli', 'ingin', 'bisa', 'ada', 'di', 'ke', 'dari', 'yang', 'dan', 'ini', 'itu',
      'saya', 'kami', 'anda', 'untuk', 'pada', 'dengan', 'apa', 'siapa', 'dimana', 'bagaimana',
      'adalah', 'akan', 'telah', 'harus', 'sudah', 'atau', 'saja', 'tolong', 'minta', 'bantu'
    ]);

    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));

    if (isHumanReq) {
      return {
        content:
          'Tentu! Saya dapat langsung menyambungkan Anda dengan tim Customer Service atau Sales LST agar Anda mendapatkan penawaran resmi dan konsultasi langsung. Silakan tekan tombol "Hubungi Customer Service" di bawah.',
        shouldEscalateToCS: true,
        provider: 'fallback',
      };
    }

    // 1. Direct Intent: Laptop, PC, Hardware & IT Equipment Procurement
    if (queryLower.includes('laptop') || queryLower.includes('pc') || queryLower.includes('komputer') || queryLower.includes('workstation') || queryLower.includes('printer') || queryLower.includes('scanner') || queryLower.includes('pengadaan')) {
      return {
        content:
          'Untuk kebutuhan pengadaan Laptop, PC Workstation, maupun Peranti IT Kantor, CV Life Solution Technology (LST) menyediakan jajaran produk resmi (Asus, Lenovo, HP, Dell, Acer) dengan garansi purna jual, dukungan faktur pajak, dan skema pengadaan instansi/sekolah.\n\nBerapa jumlah unit yang Anda rencanakan dan apakah ada spesifikasi khusus (misal: Core i5/i7, RAM, GPU) yang Anda butuhkan?',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 2. Direct Intent: Pricing / Quotation / Penawaran
    if (queryLower.includes('harga') || queryLower.includes('biaya') || queryLower.includes('penawaran') || queryLower.includes('quotation')) {
      return {
        content:
          'Untuk penawaran harga resmi (Quotation), skema pengadaan instansi, dan katalog spesifikasi produk LST, tim Sales kami dapat menerbitkan dokumen penawaran resmi. Silakan klik tombol "Hubungi Customer Service" di bawah untuk tersambung langsung.',
        shouldEscalateToCS: true,
        provider: 'fallback',
      };
    }

    // 3. Direct Intent: Location / Address / Contact
    if (queryLower.includes('lokasi') || queryLower.includes('alamat') || queryLower.includes('kontak') || queryLower.includes('telepon') || queryLower.includes('wa')) {
      return {
        content:
          'Kantor CV Life Solution Technology (LST) berlokasi di Kasian, Mudal, Temanggung, Jawa Tengah. Kontak WhatsApp Resmi: 0821-3555-0007. Kami melayani wilayah Jawa Tengah, DI Yogyakarta, dan pengadaan nasional.',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 4. Direct Intent: Smart Classroom
    if (queryLower.includes('smart classroom') || queryLower.includes('kelas') || queryLower.includes('ifp') || queryLower.includes('interaktif')) {
      return {
        content:
          'Solusi Smart Classroom LST mencakup Interactive Flat Panel (IFP 65"-86"), Podiums Digital, Sound System Kelas, dan LMS. Kami telah berpengalaman mengimplementasikan kelas digital di sekolah dan kampus di Jawa Tengah. Berapa jumlah unit yang Anda rencanakan?',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 5. Direct Intent: CCTV & Security
    if (queryLower.includes('cctv') || queryLower.includes('keamanan') || queryLower.includes('kamera')) {
      return {
        content:
          'LST menyediakan sistem Enterprise AI CCTV 4K dilengkapi NVR Storage pintar, Night Vision, dan AI Face Recognition Access Control untuk kantor, sekolah, dan gedung perkantoran. Apakah Anda butuh rekomendasi jumlah titik kamera?',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 6. Direct Intent: Network & Infrastructure
    if (queryLower.includes('jaringan') || queryLower.includes('network') || queryLower.includes('wifi') || queryLower.includes('fiber')) {
      return {
        content:
          'Solusi Network & Infrastructure LST mencakup instalasi Kabel Fiber Optic, Managed Switch, Enterprise Access Point WiFi 6, serta manajemen bandwidth untuk koneksi stabil. Apakah Anda memerlukan survey lokasi jaringan?',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 7. Direct Intent: Software & ERP
    if (queryLower.includes('software') || queryLower.includes('aplikasi') || queryLower.includes('erp') || queryLower.includes('sistem')) {
      return {
        content:
          'LST merancang System & Software Solutions seperti aplikasi manajemen instansi, ERP, portal web bisnis, dan otomasi workflow kustom sesuai kebutuhan institusi Anda.',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 8. Direct Intent: Greetings
    if (queryLower.includes('halo') || queryLower.includes('hi') || queryLower.includes('pagi') || queryLower.includes('siang') || queryLower.includes('malam') || queryLower.includes('sore')) {
      return {
        content:
          'Halo! Selamat datang di LST Digital Business Platform. Ada kebutuhan teknologi, Smart Classroom, jaringan, CCTV, Laptop/PC, atau pengadaan IT kantor yang bisa saya bantu hari ini?',
        shouldEscalateToCS: false,
        provider: 'fallback',
      };
    }

    // 9. Knowledge Base Document Search (Require score >= 2 with non-stop words)
    if (knowledge && knowledge.length > 50 && queryWords.length > 0) {
      const sections = knowledge.split(/\n(?=Q:|\-\-\- |\[)/);
      let bestMatchText = '';
      let highestScore = 0;

      for (const sec of sections) {
        const secLower = sec.toLowerCase();
        let matchScore = 0;
        for (const word of queryWords) {
          if (secLower.includes(word)) {
            matchScore += 1;
          }
        }
        if (matchScore > highestScore) {
          highestScore = matchScore;
          bestMatchText = sec.trim();
        }
      }

      if (highestScore >= 2 && bestMatchText) {
        const cleanContent = bestMatchText
          .replace(/^Q:\s*/i, 'Pertanyaan: ')
          .replace(/^A:\s*/i, 'Jawaban: ')
          .replace(/^\[(.*?)\]/m, 'Dokumen: $1\n')
          .replace(/\*\*/g, '')
          .trim();

        return {
          content: `Berdasarkan informasi resmi CV Life Solution Technology (LST):\n\n${cleanContent}\n\nApakah ada hal seputar spesifikasi, pengadaan, atau survey lokasi yang ingin Anda tanyakan?`,
          shouldEscalateToCS: false,
          provider: 'fallback',
        };
      }
    }

    return {
      content:
        `Mengenai "${cleanUserQuery}", LST menyediakan 8 kelompok solusi utama (IT Equipment/Laptop, Smart Classroom, Network & FO, CCTV, Software, AI Learning, Consulting, dan Maintenance Support). Anda juga dapat langsung berkonsultasi dengan tim CS/Sales kami melalui tombol di bawah.`,
      shouldEscalateToCS: false,
      provider: 'fallback',
    };
  }
}
