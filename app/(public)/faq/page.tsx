import React from 'react';
import { prisma } from '@/lib/db/prisma';
import Link from 'next/link';
import { HelpCircle, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_CATEGORIES = [
  {
    id: 'faq-cat-1',
    name: 'Umum & Wilayah Layanan',
    faqs: [
      {
        id: 'faq-1',
        question: 'Dimanakah area cakupan layanan CV Life Solution Technology (LST)?',
        answer: 'Kantor pusat kami berlokasi di Temanggung, Jawa Tengah. Kami melayani pengadaan, instalasi, dan support untuk seluruh wilayah Jawa Tengah, DI Yogyakarta, dan pengadaan nasional untuk instansi/sekolah.',
        syncToAI: true,
      },
    ],
  },
  {
    id: 'faq-cat-2',
    name: 'Pengadaan & Penawaran',
    faqs: [
      {
        id: 'faq-2',
        question: 'Bagaimana alur permintaan Surat Penawaran Harga (Quotation) resmi?',
        answer: 'Anda dapat menekan tombol "Minta Penawaran" pada detail produk/solusi, berkonsultasi via AI Assistant, atau langsung menghubungi tim sales kami melalui WhatsApp (0821-3555-0007). Tim kami akan menerbitkan dokumen PDF penawaran resmi lengkap dengan spesifikasi & legalitas.',
        syncToAI: true,
      },
    ],
  },
  {
    id: 'faq-cat-3',
    name: 'Instalasi & Garansi',
    faqs: [
      {
        id: 'faq-3',
        question: 'Bagaimana ketentuan garansi purna jual dan teknisi on-site LST?',
        answer: 'Setiap perangkat keras mendapatkan garansi resmi distributor 1-3 tahun. Untuk layanan pemeliharaan institusi, kami menyediakan garansi teknisi on-site dengan SLA respon maksimal 1x24 jam.',
        syncToAI: true,
      },
    ],
  },
];

export default async function FAQPage(): Promise<React.ReactNode> {
  let categories: any[] = [];
  try {
    categories = await prisma.fAQCategory.findMany({
      include: {
        faqs: {
          where: { isPublished: true, deletedAt: null } as any,
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  } catch (e) {
    console.error('Error fetching FAQ categories:', e);
  }

  if (!categories || categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }


  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Pusat Bantuan & Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Pertanyaan Yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Temukan jawaban resmi seputar pengadaan, garansi, teknis instalasi, dan layanan LST. Jawaban di bawah terintegrasi langsung dengan LST AI Assistant.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-10 max-w-4xl mx-auto">
        {categories.map((cat: any) => (
          <div key={cat.id} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              <span>{cat.name}</span>
            </h2>

            <div className="space-y-4">
              {cat.faqs.map((faq: any) => (
                <div
                  key={faq.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-base text-slate-900">{faq.question}</h3>
                    {faq.syncToAI && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold shrink-0 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" /> AI Synced
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center max-w-3xl mx-auto space-y-4 shadow-xl">
        <h3 className="text-2xl font-bold">Masih Membutuhkan Bantuan Informasi?</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Gunakan LST AI Consultant di pojok kanan bawah atau hubungi Customer Service kami secara langsung.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
          >
            Kirim Pesan Inquiry
          </Link>
          <a
            href="https://wa.me/6282135550007"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
          >
            Chat WhatsApp CS
          </a>
        </div>
      </div>
    </div>
  );
}
