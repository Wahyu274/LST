'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUploader from '@/components/admin/ImageUploader';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setName(data.data.name || '');
        setAvatarUrl(data.data.avatarUrl || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatarUrl }),
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setStatusMsg({ type: 'success', text: 'Profil pengguna dan foto avatar berhasil diperbarui!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Gagal memperbarui profil.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Terjadi kesalahan koneksi.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#1769E0]" />
        <p className="text-xs font-semibold">Memuat profil akun Anda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="page-h1 text-[#071426]">Pengaturan Profil Akun Pengguna</h1>
        <p className="text-xs text-slate-500">
          Ubah nama tampilan dan foto profil avatar resmi Anda di platform CV Life Solution Technology.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#071426] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#1769E0]" />
              <span>Foto Profil / Avatar</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-20 h-20 rounded-full bg-[#071426] text-white flex items-center justify-center overflow-hidden border-2 border-[#1769E0] shrink-0 shadow-md">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-2xl uppercase">{name.substring(0, 2) || 'US'}</span>
                )}
              </div>
              <div className="flex-1 w-full space-y-2">
                <ImageUploader
                  value={avatarUrl}
                  onChange={(url) => setAvatarUrl(url)}
                  label="Unggah Foto Avatar Baru"
                />
              </div>
            </div>
          </div>

          {/* User Fields */}
          <div className="space-y-4">
            <Input
              label="Nama Lengkap Tampilan *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Hendra Wijaya, S.Kom"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email Akun (Read-only)</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={profile?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hak Akses Otorisasi Role</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={profile?.role || ''}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-[#1769E0]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-[#1769E0] hover:bg-[#1255b8]"
            >
              {isSaving ? 'Menyimpan Profil...' : 'Simpan Perubahan Profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
