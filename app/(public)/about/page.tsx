import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2, Building, Target, Compass } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami | CV Life Solution Technology (LST)',
  description: 'Profil perusahaan, visi-misi, nilai bisnis, legalitas KBLI, dan wilayah layanan CV Life Solution Technology.',
};

export default function AboutPage(): React.ReactNode {
  const KBLI_LIST = [
    { code: '26220', name: 'Industri Perlengkapan Komputer' },
    { code: '26791', name: 'Industri Kamera Cinematografi, Proyektor, dan Perlengkapannya' },
    { code: '46511', name: 'Perdagangan Besar Komputer & Perlengkapan Komputer' },
    { code: '46512', name: 'Perdagangan Besar Piranti Lunak (Software)' },
    { code: '46591', name: 'Perdagangan Besar Mesin Kantor & Industri' },
    { code: '62090', name: 'Aktivitas Teknologi Informasi & Jasa Komputer Lainnya' },
    { code: '74201', name: 'Jasa Konsultasi Bisnis & Manajemen Teknologi' },
    { code: '95110', name: 'Reparasi Komputer & Peralatan Sejenis' },
    { code: '95120', name: 'Reparasi Peralatan Komunikasi' },
  ];

  return (
    <div className="py-16 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Overview Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Profil Perusahaan
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          CV Life Solution Technology
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Technology Solution & Digital Transformation Partner terpercaya yang berkomitmen menghadirkan inovasi perangkat keras, infrastruktur jaringan, Smart Classroom, dan sistem software terpadu.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Visi Kami</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Menjadi mitra solusi teknologi dan transformasi digital nomor satu pilihan institusi pendidikan, corporate, dan pemerintahan di Indonesia yang unggul dalam kualitas, inovasi, serta layanan purna jual.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Misi Perusahaan</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Menyediakan produk IT & Smart Classroom berkualitas tinggi bergaransi resmi.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Memberikan layanan konsultasi & implementasi yang tepat guna sesuai kebutuhan klien.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Menjamin SLA garansi & support teknisi yang responsif dan terpercaya.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Nilai-Nilai Perusahaan (Core Values)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <h4 className="font-bold text-base text-brand-600">Solution-Oriented</h4>
            <p className="text-xs text-slate-500">Berfokus pada penyelesaian masalah nyata pelanggan secara efisien.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <h4 className="font-bold text-base text-brand-600">Professional</h4>
            <p className="text-xs text-slate-500">Menjaga standar kerja, etika bisnis, dan sertifikasi teknis tinggi.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <h4 className="font-bold text-base text-brand-600">Integrated</h4>
            <p className="text-xs text-slate-500">Menghubungkan hardware, software, dan jaringan secara holistik.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <h4 className="font-bold text-base text-brand-600">Responsive</h4>
            <p className="text-xs text-slate-500">Layanan komunikasi & penanganan teknis yang cepat dan sigap.</p>
          </div>
        </div>
      </div>

      {/* Legal & KBLI Information */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-brand-400" />
          <div>
            <h3 className="text-xl font-bold">Informasi Legalitas & KBLI Perusahaan</h3>
            <p className="text-xs text-slate-400">Terdaftar resmi untuk pengadaan instansi pemerintah & swasta</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KBLI_LIST.map((kbli) => (
            <div key={kbli.code} className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <span className="font-mono font-bold text-brand-300 text-sm">KBLI {kbli.code}</span>
              <p className="text-xs text-slate-300 leading-snug">{kbli.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
