import { prisma } from '@/lib/db/prisma';

export async function getApprovedKnowledgeContext(userQuery: string): Promise<string> {
  try {
    // 1. Fetch published FAQs marked syncToAI
    const faqs = await prisma.fAQ.findMany({
      where: {
        isPublished: true,
        syncToAI: true,
      },
      include: {
        category: true,
      },
      take: 20,
    });

    // 2. Fetch approved AI Knowledge Sources
    const kbSources = await prisma.aIKnowledgeSource.findMany({
      where: {
        isApproved: true,
      },
      take: 10,
    });

    // 3. Format knowledge string
    let knowledgeText = `=== RESMI DATA KNOWLEDGE BASE CV LIFE SOLUTION TECHNOLOGY (LST) ===\n`;
    knowledgeText += `Company Name: CV Life Solution Technology (LST)\n`;
    knowledgeText += `Positioning: Technology Solution & Digital Transformation Partner\n`;
    knowledgeText += `Alamat: Kasian, Mudal, Temanggung, Jawa Tengah\n`;
    knowledgeText += `Nomor WhatsApp Resmi: 0821-3555-0007\n`;
    knowledgeText += `KBLI Legalitas: 26220, 26791, 46511, 46512, 46591, 62090, 74201, 95110, 95120\n\n`;

    knowledgeText += `--- FAQ DISETUJUI --- \n`;
    for (const faq of faqs) {
      knowledgeText += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
    }

    if (kbSources.length > 0) {
      knowledgeText += `--- DOKUMEN KNOWLEDGE BASE --- \n`;
      for (const source of kbSources) {
        knowledgeText += `[${source.title}]\n${source.content}\n\n`;
      }
    }

    return knowledgeText;
  } catch (error) {
    console.error('Failed to load knowledge context:', error);
    return 'LST melayani pengadaan IT, Smart Classroom, Network, CCTV, Software, AI, Consulting, dan Maintenance Support.';
  }
}
