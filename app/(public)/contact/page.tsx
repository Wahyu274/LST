'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Compass } from 'lucide-react';

export default function ContactPage(): React.ReactNode {
  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    phone: '',
    email: '',
    location: '',
    needs: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [settings, setSettings] = useState({
    companyName: 'CV LIFE SOLUTION TECHNOLOGY',
    address: 'Kasian, Mudal, Temanggung, Jawa Tengah',
    phone: '0821-3555-0007',
    email: 'info@lst.co.id',
    supportEmail: 'support@lst.co.id',
    whatsappCS: '6282135550007',
  });

  useEffect(() => {
    fetch('/api/public/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error('Failed to fetch contact page settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMsg('Mohon setujui ketentuan privasi data sebelum mengirim.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name,
          institution: formData.institution,
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          interest: formData.needs,
          source: 'CONTACT_FORM',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || 'Gagal mengirim pesan. Silakan coba kembali.');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans bg-[#F8FAFC]">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#1769E0] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Hubungi Tim LST
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Formulir Permintaan Penawaran & Konsultasi
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Silakan isi formulir di bawah untuk menjadwalkan konsultasi, survey lokasi, atau meminta Surat Penawaran Harga (Quotation) resmi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-8 bg-[#071426] text-white p-8 sm:p-10 rounded-2xl shadow-xl">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Kantor Pusat LST</h3>
            <p className="text-xs text-slate-300 uppercase">{settings.companyName}</p>
          </div>

          <ul className="space-y-6 text-sm">
            <li className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-[#60A5FA] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase">Alamat Kantor</h4>
                <p className="text-slate-300 text-xs mt-1">{settings.address}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase">Nomor Telepon & WhatsApp</h4>
                <p className="text-slate-300 text-xs mt-1">{settings.phone || settings.whatsappCS}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase">Email Resmi</h4>
                <p className="text-slate-300 text-xs mt-1">{settings.email} {settings.supportEmail ? `/ ${settings.supportEmail}` : ''}</p>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase">Jam Operasional Layanan</h4>
                <p className="text-slate-300 text-xs mt-1">Senin - Sabtu: 08:00 - 17:00 WIB (AI 24/7)</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          {success ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Pesan Anda Berhasil Terkirim!</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Tim Sales & Customer Service CV Life Solution Technology akan segera menghubungi Anda melalui WhatsApp / Email.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 rounded-xl bg-[#1769E0] text-white font-semibold text-xs hover:bg-[#1255b8]"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Dr. Hendra Wijaya"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nama Instansi / Perusahaan</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Contoh: SMA Negeri 2 Magelang"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nomor WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Email Kantor / Instansi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@instansi.sch.id"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Lokasi Kota / Kabupaten</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Temanggung / Magelang / Semarang"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Kebutuhan / Rincian Pesan *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.needs}
                  onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                  placeholder="Jelaskan kebutuhan pengadaan Smart Classroom, CCTV, Jaringan, Komputer, atau Software..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1769E0] transition-all"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-1 rounded border-slate-300 text-[#1769E0] focus:ring-[#1769E0]"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 leading-snug">
                  Saya menyetujui bahwa data kontak di atas digunakan oleh tim CV Life Solution Technology untuk keperluan respon penawaran & konsultasi.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#1769E0] hover:bg-[#1255b8] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Form Permintaan Penawaran'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* OFFICE LOCATION MAP SECTION */}
      <section className="space-y-6 pt-8 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#1769E0] uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1769E0]" />
              Peta Lokasi Kantor Pusat
            </span>
            <h3 className="text-2xl font-bold text-slate-900">Lokasi Kantor LST Temanggung</h3>
            <p className="text-xs text-slate-500">{settings.address}</p>
          </div>
          <a
            href="https://maps.google.com/?q=Temanggung+Jawa+Tengah"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#1769E0] font-semibold text-xs hover:bg-slate-50 shadow-xs transition-colors shrink-0"
          >
            <span>Buka Google Maps</span>
            <MapPin className="w-4 h-4" />
          </a>
        </div>

        {/* Standard Clear Map Iframe */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white h-96 relative">
          <iframe
            title="Lokasi Kantor LST Temanggung"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63339.46781216016!2d110.134543!3d-7.316823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a82756d11f2a3%3A0x4027a76e352e850!2sTemanggung%2C%20Temanggung%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
