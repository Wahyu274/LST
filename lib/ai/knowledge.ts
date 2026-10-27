import { prisma } from '@/lib/db/prisma';

const MAX_PRODUCTS_IN_CONTEXT = 25;

const AVAILABILITY_LABEL: Record<string, string> = {
  IN_STOCK: 'Ready stock',
  BY_REQUEST: 'Sesuai permintaan (inden)',
  PROJECT_BASED: 'Berbasis proyek',
};

/**
 * Score a product against the visitor's question so the most relevant
 * catalog items are sent to the AI first (simple keyword relevance).
 */
function scoreProduct(text: string, queryWords: string[]): number {
  const lower = text.toLowerCase();
  return queryWords.reduce((score, word) => (lower.includes(word) ? score + 1 : score), 0);
}

export async function getApprovedKnowledgeContext(userQuery: string): Promise<string> {
  try {
    const queryWords = userQuery
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2);

    const [faqs, kbSources, products, services] = await Promise.all([
      // 1. Fetch published FAQs marked syncToAI
      prisma.fAQ.findMany({
        where: {
          isPublished: true,
          syncToAI: true,
          status: 'PUBLISHED',
          deletedAt: null,
        },
        include: {
          category: true,
        },
        orderBy: { sortOrder: 'asc' },
        take: 20,
      }),
      // 2. Fetch approved AI Knowledge Sources
      prisma.aIKnowledgeSource.findMany({
        where: {
          isApproved: true,
          deletedAt: null,
        },
        orderBy: { priority: 'desc' },
        take: 10,
      }),
      // 3. Fetch published product catalog
      prisma.product.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
        },
        select: {
          name: true,
          slug: true,
          brand: true,
          shortDescription: true,
          price: true,
          showPrice: true,
          availability: true,
          isFeatured: true,
          category: { select: { name: true } },
        },
        take: 200,
      }),
      // 4. Fetch published service solutions
      prisma.serviceSolution.findMany({
        where: {
          deletedAt: null,
          status: 'PUBLISHED',
        },
        select: {
          title: true,
          slug: true,
          tagline: true,
          scopeText: true,
        },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    // Rank products: most relevant to the question first, then featured items
    const rankedProducts = products
      .map((p) => ({
        ...p,
        score: scoreProduct(`${p.name} ${p.brand} ${p.category.name} ${p.shortDescription ?? ''}`, queryWords),
      }))
      .sort((a, b) => b.score - a.score || Number(b.isFeatured) - Number(a.isFeatured))
      .slice(0, MAX_PRODUCTS_IN_CONTEXT);

    // 5. Format knowledge string
    let knowledgeText = `=== RESMI DATA KNOWLEDGE BASE CV LIFE SOLUTION TECHNOLOGY (LST) ===\n`;
    knowledgeText += `Company Name: CV Life Solution Technology (LST)\n`;
    knowledgeText += `Positioning: Technology Solution & Digital Transformation Partner\n`;
    knowledgeText += `Alamat: Kasian, Mudal, Temanggung, Jawa Tengah\n`;
    knowledgeText += `Nomor WhatsApp Resmi: 0821-3555-0007\n`;
    knowledgeText += `KBLI Legalitas: 26220, 26791, 46511, 46512, 46591, 62090, 74201, 95110, 95120\n\n`;

    if (services.length > 0) {
      knowledgeText += `--- LAYANAN & SOLUSI LST --- \n`;
      for (const s of services) {
        knowledgeText += `- ${s.title}: ${s.tagline}. Cakupan: ${s.scopeText.slice(0, 300)} (Halaman: /solutions/${s.slug})\n`;
      }
      knowledgeText += `\n`;
    }

    if (rankedProducts.length > 0) {
      knowledgeText += `--- KATALOG PRODUK (${rankedProducts.length} dari ${products.length} produk, paling relevan di atas) --- \n`;
      for (const p of rankedProducts) {
        const priceText = p.showPrice && p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : 'Harga via penawaran Sales';
        const availability = AVAILABILITY_LABEL[p.availability] ?? p.availability;
        knowledgeText += `- ${p.name} | Merek: ${p.brand} | Kategori: ${p.category.name} | ${priceText} | ${availability}`;
        if (p.shortDescription) knowledgeText += ` | ${p.shortDescription}`;
        knowledgeText += ` | Halaman: /products/${p.slug}\n`;
      }
      knowledgeText += `\n`;
    }

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
