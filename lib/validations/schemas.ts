import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Kategori harus dipilih'),
  brand: z.string().min(1, 'Brand produk wajib diisi'),
  shortDescription: z.string().optional(),
  description: z.string().min(5, 'Deskripsi produk wajib diisi'),
  specifications: z.string().default('{}'),
  price: z.number().nullable().optional(),
  showPrice: z.boolean().default(false),
  availability: z.enum(['IN_STOCK', 'BY_REQUEST', 'PROJECT_BASED']).default('IN_STOCK'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  isFeatured: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

export const productCategorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  description: z.string().optional(),
  status: z.enum(['PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  sortOrder: z.number().default(0),
});

export const serviceSolutionSchema = z.object({
  title: z.string().min(2, 'Judul solusi minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  iconName: z.string().default('Cpu'),
  tagline: z.string().min(5, 'Tagline wajib diisi'),
  problemText: z.string().min(5, 'Masalah yang diselesaikan wajib diisi'),
  scopeText: z.string().min(5, 'Lingkup pekerjaan wajib diisi'),
  processText: z.string().min(5, 'Tahapan implementasi wajib diisi'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  isFeatured: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const portfolioSchema = z.object({
  title: z.string().min(2, 'Judul proyek minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  sector: z.string().default('Education'),
  location: z.string().default('Indonesia'),
  solutionType: z.string().default('Smart Classroom'),
  challengeText: z.string().default('Implementasi dan modernisasi infrastruktur IT.'),
  scopeText: z.string().default('Pengadaan dan instalasi perangkat hardware terintegrasi.'),
  resultText: z.string().default('Peningkatan efisiensi operasional dan kualitas pembelajaran.'),
  coverImageUrl: z.string().default('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  isPublished: z.boolean().default(true),
});

export const leadSchema = z.object({
  customerName: z.string().min(2, 'Nama pelanggan minimal 2 karakter'),
  institution: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().min(6, 'Nomor telepon minimal 6 karakter'),
  location: z.string().optional(),
  interest: z.string().min(2, 'Kebutuhan/Kategori wajib diisi'),
  source: z.enum(['AI_CHAT', 'CONTACT_FORM', 'WHATSAPP', 'MANUAL']).default('MANUAL'),
  stage: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'QUOTATION', 'NEGOTIATION', 'WON', 'LOST']).default('NEW'),
  estimatedValue: z.number().nullable().optional(),
  notes: z.string().optional(),
  ownerId: z.string().optional(),
});

export const quotationSchema = z.object({
  code: z.string().min(3, 'Kode penawaran wajib diisi'),
  clientName: z.string().min(2, 'Nama klien wajib diisi'),
  leadId: z.string().optional(),
  totalAmount: z.number().min(0, 'Total nilai tidak boleh negatif'),
  status: z.enum(['DRAFT', 'REVIEW', 'SENT', 'NEGOTIATION', 'APPROVED', 'REJECTED', 'EXPIRED']).default('DRAFT'),
  validUntil: z.string().or(z.date()),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      itemTitle: z.string().min(1, 'Judul item wajib diisi'),
      productId: z.string().optional(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      totalPrice: z.number().min(0),
    })
  )
    .min(1, 'Penawaran harus berisi minimal 1 item')
    .max(100, 'Penawaran maksimal 100 item'),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Judul proyek minimal 2 karakter'),
  clientName: z.string().min(2, 'Nama klien wajib diisi'),
  sector: z.string().min(2, 'Sektor wajib diisi'),
  location: z.string().min(2, 'Lokasi wajib diisi'),
  value: z.number().min(0, 'Nilai proyek tidak boleh negatif'),
  picId: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  paymentStatus: z.enum(['UNPAID', 'PARTIAL', 'PAID']).default('UNPAID'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  status: z.enum(['PLANNING', 'PROCUREMENT', 'INSTALLATION', 'TESTING', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('PLANNING'),
});

export const faqSchema = z.object({
  question: z.string().min(5, 'Pertanyaan minimal 5 karakter'),
  answer: z.string().min(5, 'Jawaban minimal 5 karakter'),
  categoryId: z.string().min(1, 'Kategori FAQ harus dipilih'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  syncToAI: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Nama pengguna minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  role: z.enum(['SUPER_ADMIN', 'SALES', 'CUSTOMER_SERVICE', 'CONTENT_EDITOR']).default('CUSTOMER_SERVICE'),
  status: z.enum(['ACTIVE', 'DISABLED']).default('ACTIVE'),
  mfaEnabled: z.boolean().default(false),
});

export const settingSchema = z.object({
  companyName: z.string().min(2),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  whatsapp: z.string().optional(),
  businessHours: z.string().optional(),
  aiProvider: z.string().optional(),
  aiModel: z.string().optional(),
});
