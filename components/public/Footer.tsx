'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, CheckCircle2, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import Logo from '@/components/ui/Logo';

function formatUrl(url?: string, fallbackUrl: string = '#') {
  if (!url || !url.trim()) return fallbackUrl;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('@')) return `${fallbackUrl}`;
  return `https://${trimmed}`;
}

export default function PublicFooter() {
  const [settings, setSettings] = useState({
    companyName: 'CV Life Solution Technology',
    address: 'Kasian, Mudal, Temanggung, Jawa Tengah',
    phone: '0821-3555-0007',
    email: 'info@lst.co.id',
    supportEmail: 'support@lst.co.id',
    whatsappCS: '6282135550007',
    kbli: '26220, 46511, 62090',
    instagram: 'https://instagram.com/lst.technology',
    facebook: 'https://facebook.com/lst.technology',
    linkedin: 'https://linkedin.com/company/lst-technology',
    youtube: 'https://youtube.com/@lst.technology',
    tiktok: 'https://tiktok.com/@lst.technology',
  });

  useEffect(() => {
    fetch('/api/public/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error('Failed to fetch footer settings:', err));
  }, []);

  const igUrl = formatUrl(settings.instagram, 'https://instagram.com/lst.technology');
  const fbUrl = formatUrl(settings.facebook, 'https://facebook.com/lst.technology');
  const liUrl = formatUrl(settings.linkedin, 'https://linkedin.com/company/lst-technology');
  const ytUrl = formatUrl(settings.youtube, 'https://youtube.com/@lst.technology');
  const ttUrl = formatUrl(settings.tiktok, 'https://tiktok.com/@lst.technology');

  return (
    <footer className="bg-[#071426] text-slate-300 pt-16 pb-12 border-t border-[#0B1F3A] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#0B1F3A]">
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-3">
              Technology Solution & Digital Transformation Partner terpercaya. Menyediakan infrastruktur IT, Smart Classroom, Jaringan Fiber Optic, Enterprise CCTV, Software Kustom, dan AI Learning untuk Sekolah, Perguruan Tinggi, Perusahaan, & Instansi Pemerintah.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#0B1F3A] text-slate-300 text-xs font-mono border border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#60A5FA]" /> KBLI {settings.kbli || '26220, 46511, 62090'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#0B1F3A] text-slate-300 text-xs font-mono border border-slate-700/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO Certified Partner
              </span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram LST"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={ttUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok LST"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.32 6.32 0 0 0 6.27-6.36V11.53a8.14 8.14 0 0 0 5.46 2.12V10.2a4.84 4.84 0 0 1-3.41-3.51z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase mb-4">Solusi Unggulan</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  Smart Classroom & IFP
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  IT & Office Equipment
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  Jaringan & Fiber Optic
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  CCTV & Access Control
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  Custom Software & ERP
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-[#60A5FA] transition-colors">
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase mb-4">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#60A5FA] transition-colors">
                  Tentang Kami & Legal
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-[#60A5FA] transition-colors">
                  Portofolio Proyek
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#60A5FA] transition-colors">
                  Katalog Produk B2B
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#60A5FA] transition-colors">
                  Artikel & Insight
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#60A5FA] transition-colors">
                  Pusat Bantuan FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#60A5FA] transition-colors">
                  Kontak & Lokasi Kantor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-display font-semibold text-sm tracking-wider uppercase mb-4">Kontak Utama</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-[#1769E0] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-[#1769E0] shrink-0" />
                <a href={`https://wa.me/${settings.whatsappCS}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  {settings.phone || settings.whatsappCS} (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-[#1769E0] shrink-0 mt-1" />
                <div className="flex flex-col space-y-0.5">
                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                      {settings.email}
                    </a>
                  )}
                  {settings.supportEmail && settings.supportEmail !== settings.email && (
                    <a href={`mailto:${settings.supportEmail}`} className="hover:text-white transition-colors text-xs text-slate-400">
                      Support: {settings.supportEmail}
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-slate-400">Kebijakan Privasi</Link>
            <Link href="/faq" className="hover:text-slate-400">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

