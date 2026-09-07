import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';

/**
 * AI Tool Denylist - Explicitly Prohibited Capabilities
 */
export const PROHIBITED_AI_TOOLS = new Set([
  'executeSQL',
  'runCommand',
  'readSecrets',
  'readEnvironment',
  'readAllCustomers',
  'readAllSales',
  'changeUserRole',
  'deleteUser',
  'executeCode',
  'bypassGuardrails',
]);

/**
 * Approved Tool Schemas (Zod Validated)
 */
export const searchProductsToolSchema = z.object({
  query: z.string().min(1, 'Query pencarian produk wajib diisi'),
  limit: z.number().min(1).max(10).default(5),
});

export const searchFAQToolSchema = z.object({
  query: z.string().min(1, 'Query pencarian FAQ wajib diisi'),
});

export const createLeadToolSchema = z.object({
  customerName: z.string().min(2, 'Nama pelanggan minimal 2 karakter'),
  institution: z.string().optional(),
  phone: z.string().min(6, 'Nomor telepon minimal 6 karakter'),
  email: z.string().email().optional(),
  interest: z.string().min(2, 'Kebutuhan wajib diisi'),
  location: z.string().optional(),
});

/**
 * Secure AI Tool Executor with Denylist Enforcement & Data Minimization
 */
export async function executeAITool(toolName: string, args: unknown): Promise<{ success: boolean; data?: any; error?: string }> {
  // 1. Check Denylist
  if (PROHIBITED_AI_TOOLS.has(toolName)) {
    console.warn(`[AI SECURITY ALERT] Blocked invocation of prohibited AI tool: ${toolName}`);
    return {
      success: false,
      error: `Access Denied: Tool '${toolName}' is explicitly prohibited for AI execution.`,
    };
  }

  try {
    // 2. Route to Approved Tool Handler
    switch (toolName) {
      case 'searchProducts': {
        const validated = searchProductsToolSchema.parse(args);
        const products = await prisma.product.findMany({
          where: {
            deletedAt: null,
            status: 'PUBLISHED',
            OR: [
              { name: { contains: validated.query } },
              { brand: { contains: validated.query } },
              { shortDescription: { contains: validated.query } },
            ],
          },
          select: {
            id: true,
            name: true,
            brand: true,
            shortDescription: true,
            price: true,
            showPrice: true,
            availability: true,
          },
          take: validated.limit,
        });

        // Data Minimization
        const sanitizedProducts = products.map((p) => ({
          name: p.name,
          brand: p.brand,
          description: p.shortDescription,
          priceText: p.showPrice && p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : 'Hubungi Tim Sales LST',
          availability: p.availability,
        }));

        return { success: true, data: sanitizedProducts };
      }

      case 'searchFAQ': {
        const validated = searchFAQToolSchema.parse(args);
        const faqs = await prisma.fAQ.findMany({
          where: {
            deletedAt: null,
            status: 'PUBLISHED',
            syncToAI: true,
            OR: [
              { question: { contains: validated.query } },
              { answer: { contains: validated.query } },
            ],
          },
          select: {
            question: true,
            answer: true,
          },
          take: 3,
        });
        return { success: true, data: faqs };
      }

      case 'createLead': {
        const validated = createLeadToolSchema.parse(args);
        let customer = await prisma.customer.findFirst({ where: { phone: validated.phone } });
        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              name: validated.customerName,
              institution: validated.institution || null,
              phone: validated.phone,
              email: validated.email || null,
              location: validated.location || null,
            },
          });
        }

        const lead = await prisma.lead.create({
          data: {
            customerId: customer.id,
            interest: validated.interest,
            source: 'AI_CHAT',
            stage: 'NEW',
          },
        });

        return { success: true, data: { leadId: lead.id, status: 'Lead berhasil didaftarkan.' } };
      }

      default:
        return { success: false, error: `Unknown approved tool: ${toolName}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal mengeksekusi AI tool.' };
  }
}

/**
 * Prompt Injection Boundary Sanitizer
 */
export function sanitizePromptBoundary(userText: string): string {
  // Strip dangerous prompt override patterns
  const sanitized = userText
    .replace(/<system_override>/gi, '')
    .replace(/<\/system_override>/gi, '')
    .replace(/<untrusted_user_input>/gi, '')
    .replace(/<\/untrusted_user_input>/gi, '')
    .replace(/ignore previous instructions/gi, '[Filtered Request]')
    .replace(/forget all rules/gi, '[Filtered Request]')
    .replace(/display all database/gi, '[Filtered Request]');

  return sanitized.trim();
}
