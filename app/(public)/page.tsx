/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import {
  Monitor,
  GraduationCap,
  Network,
  ShieldCheck,
  Code,
  Cpu,
  Briefcase,
  Wrench,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Server,
  Building2,
  School,
  Landmark,
  Layers,
} from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ICON_MAP: Record<string, any> = {
  Monitor,
  GraduationCap,
  Network,
  ShieldCheck,
  Code,
  Cpu,
  Briefcase,
  Wrench,
};

// Preset images for solutions to guarantee aesthetic visual presentation
const SOLUTION_IMAGES: Record<string, string> = {
  'smart-classroom-ifp-interactive-board':
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'infrastruktur-fiber-optic-enterprise-wifi':
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
  'cctv-enterprise-ai-security-access-control':
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
  'pengadaan-pc-lab-komputer-laptop-instansi':
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  'software-kustom-sim-sekolah-enterprise-erp':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'command-center-videowall-server-room':
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_SOLUTION_IMAGE =
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80';

// Dummy Partner/Client Logos for Institutions & Companies
const DUMMY_PARTNER_LOGOS = [
  { name: 'Kementerian Pendidikan & Kebudayaan', code: 'KEMENDIKBUD', icon: GraduationCap },
  { name: 'Dinas Komunikasi & Informatika', code: 'DISKOMINFO', icon: Server },
  { name: 'PT Telkom Indonesia (Persero)', code: 'TELKOM CORP', icon: Network },
  { name: 'Universitas Gadjah Mada Partner', code: 'UGM TECH', icon: Cpu },
  { name: 'Politeknik Negeri Partner', code: 'POLITEKNIK', icon: Monitor },
  { name: 'Yayasan Bina Insani Foundation', code: 'BINA INSANI', icon: ShieldCheck },
  { name: 'PT Bank Central Asia Tbk Partner', code: 'BCA TECH', icon: Code },
  { name: 'Pemerintah Kabupaten Temanggung', code: 'PEMKAB TEMANGGUNG', icon: Briefcase },
];

const FALLBACK_SOLUTIONS = [
  {
    id: 'sol-1',
    title: 'IT & Office Equipment',
    slug: 'it-office-equipment',
    iconName: 'Monitor',
    tagline: 'Perangkat komputer, laptop, server & perlengkapan kantor berkinerja tinggi.',
    problemText: 'Perusahaan & instansi sering kali kesulitan memilih spesifikasi komputer & server yang tepat serta garansi resmi yang responsif.',
    scopeText: 'Pengadaan laptop, PC Workstation, Server, UPS, Printer Multifungsi, Perangkat Kasir, & Lisensi OS/Office.',
  },
  {
    id: 'sol-2',
    title: 'Smart Classroom & Education Technology',
    slug: 'smart-classroom',
    iconName: 'GraduationCap',
    tagline: 'Transformasi ruang kelas modern berbasis Interactive Flat Panel (IFP) & AI learning kit.',
    problemText: 'Metode pengajaran konvensional kurang interaktif & minim integrasi teknologi multimedia modern.',
    scopeText: 'Interactive Board 65"-86", Digital Podiums, Document Camera, Sound System Kelas, Studio Content Creation, LMS Integration.',
  },
  {
    id: 'sol-3',
    title: 'Network & IT Infrastructure',
    slug: 'network-infrastructure',
    iconName: 'Network',
    tagline: 'Jaringan handal, fiber optic, WiFi enterprise & data center interconnections.',
    problemText: 'Koneksi lambat, jaringan tidak aman, serta minimnya manajemen bandwidth mengganggu operasional kampus & kantor.',
    scopeText: 'Kabel UTP/FO, Router Mikrotik/Cisco, Managed Switches, Enterprise Access Point WiFi 6, Firewall & Rack Cabinet.',
  },
  {
    id: 'sol-4',
    title: 'CCTV & Security Solutions',
    slug: 'cCTV-security',
    iconName: 'ShieldCheck',
    tagline: 'Sistem pengawasan pintar 24/7 dengan AI face recognition & access control.',
    problemText: 'Keamanan fisik aset perusahaan dan pengawasan lingkungan institusi yang belum terintegrasi.',
    scopeText: 'IP Camera 4K Night Vision, NVR Storage Enterprise, Face Recognition Access Control, Automatic Barrier Gate.',
  },
  {
    id: 'sol-5',
    title: 'System & Software Solutions',
    slug: 'system-software',
    iconName: 'Code',
    tagline: 'Pengembangan software kustom, Web App, Mobile App, & sistem ERP/Akademik.',
    problemText: 'Proses bisnis manual yang lambat dan data antar departemen yang terisolasi (siloed data).',
    scopeText: 'Sistem Informasi Sekolah/Kampus, ERP Perusahaan, Portal Customer, Mobile App Android/iOS, Integration API.',
  },
  {
    id: 'sol-6',
    title: 'AI & Digital Learning',
    slug: 'ai-digital-learning',
    iconName: 'Cpu',
    tagline: 'Implementasi platform pembelajaran berbasis AI & asisten kecerdasan buatan institusi.',
    problemText: 'Kurangnya kesiapan institusi dalam mengadopsi teknologi AI untuk efisiensi dan personalisasi pembelajaran.',
    scopeText: 'AI Tutor Assistant, Automated Grading Systems, AI Ethics Training, Generative AI Workflow Integration.',
  },
  {
    id: 'sol-7',
    title: 'IT Consulting & System Integration',
    slug: 'it-consulting',
    iconName: 'Briefcase',
    tagline: 'Pendampingan strategi digital transformation, audit IT & arsitektur sistem.',
    problemText: 'Investasi teknologi yang tidak efisien akibat tidak adanya roadmap digital transformation yang matang.',
    scopeText: 'Digital Blueprinting, IT Audit, Feasibility Study, Vendor Evaluation, Infrastructure Assessment.',
  },
  {
    id: 'sol-8',
    title: 'Maintenance & Technical Support',
    slug: 'maintenance-support',
    iconName: 'Wrench',
    tagline: 'Layanan pemeliharaan berkala, troubleshooting cepat, & garansi purna jual terjamin.',
    problemText: 'Downtime perangkat yang merugikan operasional dan lambatnya respon garansi supplier biasa.',
    scopeText: 'SLA Maintenance Contract, On-Site Technician Support, Hardware Replacement Warranty, Preventive Cleaning.',
  },
];

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Interactive Flat Panel (IFP) 75 Inch 4K 40-Touch',
    slug: 'interactive-flat-panel-75',
    brand: 'LST SmartBoard',
    specifications: 'Display: 75" 4K UHD, OS: Android 13 + Windows 11 Dual OS, Touch: 40-point Infrared, RAM: 8GB',
    shortDescription: 'Papan tulis interaktif kelas dunia untuk perkuliahan dan presentasi eksekutif.',
    price: 48500000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Smart Education' },
  },
  {
    id: 'prod-2',
    name: 'LST High-Performance 2U Rack Server Dual Xeon',
    slug: 'lst-rack-server-2u',
    brand: 'LST Enterprise',
    specifications: 'CPU: Dual Intel Xeon Silver, RAM: 128GB DDR4, Storage: 4x 1.92TB NVMe SSD',
    shortDescription: 'Server performa tinggi untuk database sekolah, LMS, dan aplikasi ERP lokal institusi.',
    price: 65000000,
    showPrice: false,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Networking & Server' },
  },
  {
    id: 'prod-3',
    name: 'Enterprise AI CCTV 4K System (16 Camera + 32CH NVR)',
    slug: 'ai-cctv-4k-security-kit',
    brand: 'LST Guard',
    specifications: 'Camera: 16x 8MP 4K IP Dome, NVR: 32 Channel 4 SATA NVR, Storage: 2x 8TB HDD',
    shortDescription: 'Paket sistem pengawasan canggih untuk area kampus dan gedung perkantoran.',
    price: 32000000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    category: { name: 'CCTV & Security' },
  },
  {
    id: 'prod-4',
    name: 'Enterprise WiFi 6 Access Point Dual-Band',
    slug: 'enterprise-wifi6-ap',
    brand: 'LST Network',
    specifications: 'WiFi 6 AX3000, Dual Band 2.4GHz + 5GHz, POE+, Up to 512 Concurrent Clients',
    shortDescription: 'Access Point performa tinggi untuk coverage WiFi area gedung & kampus.',
    price: 3500000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Networking & Server' },
  },
];

