'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/solutions', label: 'Solusi Integrasi' },
  { href: '/products', label: 'Produk IT' },
  { href: '/portfolio', label: 'Portofolio' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/insights', label: 'Artikel' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Kontak' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs font-sans">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Logo variant="dark" size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 2xl:px-3.5 py-2 rounded-[8px] text-xs 2xl:text-sm transition-colors font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-[#1769E0] bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-[#071426] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <Link href="/contact">
              <Button variant="primary" size="md" className="bg-[#1769E0] hover:bg-[#1255b8] whitespace-nowrap">
                Konsultasikan Kebutuhan
              </Button>
            </Link>
          </div>

          {/* Mobile / Tablet Menu Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-[8px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-[8px] text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-[#1769E0] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full bg-[#1769E0] hover:bg-[#1255b8]">
                Konsultasikan Kebutuhan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
