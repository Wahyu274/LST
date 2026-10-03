/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, PhoneCall, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SpecItem {
  key: string;
  value: string;
}

function parseSpecifications(specsInput: string | null | undefined): SpecItem[] {
  if (!specsInput || !specsInput.trim()) return [];

  const trimmed = specsInput.trim();

  // 1. Try parsing JSON format
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return Object.entries(parsed).map(([k, v]) => ({
        key: k.trim(),
        value: String(v).trim(),
      }));
    }
  } catch {
    // Not valid JSON, fallback to text parsing
  }

  // 2. Parse newline or comma separated key: value pairs
  const result: SpecItem[] = [];
  const lines = trimmed.includes('\n') ? trimmed.split('\n') : trimmed.split(',');

  for (const line of lines) {
    const cleaned = line.trim();
    if (!cleaned) continue;

    const colonIndex = cleaned.indexOf(':');
    if (colonIndex !== -1) {
      const key = cleaned.substring(0, colonIndex).trim();
      const value = cleaned.substring(colonIndex + 1).trim();
      if (key && value) {
        result.push({ key, value });
        continue;
      }
    }
    // Fallback if no colon or single text line
    result.push({ key: 'Fitur/Fitur Teknis', value: cleaned });
  }

  return result;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<React.ReactNode> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  const specList = parseSpecifications(product.specifications);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog Produk</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column Image */}
        <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-[420px] object-cover"
          />
        </div>

        {/* Right Column Info & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold border border-brand-200">
              {product.category.name} • {product.brand}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">{product.name}</h1>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">Estimasi Harga B2B:</span>
            <span className="text-xl font-extrabold text-brand-600">
              {product.showPrice && product.price ? formatCurrency(product.price) : 'Minta Penawaran Resmi'}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Deskripsi Produk</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              {product.description}
            </p>
          </div>

          {/* Structured Specification Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600" />
                <span>Tabel Spesifikasi Teknis</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Garansi Resmi & B2B Ready
              </span>
            </div>

            {specList.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-semibold">
                      <th className="py-3 px-4 w-1/3 border-b border-slate-800">Parameter / Fitur</th>
                      <th className="py-3 px-4 border-b border-slate-800">Spesifikasi Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {specList.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/60 hover:bg-slate-100/50' : 'bg-white hover:bg-slate-50/50'}>
                        <td className="py-3 px-4 font-semibold text-slate-700 border-r border-slate-100 bg-slate-100/30">
                          {spec.key}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium leading-relaxed">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                Spesifikasi teknis dapat disesuaikan sesuai kebutuhan pengadaan B2B Anda. Hubungi tim sales kami untuk kustomisasi spesifikasi.
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="flex-1 py-3.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-center font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Minta Penawaran (Quotation)</span>
            </Link>
            <a
              href={`https://wa.me/6282135550007?text=Halo%20Life%20Solution%20Technology,%20saya%20tertarik%20dengan%20produk%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Tanya via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

