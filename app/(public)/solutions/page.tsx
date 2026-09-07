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
} from 'lucide-react';
import { prisma } from '@/lib/db/prisma';

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

export default async function SolutionsListingPage(): Promise<React.ReactNode> {
  let solutions: any[] = [];
  try {
    solutions = await prisma.serviceSolution.findMany({
      where: { deletedAt: null } as any,
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching solutions:', e);
  }

  if (!solutions || solutions.length === 0) {
    solutions = FALLBACK_SOLUTIONS;
  }


  return (
    <div className="py-16 space-y-16 bg-[#F8FAFC]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#1769E0] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Solusi Teknologi B2B & Institusi
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Solusi Transformasi Digital Terintegrasi
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-base leading-relaxed">
          CV Life Solution Technology menyediakan layanan end-to-end lengkap dengan perangkat visual, hardware resmi, instalasi profesional, dan garansi purna jual.
        </p>
      </div>

      {/* Solutions Grid with Visual Imagery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol: any) => {
            const IconComp = ICON_MAP[sol.iconName] || Cpu;
            const imgUrl = sol.imageUrl || SOLUTION_IMAGES[sol.slug] || DEFAULT_SOLUTION_IMAGE;

            return (
              <div
                key={sol.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1769E0] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Solution Photo Header */}
                <div className="h-56 relative overflow-hidden group">
                  <img
                    src={imgUrl}
                    alt={sol.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md text-[#1769E0] flex items-center justify-center shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                      {sol.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {sol.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Tantangan:</strong> {sol.problemText}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                      <CheckCircle2 className="w-4 h-4 text-[#1769E0] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#1769E0]">Cakupan Pekerjaan:</strong> {sol.scopeText}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/solutions/${sol.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1769E0] hover:bg-[#1255b8] text-white font-semibold text-xs transition-all shadow-sm"
                    >
                      <span>Konsultasikan Solusi Ini</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
