/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { MapPin, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Implementasi 12 Ruang Kelas Smart Classroom SMKN 1 Temanggung',
    slug: 'smart-classroom-smkn-1-temanggung',
    sector: 'Education',
    location: 'Temanggung, Jawa Tengah',
    resultText: 'Peningkatan efisiensi penyampaian materi hingga 40%, tingkat partisipasi siswa meningkat drastis, dan ruang laboratorium terhubung sempurna.',
    coverImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-2',
    title: 'Instalasi Fiber Optic & WiFi Enterprise Gedung Rektorat Kampus',
    slug: 'fiber-optic-wifi-kampus',
    sector: 'Education',
    location: 'Magelang, Jawa Tengah',
    resultText: 'Konektivitas 10 Gbps backbone FO dengan 32 titik Access Point WiFi 6 terintegrasi untuk 5.000 mahasiswa.',
    coverImageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'proj-3',
    title: 'Command Center & Integrated CCTV AI Face Recognition 32 Titik',
    slug: 'cctv-command-center-instansi',
    sector: 'Government',
    location: 'Semarang, Jawa Tengah',
    resultText: 'Pengawasan keamanan real-time 24/7 dengan video wall 3x3 dan deteksi plat nomor & wajah terpusat.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
];

export default async function PortfolioListingPage(): Promise<React.ReactNode> {
  let projects: any[] = [];
  try {
    projects = await prisma.portfolioProject.findMany({
      where: { isPublished: true, deletedAt: null } as any,
      orderBy: { publishedAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching portfolio projects:', e);
  }

  if (!projects || projects.length === 0) {
    projects = FALLBACK_PROJECTS;
  }


  return (
    <div className="py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Studi Kasus & Rekam Jejak
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Portofolio Implementasi Proyek LST
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Bukti nyata keberhasilan transformasi digital di sekolah, kampus, dan perusahaan di Jawa Tengah & Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj: any) => (
          <div
            key={proj.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="h-56 overflow-hidden relative">
                <img
                  src={proj.coverImageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur">
                  {proj.sector}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {proj.location}
                </span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3">{proj.resultText}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/portfolio/${proj.slug}`}
                className="text-xs font-bold text-brand-600 inline-flex items-center gap-1.5 hover:underline"
              >
                <span>Baca Studi Kasus Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
