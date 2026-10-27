'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Save, ShieldCheck, Cpu } from 'lucide-react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<any>({
    companyName: 'CV Life Solution Technology',
    positioning: 'Technology Solution & Digital Transformation Partner',
    phone: '0821-3555-0007',
    email: 'info@lst.co.id',
    supportEmail: 'support@lst.co.id',
    whatsappCS: '6282135550007',
    whatsappTechSoftware: '6282135550008',
    whatsappTechHardware: '6282135550009',
    address: 'Kasian, Mudal, Temanggung, Jawa Tengah',
    kbli: '26220, 46511, 62090',
    instagram: 'https://instagram.com/lst.technology',
    facebook: 'https://facebook.com/lst.technology',
    linkedin: 'https://linkedin.com/company/lst-technology',
    youtube: 'https://youtube.com/@lst.technology',
    tiktok: 'https://tiktok.com/@lst.technology',
    aiProvider: 'OpenRouter (Nvidia Nemotron 3 Ultra)',
    aiApiKeyMasked: 'Belum Dikonfigurasi',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setFormData((prev: any) => ({ ...prev, ...res.data }));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        if (data.data) setFormData((prev: any) => ({ ...prev, ...data.data }));
        setMessage('✓ Pengaturan berhasil disimpan dan terindeks langsung!');
      } else {
        setMessage(`Gagal menyimpan: ${data.error || 'Terjadi kesalahan'}`);
      }
    } catch (err: any) {
      setMessage('Gagal menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl pb-10">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <h1 className="page-h1 text-[#071426]">Pengaturan Sistem & Profil Perusahaan</h1>
        <p className="text-xs text-slate-500">
          Kelola profil bisnis resmi, nomor WhatsApp CS & Teknisi, email support, media sosial, dan konfigurasi AI Assistant.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-[8px] bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <ShieldCheck className="w-5 h-5 text-[#1769E0]" />
            <h3 className="font-display font-bold text-base text-[#071426]">Profil Legal Perusahaan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Perusahaan Resmi"
              required
              value={formData.companyName || ''}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
            <Input
              label="Positioning Brand"
              required
              value={formData.positioning || ''}
              onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Resmi (Umum)"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Email Support / Helpdesk"
              value={formData.supportEmail || ''}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
            />
          </div>

          <Input
            label="KBLI Izin Resmi"
            value={formData.kbli || ''}
            onChange={(e) => setFormData({ ...formData, kbli: e.target.value })}
          />

          <Textarea
            label="Alamat Lengkap Kantor"
            rows={2}
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        {/* WhatsApp Numbers Configuration Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <span className="text-xl">📱</span>
            <div>
              <h3 className="font-display font-bold text-base text-[#071426]">Nomor WhatsApp Tim & Teknisi</h3>
              <p className="text-xs text-slate-500">Nomor ini terindeks langsung pada widget chat publik & tombol forward CS.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="WhatsApp Customer Service"
              placeholder="6282135550007"
              value={formData.whatsappCS || ''}
              onChange={(e) => setFormData({ ...formData, whatsappCS: e.target.value })}
            />
            <Input
              label="WhatsApp Teknisi Software & ERP"
              placeholder="6282135550008"
              value={formData.whatsappTechSoftware || ''}
              onChange={(e) => setFormData({ ...formData, whatsappTechSoftware: e.target.value })}
            />
            <Input
              label="WhatsApp Teknisi Hardware & FO"
              placeholder="6282135550009"
              value={formData.whatsappTechHardware || ''}
              onChange={(e) => setFormData({ ...formData, whatsappTechHardware: e.target.value })}
            />
          </div>
        </div>

        {/* Social Media Links Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <span className="text-xl">🌐</span>
            <h3 className="font-display font-bold text-base text-[#071426]">Pranala Media Sosial Resmi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Instagram"
              placeholder="https://instagram.com/lst.technology"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
            />
            <Input
              label="Facebook"
              placeholder="https://facebook.com/lst.technology"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
            />
            <Input
              label="LinkedIn"
              placeholder="https://linkedin.com/company/lst-technology"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
            <Input
              label="YouTube"
              placeholder="https://youtube.com/@lst.technology"
              value={formData.youtube || ''}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
            />
            <Input
              label="TikTok"
              placeholder="https://tiktok.com/@lst.technology"
              className="sm:col-span-2"
              value={formData.tiktok || ''}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
            />
          </div>
        </div>

        {/* AI & Provider Configuration Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Cpu className="w-5 h-5 text-[#1769E0]" />
            <h3 className="font-display font-bold text-base text-[#071426]">Konfigurasi AI Engine</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Model AI Utama"
              options={[
                { label: 'OpenRouter — Nvidia Nemotron 3 Ultra 550B (Gratis & Cepat)', value: 'OpenRouter (Nvidia Nemotron 3 Ultra)' },
                { label: 'OpenRouter — Gemini 2.0 Flash (Cepat & Cerdas)', value: 'OpenRouter (Gemini 2.0 Flash)' },
                { label: 'OpenRouter — GPT-4o Mini (OpenAI)', value: 'OpenRouter (GPT-4o Mini)' },
                { label: 'OpenRouter — Claude 3.5 Haiku (Anthropic)', value: 'OpenRouter (Claude 3.5 Haiku)' },
                { label: 'OpenRouter — DeepSeek Chat', value: 'OpenRouter (DeepSeek Chat)' },
                { label: 'Anthropic Claude Opus 5.5 (Direct API)', value: 'Claude Opus 5.5' },
                { label: 'Google Gemini 2.5 Flash (Direct API)', value: 'Gemini 2.5 Flash' },
              ]}
              value={formData.aiProvider || 'OpenRouter (Nvidia Nemotron 3 Ultra)'}
              onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value })}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#111827]">AI API Key Status</label>
              <div className="h-11 px-3.5 bg-slate-50 border border-[#E2E8F0] rounded-[8px] flex items-center justify-between font-mono text-xs text-slate-600">
                <span>{formData.aiApiKeyMasked || 'Active'}</span>
                <Badge variant="success" size="sm">
                  Active & Masked
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* SMTP Email Server Configuration Section */}
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="text-xl">📧</span>
              <div>
                <h3 className="font-display font-bold text-base text-[#071426]">Konfigurasi Server Email (SMTP)</h3>
                <p className="text-xs text-slate-500">
                  Diperlukan agar pesan dari Formulir Publik dapat terkirim nyata ke Inbox <span className="font-semibold text-blue-600">lifesolutiont@gmail.com</span> & email resmi.
                </p>
              </div>
            </div>
            <Badge variant={formData.smtpUser && formData.smtpPass ? 'success' : 'warning'} size="sm">
              {formData.smtpUser && formData.smtpPass ? 'SMTP Siap' : 'Perlu Password SMTP'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Server Host SMTP"
              placeholder="smtp.hostinger.com (atau smtp.gmail.com)"
              value={formData.smtpHost || 'smtp.hostinger.com'}
              onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
            />
            <Input
              label="Port SMTP"
              placeholder="465 (SSL) atau 587 (TLS)"
              value={formData.smtpPort || '465'}
              onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Username Email SMTP"
              placeholder="support@lifesolution.co.id atau lifesolutiont@gmail.com"
              value={formData.smtpUser || ''}
              onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
            />
            <Input
              label="Kata Sandi / App Password Email SMTP"
              type="password"
              placeholder="Masukkan password akun email SMTP"
              value={formData.smtpPass || ''}
              onChange={(e) => setFormData({ ...formData, smtpPass: e.target.value })}
            />
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Tips Hostinger: Gunakan Host <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">smtp.hostinger.com</code>, Port <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">465</code>, Username email Hostinger Anda (misal: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">support@lifesolution.co.id</code>) beserta password email tersebut.
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" size="lg" type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
