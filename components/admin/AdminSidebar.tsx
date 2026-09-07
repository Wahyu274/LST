'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Briefcase,
  Headset,
  Bot,
  Globe,
  Package,
  FolderTree,
  FileCheck,
  Layers,
  HelpCircle,
  BookOpen,
  UserCheck,
  Shield,
  FileText,
  Settings,
  Building2,
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface MenuItem {
  href: string;
  label: string;
  icon: any;
  roles?: string[];
}

interface MenuGroup {
  title: string;
  roles: string[];
  items: MenuItem[];
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('SUPER_ADMIN');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUserRole(data.data.role || 'SUPER_ADMIN');
          setUserName(data.data.name || '');
        }
      })
      .catch(() => {});
  }, []);

  // Menu Definition
  const ALL_GROUPS: MenuGroup[] = [
    {
      title: 'UTAMA',
      roles: ['SUPER_ADMIN'],
      items: [
        { href: '/admin/dashboard', label: 'Overview KPI', icon: LayoutDashboard },
        { href: '/admin/cs-monitoring', label: 'CS Live Support', icon: Headset },
      ],
    },
    {
      title: 'MANAJEMEN BISNIS & CRM',
      roles: ['SUPER_ADMIN', 'SALES'],
      items: [
        { href: '/admin/leads', label: 'CRM Prospect Leads', icon: Users, roles: ['SUPER_ADMIN', 'SALES'] },
        { href: '/admin/quotations', label: 'Surat Penawaran (RAB)', icon: FileText, roles: ['SUPER_ADMIN', 'SALES'] },
        { href: '/admin/sales', label: 'Transaksi Penjualan', icon: TrendingUp, roles: ['SUPER_ADMIN', 'SALES'] },
        { href: '/admin/projects', label: 'Manajemen Proyek', icon: Briefcase, roles: ['SUPER_ADMIN', 'SALES'] },
      ],
    },
    {
      title: 'KATALOG & CMS',
      roles: ['SUPER_ADMIN', 'CONTENT_EDITOR', 'SALES'],
      items: [
        { href: '/admin/products', label: 'Katalog Produk IT', icon: Package, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR', 'SALES'] },
        { href: '/admin/cms/categories', label: 'Kategori Produk', icon: FolderTree, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
        { href: '/admin/cms/solutions', label: 'Solusi Integrasi', icon: Layers, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
        { href: '/admin/cms/partners', label: 'Logo Mitra & Klien', icon: Building2, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
        { href: '/admin/portfolio', label: 'Portofolio Proyek', icon: FileCheck, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
        { href: '/admin/cms/faq', label: 'Pusat Bantuan FAQ', icon: HelpCircle, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
        { href: '/admin/cms/knowledge-base', label: 'AI Knowledge Base', icon: BookOpen, roles: ['SUPER_ADMIN', 'CONTENT_EDITOR'] },
      ],
    },
    {
      title: 'ANALYTICS & SYSTEM',
      roles: ['SUPER_ADMIN', 'SALES', 'CONTENT_EDITOR'],
      items: [
        { href: '/admin/ai-analytics', label: 'AI Bot Analytics', icon: Bot, roles: ['SUPER_ADMIN'] },
        { href: '/admin/website-analytics', label: 'Website Analytics', icon: Globe, roles: ['SUPER_ADMIN'] },
        { href: '/admin/profile', label: 'Profil Akun Saya', icon: UserCheck, roles: ['SUPER_ADMIN', 'SALES', 'CONTENT_EDITOR'] },
        { href: '/admin/users', label: 'Pengguna & Hak Akses', icon: UserCheck, roles: ['SUPER_ADMIN'] },
        { href: '/admin/settings', label: 'Pengaturan Sistem', icon: Settings, roles: ['SUPER_ADMIN'] },
        { href: '/admin/audit-log', label: 'Audit Log Trail', icon: Shield, roles: ['SUPER_ADMIN'] },
      ],
    },
  ];

  // Dynamic Header Badge Title per Role
  const portalTitle =
    userRole === 'SALES'
      ? 'Sales & CRM Portal'
      : userRole === 'CONTENT_EDITOR'
      ? 'Content & CMS Studio'
      : userRole === 'SUPER_ADMIN'
      ? 'Platinum Executive Command'
      : 'Executive Admin Portal';

  return (
    <aside className="w-64 bg-[#071426] text-slate-300 flex flex-col h-full shrink-0 border-r border-[#0B1F3A] font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#0B1F3A]">
        <Logo variant="light" size="sm" showSubtext={false} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-blue-400 font-mono font-bold uppercase tracking-widest block">
            {portalTitle}
          </span>
          <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
            {userRole}
          </span>
        </div>
      </div>

      {/* Role-Filtered Navigation Links */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {ALL_GROUPS.map((group, idx) => {
          if (!group.roles.includes(userRole) && userRole !== 'SUPER_ADMIN') {
            return null;
          }

          const filteredItems = group.items.filter(
            (item) => !item.roles || item.roles.includes(userRole) || userRole === 'SUPER_ADMIN'
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                {group.title}
              </span>
              {filteredItems.map((item) => {
                const IconComp = item.icon;
                const isActive =
                  pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-xs transition-colors ${
                      isActive
                        ? 'bg-[#1769E0] text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-[#0B1F3A] font-medium'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#0B1F3A] text-[11px] text-slate-400 space-y-0.5">
        <p className="font-semibold text-slate-200 line-clamp-1">{userName || 'CV Life Solution Technology'}</p>
        <p className="text-slate-500 text-[10px]">Role: {userRole} • Active Session</p>
      </div>
    </aside>
  );
}