export default async function HomePage(): Promise<React.ReactNode> {
  let solutions: any[] = [];
  let portfolio: any[] = [];
  let featuredProducts: any[] = [];
  let partnerLogos: any[] = [];

  try {
    solutions = await prisma.serviceSolution.findMany({
      where: { deletedAt: null } as any,
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching solutions:', e);
  }

  try {
    portfolio = await prisma.portfolioProject.findMany({
      where: { isPublished: true, deletedAt: null } as any,
      take: 3,
    });
  } catch (e) {
    console.error('Error fetching portfolio:', e);
  }

  try {
    featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true, deletedAt: null } as any,
      take: 4,
      include: { category: true },
    });
  } catch (e) {
    console.error('Error fetching featured products:', e);
  }

  try {
    partnerLogos = await prisma.partnerLogo.findMany({
      where: { status: 'PUBLISHED', deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching partner logos:', e);
  }

  if (!solutions || solutions.length === 0) {
    solutions = FALLBACK_SOLUTIONS;
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = FALLBACK_PRODUCTS;
  }


  return (
    <div className="space-y-24 pb-20 font-sans bg-[#F8FAFC]">
      {/* CORPORATE HERO BANNER SECTION WITH BACKGROUND PRODUCT IMAGE */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-[#0B1F3A] bg-[#071426]">
        {/* Background Product Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-banner-ifp.jpg"
            alt="Hero Background Product Showcase"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/90 to-[#071426]/40"></div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[6px] bg-[#0B1F3A]/80 backdrop-blur-md border border-blue-500/30 text-[#60A5FA] text-xs font-semibold uppercase tracking-wider">
              <span>Technology Solution & Digital Transformation Partner</span>
            </div>

            <h1 className="hero-h1 text-white tracking-tight leading-tight text-left">
              Solusi IT & Hardware Terintegrasi Berstandar Profesional
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl text-left leading-relaxed font-normal">
              CV Life Solution Technology (LST) membantu Sekolah, Perguruan Tinggi, Perusahaan, &amp; Instansi Pemerintah mengadopsi Smart Classroom IFP 75&quot;, Komputer Lab, Fiber Optic Network, CCTV Enterprise, dan Custom Software.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 pt-2">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" leftIcon={<PhoneCall className="w-4 h-4" />} className="w-full sm:w-auto bg-[#1769E0] hover:bg-[#1255b8]">
                  Konsultasikan Kebutuhan
                </Button>
              </Link>

              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-[#2F80ED] hover:bg-[#1769E0] text-white border-none shadow-md">
                  Lihat Portofolio
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>KBLI 26220, 46511, 62090 Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SLA Garansi 1x24 Jam</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Teknisi Sertifikasi Profesional</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="-mt-16 relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1769E0] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#111827]">Konsultasi Gratis</h4>
              <p className="text-[11px] text-slate-500">Analisis kebutuhan & estimasi RAB</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#111827]">Perangkat Bergaransi</h4>
              <p className="text-[11px] text-slate-500">Jaminan distributor resmi</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#111827]">Solusi Terintegrasi</h4>
              <p className="text-[11px] text-slate-500">Hardware, software, & maintenance</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#111827]">Layanan SLA Garansi</h4>
              <p className="text-[11px] text-slate-500">Respon teknis 1x24 jam</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 SOLUTIONS GRID SECTION WITH IMAGE CARDS */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#1769E0]">
            Portofolio Solusi Integrasi
          </span>
          <h2 className="section-h2 text-[#071426]">
            Solusi Teknologi End-to-End untuk Organisasi
          </h2>
          <p className="text-slate-600 text-sm">
            Dirancang khusus untuk memenuhi standar keandalan institusi pendidikan, korporasi, hingga pemerintahan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol: any) => {
            const IconComponent = ICON_MAP[sol.iconName] || Cpu;
            const cardImg = sol.imageUrl || SOLUTION_IMAGES[sol.slug] || DEFAULT_SOLUTION_IMAGE;

            return (
              <div
                key={sol.id}
                className="group bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs hover:shadow-lg hover:border-[#1769E0] transition-all duration-200 flex flex-col justify-between"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={cardImg}
                    alt={sol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-white/90 backdrop-blur-md text-[#1769E0] flex items-center justify-center shadow-xs">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-semibold text-blue-200 block uppercase tracking-wider">
                      {sol.tagline}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="card-h3 text-[#071426] group-hover:text-[#1769E0] transition-colors">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {sol.problemText}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#1769E0]">
                    <Link
                      href={`/solutions/${sol.slug}`}
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <span>Lihat Detail Solusi</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS CATALOG */}
      {featuredProducts.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#1769E0]">
                Katalog Perangkat
              </span>
              <h2 className="section-h2 text-[#071426]">Produk & Peralatan IT Pilihan</h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-[#1769E0] hover:underline inline-flex items-center gap-1"
            >
              <span>Lihat Semua Produk</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod: any) => (
              <div key={prod.id} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between shadow-xs hover:border-[#CBD5E1] transition-all">
                <div className="space-y-3">
                  <div className="h-44 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-slate-100">
                    <img
                      src={prod.imageUrl || '/images/placeholder-product.png'}
                      alt={prod.name}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {prod.brand}
                    </span>
                    <h4 className="font-bold text-sm text-[#071426] line-clamp-1">{prod.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {prod.shortDescription || prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  {prod.showPrice && prod.price ? (
                    <span className="text-xs font-bold text-[#1769E0]">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      By Request
                    </span>
                  )}
                  <Link href={`/products/${prod.slug}`}>
                    <Button variant="secondary" size="sm">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DUMMY PARTNER LOGO BADGES MARQUEE SECTION */}
      <section className="bg-white border-y border-[#E2E8F0] py-12 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-6">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1769E0]">
              Sektor Pengadaan & Mitra
            </span>
            <h2 className="section-h2 text-[#071426]">Mitra Berbagai Institusi & Organisasi</h2>
          </div>
        </div>

        {/* Single Row Auto-Scrolling Infinite Marquee Slider */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Fade Edge Overlays */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee flex items-center gap-6">
            {(partnerLogos.length > 0
              ? [...partnerLogos, ...partnerLogos, ...partnerLogos]
              : [...DUMMY_PARTNER_LOGOS, ...DUMMY_PARTNER_LOGOS, ...DUMMY_PARTNER_LOGOS]
            ).map((partner: any, idx: number) => {
              const IconComp = partner.icon || Building2;
              return (
                <div
                  key={idx}
                  className="w-40 h-20 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#1769E0] hover:bg-white transition-all flex items-center justify-center shrink-0 shadow-xs group px-3"
                  title={partner.name}
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-h-12 max-w-[130px] object-contain filter grayscale group-hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#1769E0] flex items-center justify-center group-hover:bg-[#1769E0] group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL ENTERPRISE CTA */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#071426] text-white p-10 sm:p-14 border border-[#0B1F3A] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Konsultasikan Kebutuhan Transformasi Digital Institusi Anda
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Tim profesional CV Life Solution Technology siap membantu menganalisis kebutuhan Smart Classroom, Infrastruktur Jaringan, CCTV, dan Pengadaan IT secara transparan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="bg-[#1769E0] hover:bg-[#1255b8]">
                Konsultasikan Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
