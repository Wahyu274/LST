'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Headset, Globe, LogOut, UserCheck } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar (Logout) dari akun ini?')) return;
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push('/login');
      }
    } catch (err) {
      console.error(err);
      router.push('/login');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-xs shrink-0 font-sans">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
          ENV: Hostinger Node.js Production
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {user?.role === 'SUPER_ADMIN' && (
          <Link href="/cs/inbox" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">
            <Headset className="w-3.5 h-3.5 text-[#1769E0]" />
            <span>CS Workspace</span>
          </Link>
        )}

        <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>Public Website</span>
        </Link>

        {/* User Profile & Logout Controls */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <Link href="/admin/profile" className="flex items-center gap-2 group" title="Edit Profil Akun">
            <div className="w-8 h-8 rounded-full bg-[#071426] text-white flex items-center justify-center font-bold text-xs overflow-hidden border border-slate-300 group-hover:border-[#1769E0] transition-colors shadow-xs">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.substring(0, 2)?.toUpperCase() || 'SA'}</span>
              )}
            </div>
            <div className="hidden md:block text-left">
              <span className="font-bold text-slate-900 block leading-tight group-hover:text-[#1769E0] transition-colors">
                {user?.name || 'Super Admin'}
              </span>
              <span className="text-[10px] text-slate-500 block">{user?.email || 'admin@lst.co.id'}</span>
            </div>
          </Link>

          <Link
            href="/admin/profile"
            className="p-2 rounded-lg bg-blue-50 text-[#1769E0] hover:bg-blue-100 transition-colors"
            title="Edit Profil Nama & Foto"
          >
            <UserCheck className="w-4 h-4" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
