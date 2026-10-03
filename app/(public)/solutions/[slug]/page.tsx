import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { ArrowLeft, CheckCircle2, HelpCircle, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mapping solution slugs to search keywords for related hardware products
function getCategoryKeywords(slug: string): string[] {
  if (slug.includes('cctv') || slug.includes('security')) {
    return ['cctv', 'security', 'kamera', 'nvr', 'ip-camera', 'keamanan'];
  }
  if (slug.includes('smart-classroom') || slug.includes('ifp')) {
    return ['ifp', 'smart-classroom', 'interactive', 'board', 'papan-tulis', 'display'];
  }
  if (slug.includes('fiber-optic') || slug.includes('wifi') || slug.includes('infrastruktur')) {
    return ['network', 'fiber-optic', 'wifi', 'switch', 'router', 'access-point', 'jaringan'];
  }
  if (slug.includes('pc') || slug.includes('komputer') || slug.includes('laptop')) {
    return ['pc', 'komputer', 'laptop', 'workstation', 'lab'];
  }
  return ['hardware', 'it', 'equipment'];
}

const SOLUTION_IMAGES: Record<string, string> = {
  'smart-classroom-ifp-interactive-board':
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  'infrastruktur-fiber-optic-enterprise-wifi':
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  'cctv-enterprise-ai-security-access-control':
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
  'pengadaan-pc-lab-komputer-laptop-instansi':
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'software-kustom-sim-sekolah-enterprise-erp':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'command-center-videowall-server-room':
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_SOLUTION_IMAGE =
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';

const FALLBACK_SOLUTIONS_MAP: Record<string, any> = {
  'it-office-equipment': {
    title: 'IT & Office Equipment',
    slug: 'it-office-equipment',
    tagline: 'Perangkat komputer, laptop, server & perlengkapan kantor berkinerja tinggi.',
    problemText: 'Perusahaan & instansi sering kali kesulitan memilih spesifikasi komputer & server yang tepat serta garansi resmi yang responsif.',
    scopeText: 'Pengadaan laptop, PC Workstation, Server, UPS, Printer Multifungsi, Perangkat Kasir, & Lisensi OS/Office.',
    processText: 'Konsultasi kebutuhan > Pemilihan spesifikasi > Pengadaan > Pre-configuration > Delivery & installation.',
  },
  'smart-classroom': {
    title: 'Smart Classroom & Education Technology',
    slug: 'smart-classroom',
    tagline: 'Transformasi ruang kelas modern berbasis Interactive Flat Panel (IFP) & AI learning kit.',
    problemText: 'Metode pengajaran konvensional kurang interaktif & minim integrasi teknologi multimedia modern.',
    scopeText: 'Interactive Board 65"-86", Digital Podiums, Document Camera, Sound System Kelas, Studio Content Creation, LMS Integration.',
    processText: 'Survey kelas > Site planning > Hardware setup > Training guru/dosen > Ongoing support.',
  },
  'network-infrastructure': {
    title: 'Network & IT Infrastructure',
    slug: 'network-infrastructure',
    tagline: 'Jaringan handal, fiber optic, WiFi enterprise & data center interconnections.',
    problemText: 'Koneksi lambat, jaringan tidak aman, serta minimnya manajemen bandwidth mengganggu operasional kampus & kantor.',
    scopeText: 'Kabel UTP/FO, Router Mikrotik/Cisco, Managed Switches, Enterprise Access Point WiFi 6, Firewall & Rack Cabinet.',
    processText: 'Network Audit > Topology Design > Wiring & Installation > Bandwidth Management & VLAN Setup > Penetration Testing.',
  },
  'cctv-security': {
    title: 'CCTV & Security Solutions',
    slug: 'cCTV-security',
    tagline: 'Sistem pengawasan pintar 24/7 dengan AI face recognition & access control.',
    problemText: 'Keamanan fisik aset perusahaan dan pengawasan lingkungan institusi yang belum terintegrasi.',
    scopeText: 'IP Camera 4K Night Vision, NVR Storage Enterprise, Face Recognition Access Control, Automatic Barrier Gate.',
    processText: 'Site Survey > Angle Planning > Cable Installation > NVR Configuration > Mobile Remote Access Setup.',
  },
  'system-software': {
    title: 'System & Software Solutions',
    slug: 'system-software',
    tagline: 'Pengembangan software kustom, Web App, Mobile App, & sistem ERP/Akademik.',
    problemText: 'Proses bisnis manual yang lambat dan data antar departemen yang terisolasi (siloed data).',
    scopeText: 'Sistem Informasi Sekolah/Kampus, ERP Perusahaan, Portal Customer, Mobile App Android/iOS, Integration API.',
    processText: 'Requirement Gathering > UI/UX Design > Agile Development > Testing & QA > Deployment & Cloud Hosting.',
  },
  'ai-digital-learning': {
    title: 'AI & Digital Learning',
    slug: 'ai-digital-learning',
    tagline: 'Implementasi platform pembelajaran berbasis AI & asisten kecerdasan buatan institusi.',
    problemText: 'Kurangnya kesiapan institusi dalam mengadopsi teknologi AI untuk efisiensi dan personalisasi pembelajaran.',
    scopeText: 'AI Tutor Assistant, Automated Grading Systems, AI Ethics Training, Generative AI Workflow Integration.',
    processText: 'Assessment > AI Model Adaptation > Knowledge Base Training > Pilot Program > Full Rollout.',
  },
  'it-consulting': {
    title: 'IT Consulting & System Integration',
    slug: 'it-consulting',
    tagline: 'Pendampingan strategi digital transformation, audit IT & arsitektur sistem.',
    problemText: 'Investasi teknologi yang tidak efisien akibat tidak adanya roadmap digital transformation yang matang.',
    scopeText: 'Digital Blueprinting, IT Audit, Feasibility Study, Vendor Evaluation, Infrastructure Assessment.',
    processText: 'Discovery > Gap Analysis > Blueprint Recommendation > Vendor Sourcing Assistance > Project Governance.',
  },
  'maintenance-support': {
    title: 'Maintenance & Technical Support',
    slug: 'maintenance-support',
    tagline: 'Layanan pemeliharaan berkala, troubleshooting cepat, & garansi purna jual terjamin.',
    problemText: 'Downtime perangkat yang merugikan operasional dan lambatnya respon garansi supplier biasa.',
    scopeText: 'SLA Maintenance Contract, On-Site Technician Support, Hardware Replacement Warranty, Preventive Cleaning.',
    processText: 'SLA Definition > Periodic Preventive Inspection > Emergency On-Call Support > Monthly Reports.',
  },
};

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactNode> {
  const { slug } = await params;
  let solution: any = null;
  try {
    solution = await prisma.serviceSolution.findUnique({
      where: { slug },
    });
  } catch (e) {
    console.error('Error fetching solution by slug:', e);
  }

  if (!solution) {
    const fallbackKey = Object.keys(FALLBACK_SOLUTIONS_MAP).find(
      (key) => slug.includes(key) || key.includes(slug)
    ) || 'smart-classroom';
    solution = FALLBACK_SOLUTIONS_MAP[fallbackKey] || FALLBACK_SOLUTIONS_MAP['smart-classroom'];
  }

  const heroImg = (solution as any).imageUrl || SOLUTION_IMAGES[solution.slug] || DEFAULT_SOLUTION_IMAGE;

  // Fetch relevant products dynamically based on solution category/keywords
  const keywords = getCategoryKeywords(solution.slug);
  const categories = await prisma.productCategory.findMany({
    where: {
      OR: keywords.map((kw) => ({
        slug: { contains: kw },
      })),
    },
  });

  const categoryIds = categories.map((c: any) => c.id);

  let relatedProducts = await prisma.product.findMany({
    where: {
      deletedAt: null,
      OR: [
        { categoryId: { in: categoryIds } },
        ...keywords.map((kw) => ({ name: { contains: kw } })),
        ...keywords.map((kw) => ({ description: { contains: kw } })),
      ],
    },
    take: 4,
    include: { category: true },
  });

  // Fallback if not enough matching products found
  if (relatedProducts.length < 3) {
    const additional = await prisma.product.findMany({
      where: {
        deletedAt: null,
        id: { notIn: relatedProducts.map((p: any) => p.id) },
      },
      take: 4 - relatedProducts.length,
      include: { category: true },
    });
    relatedProducts = [...relatedProducts, ...additional];
  }

  return (
    <div className="py-12 space-y-16 bg-[#F8FAFC] font-sans">
      {/* Breadcrumb & Hero */}
      <div className="relative bg-[#071426] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src={heroImg} alt={solution.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#60A5FA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Solusi</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-[#60A5FA] text-xs font-mono border border-blue-500/30">
              Solusi Teknologi Terintegrasi LST
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">{solution.title}</h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{solution.tagline}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Pain Points vs Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
            <h3 className="font-bold text-lg text-amber-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Tantangan Yang Dihadapi Klien</span>
            </h3>
            <p className="text-sm text-amber-900/80 leading-relaxed">{solution.problemText}</p>
          </div>

          <div className="p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-4">
            <h3 className="font-bold text-lg text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Cakupan & Komponen Solusi</span>
            </h3>
            <p className="text-sm text-emerald-900/80 leading-relaxed">{solution.scopeText}</p>
          </div>
        </div>

        {/* Implementation Process */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Layers className="w-6 h-6 text-[#1769E0]" />
            <span>Tahapan Implementasi & Standar SLA</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{solution.processText}</p>
        </div>

        {/* Dynamic Related Hardware Catalog */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-semibold text-[#1769E0] uppercase tracking-wider block">Spesifikasi Dukungan</span>
              <h3 className="text-2xl font-bold text-slate-900">Perangkat & Hardware Terkait ({solution.title})</h3>
            </div>
            <Link href="/products" className="text-xs font-semibold text-[#1769E0] hover:underline">
              Lihat Seluruh Katalog Hardware →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-3 shadow-xs">
                <div className="space-y-2">
                  <div className="h-36 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-slate-100">
                    <img src={p.imageUrl || '/images/placeholder-product.png'} alt={p.name} className="max-h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">{p.brand}</span>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{p.shortDescription || p.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1769E0]">
                    {p.showPrice && p.price ? `Rp ${p.price.toLocaleString('id-ID')}` : 'By Request'}
                  </span>
                  <Link href={`/products/${p.slug}`} className="text-xs font-semibold text-[#1769E0] hover:underline">
                    Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-10 rounded-2xl bg-[#071426] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Ingin Mengonsultasikan {solution.title}?</h3>
            <p className="text-xs sm:text-sm text-slate-300">Tim spesialis CV Life Solution Technology siap memberikan rincian penawaran dan jadwal survey lokasi.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-[#1769E0] hover:bg-[#1255b8] text-white font-bold text-xs shadow-md"
            >
              Minta Penawaran
            </Link>
            <a
              href="https://wa.me/6282135550007"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            >
              WhatsApp Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
