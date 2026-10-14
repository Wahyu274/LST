/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Interactive Flat Panel (IFP) 75 Inch 4K 40-Touch',
    slug: 'interactive-flat-panel-75',
    brand: 'LST SmartBoard',
    specifications: 'Display: 75" 4K UHD, OS: Android 13 + Windows 11 Dual OS, Touch: 40-point Infrared, RAM: 8GB',
    shortDescription: 'Papan tulis interaktif kelas dunia untuk perkuliahan dan presentasi eksekutif.',
    price: 48500000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Smart Education' },
  },
  {
    id: 'prod-2',
    name: 'LST High-Performance 2U Rack Server Dual Xeon',
    slug: 'lst-rack-server-2u',
    brand: 'LST Enterprise',
    specifications: 'CPU: Dual Intel Xeon Silver, RAM: 128GB DDR4, Storage: 4x 1.92TB NVMe SSD',
    shortDescription: 'Server performa tinggi untuk database sekolah, LMS, dan aplikasi ERP lokal institusi.',
    price: 65000000,
    showPrice: false,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Networking & Server' },
  },
  {
    id: 'prod-3',
    name: 'Enterprise AI CCTV 4K System (16 Camera + 32CH NVR)',
    slug: 'ai-cctv-4k-security-kit',
    brand: 'LST Guard',
    specifications: 'Camera: 16x 8MP 4K IP Dome, NVR: 32 Channel 4 SATA NVR, Storage: 2x 8TB HDD',
    shortDescription: 'Paket sistem pengawasan canggih untuk area kampus dan gedung perkantoran.',
    price: 32000000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    category: { name: 'CCTV & Security' },
  },
  {
    id: 'prod-4',
    name: 'Enterprise WiFi 6 Access Point Dual-Band',
    slug: 'enterprise-wifi6-ap',
    brand: 'LST Network',
    specifications: 'WiFi 6 AX3000, Dual Band 2.4GHz + 5GHz, POE+, Up to 512 Concurrent Clients',
    shortDescription: 'Access Point performa tinggi untuk coverage WiFi area gedung & kampus.',
    price: 3500000,
    showPrice: true,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    category: { name: 'Networking & Server' },
  },
];

export default async function ProductsListingPage(props: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}): Promise<React.ReactNode> {
  const searchParams = await props.searchParams;
  let categories: any[] = [];
  let products: any[] = [];

  try {
    categories = await prisma.productCategory.findMany({
      where: { deletedAt: null } as any,
    });
  } catch (e) {
    console.error('Error fetching product categories:', e);
  }

  const whereClause: any = { deletedAt: null };
  if (searchParams?.category) {
    whereClause.category = { slug: searchParams.category };
  }
  if (searchParams?.search) {
    whereClause.OR = [
      { name: { contains: searchParams.search } },
      { brand: { contains: searchParams.search } },
    ];
  }

  try {
    products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching products:', e);
  }

  if (!products || products.length === 0) {
    products = FALLBACK_PRODUCTS;
  }


  return (
    <div className="py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Katalog Perangkat B2B & Pengadaan
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Katalog Produk & Hardware LST
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Perangkat komputer, Interactive Board, Server, Networking, dan CCTV Enterprise bergaransi resmi.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              !searchParams?.category
                ? 'bg-brand-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Semua Produk
          </Link>
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                searchParams?.category === cat.slug
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((prod: any) => (
          <div
            key={prod.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <img
                  src={prod.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur">
                  {prod.brand}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[11px] font-bold text-brand-600 tracking-wider uppercase">
                  {prod.category.name}
                </span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{prod.specifications}</p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Harga:</span>
                  <span className="font-bold text-brand-600 text-sm">
                    {prod.showPrice && prod.price ? formatCurrency(prod.price) : 'Minta Penawaran (B2B)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3">
              <Link
                href={`/products/${prod.slug}`}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-center font-semibold text-xs transition-colors shadow"
              >
                Lihat Detail & Penawaran
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
