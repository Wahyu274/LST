'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  Headset,
  FileEdit,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

type RoleKey = 'SUPER_ADMIN' | 'SALES' | 'CUSTOMER_SERVICE' | 'CONTENT_EDITOR';

interface RoleTheme {
  key: RoleKey;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  buttonBg: string;
  redirectUrl: string;
  description: string;
  features: string[];
}

const ROLE_THEMES: Record<RoleKey, RoleTheme> = {
  SUPER_ADMIN: {
    key: 'SUPER_ADMIN',
    label: 'Super Admin / Direksi',
    sublabel: 'Executive Platinum Command Center',
    icon: ShieldAlert,
    accentColor: '#EAB308', // Gold / Amber
    bgGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#090D16]',
    cardBorder: 'border-amber-500/40 shadow-amber-500/10',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-400',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-yellow-600 hover:to-amber-500 text-slate-950 font-bold',
    redirectUrl: '/admin/dashboard',
    description: 'Akses hak penuh eksekutif, manajemen operasional, audit log trail, otorisasi transaksi, dan kontrol sistem.',
    features: ['Root Privilege & User Access Control', 'Real-time System Audit Log Trail', 'Global Executive KPI Control'],
  },
  SALES: {
    key: 'SALES',
    label: 'Sales Executive',
    sublabel: 'CRM Prospect & Deal Conversion',
    icon: TrendingUp,
    accentColor: '#10B981', // Emerald Green
    bgGradient: 'from-[#064E3B] via-[#022C22] to-[#041A14]',
    cardBorder: 'border-emerald-500/40 shadow-emerald-500/10',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold',
    redirectUrl: '/admin/leads',
    description: 'Workspace spesialis penjualan untuk follow-up prospek leads, jadwal survey, dan negosiasi invoice.',
    features: ['CRM Leads Pipeline Tracking', 'Generator Surat Penawaran Harga', 'Analitik Target Omset Sales'],
  },
  CUSTOMER_SERVICE: {
    key: 'CUSTOMER_SERVICE',
    label: 'Customer Support / CS',
    sublabel: 'Live Chat & Omnichannel Desk',
    icon: Headset,
    accentColor: '#8B5CF6', // Purple / Indigo
    bgGradient: 'from-[#2E1065] via-[#1E1B4B] to-[#0F0728]',
    cardBorder: 'border-[#8B5CF6]/40 shadow-purple-500/10',
    badgeBg: 'bg-purple-500/10 border-purple-500/30',
    badgeText: 'text-purple-300',
    buttonBg: 'bg-gradient-to-r from-purple-600 to-[#1769E0] hover:from-[#1769E0] hover:to-purple-600 text-white font-bold',
    redirectUrl: '/cs/inbox',
    description: 'Terminal konsultasi langsung untuk merespons chat calon pembeli & pengambilalihan percakapan dari AI Bot.',
    features: ['Real-time Omnichannel Live Desk', 'AI-to-Human Handoff Escalation', 'Contextual Customer History'],
  },
  CONTENT_EDITOR: {
    key: 'CONTENT_EDITOR',
    label: 'Content & CMS Editor',
    sublabel: 'Public Portal & Knowledge Base Studio',
    icon: FileEdit,
    accentColor: '#F97316', // Orange
    bgGradient: 'from-[#431407] via-[#2A0C04] to-[#140602]',
    cardBorder: 'border-orange-500/40 shadow-orange-500/10',
    badgeBg: 'bg-orange-500/10 border-orange-500/30',
    badgeText: 'text-orange-400',
    buttonBg: 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-500 text-slate-950 font-bold',
    redirectUrl: '/admin/cms/products',
    description: 'Studio pengedit konten publik, penulisan studi kasus portofolio, FAQ, dan pengunggahan dokumen AI.',
    features: ['Katalog & Portofolio Content Editor', 'Upload Dokumen AI Knowledge Base', 'Pusat Bantuan FAQ Manager'],
  },
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeRole, setActiveRole] = useState<RoleKey>('SUPER_ADMIN');

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase() as RoleKey;
    if (roleParam && ROLE_THEMES[roleParam]) {
      setActiveRole(roleParam);
    }
  }, [searchParams]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentTheme = ROLE_THEMES[activeRole as RoleKey];
  const IconComponent = currentTheme.icon;

  const handleRoleSwitch = (roleKey: RoleKey) => {
    setActiveRole(roleKey);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: activeRole,
        }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        // Dynamic dashboard routing based on actual DB user role
        const actualRole = data.user.role;
        let targetUrl = '/admin/dashboard';

        if (actualRole === 'SUPER_ADMIN') {
          targetUrl = '/admin/dashboard';
        } else if (actualRole === 'CUSTOMER_SERVICE') {
          targetUrl = '/cs/inbox';
        } else if (actualRole === 'SALES') {
          targetUrl = '/admin/leads';
        } else if (actualRole === 'CONTENT_EDITOR') {
          targetUrl = '/admin/products';
        }

        router.push(targetUrl);
      } else {
        setErrorMsg(data.error || 'Kredensial atau kata sandi tidak sesuai.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bgGradient} font-sans text-white transition-all duration-700 flex flex-col justify-between p-4 sm:p-8`}>
      {/* Top Bar Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Logo variant="light" size="md" />
        <Link
          href="/"
          className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
        >
          ← Kembali ke Beranda Public
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-8">
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Multi-Role Authentication Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Masuk Sesuai Otorisasi Akses Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Pilih role portal resmi di bawah untuk menampilkan form otorisasi khusus dengan perlindungan keamanan berstandar enterprise.
          </p>
        </div>

        {/* Role Selector Tabs (4 Roles) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {(Object.keys(ROLE_THEMES) as RoleKey[]).map((rKey) => {
            const rTheme = ROLE_THEMES[rKey];
            const RIcon = rTheme.icon;
            const isSelected = activeRole === rKey;

            return (
              <button
                key={rKey}
                onClick={() => handleRoleSwitch(rKey)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? `${rTheme.cardBorder} bg-white/10 shadow-xl backdrop-blur-md ring-2 ring-white/20 scale-[1.02]`
                    : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? rTheme.badgeBg + ' ' + rTheme.badgeText : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <RIcon className="w-4 h-4" />
                  </div>
                  {isSelected && <Sparkles className={`w-3.5 h-3.5 ${rTheme.badgeText}`} />}
                </div>
                <div>
                  <h4 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {rTheme.label.split('/')[0]}
                  </h4>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{rKey}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Card Form Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/40 backdrop-blur-xl border ${currentTheme.cardBorder} rounded-3xl p-6 sm:p-10 shadow-2xl transition-all duration-500`}>
          {/* Left Column: Role Profile Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-md border-white/20">
              <IconComponent className={`w-4 h-4 ${currentTheme.badgeText}`} />
              <span className={currentTheme.badgeText}>{currentTheme.sublabel}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentTheme.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentTheme.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Cakupan Akses & Fitur Utama:
              </span>
              {currentTheme.features.map((feat: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${currentTheme.badgeText}`} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom Auth Form */}
          <div className="lg:col-span-6 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6 backdrop-blur-md">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Otorisasi Masuk ({activeRole})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Masukkan email resmi dan kata sandi akun {currentTheme.label.split('/')[0]} Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form method="POST" action="/api/auth/login" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Pengguna *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder={`user@lst.co.id (${activeRole.toLowerCase()})`}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kata Sandi *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl ${currentTheme.buttonBg} text-xs flex items-center justify-center gap-2 shadow-lg transition-all`}
              >
                <span>{isSubmitting ? 'Verifikasi Kredensial...' : `Masuk Sebagai ${currentTheme.label.split('/')[0]}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 border-t border-white/10 pt-4">
        <p>© 2026 CV Life Solution Technology (LST). Enterprise Secure Auth Gateway.</p>
      </footer>
    </div>
  );
}

export default function MultiRoleLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#071426] text-white flex items-center justify-center text-xs font-mono">Loading Authentication Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

