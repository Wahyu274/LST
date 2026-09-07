/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowRight, BookOpen, User } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InsightsListingPage(): Promise<React.ReactNode> {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      where: { isPublished: true, deletedAt: null } as any,
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Error fetching articles:', e);
  }


  return (
    <div className="py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Edukasi & Artikel SEO
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">
          Insight & Tren Teknologi LST
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Artikel terupdate seputar Smart Classroom, Jaringan Fiber Optic, CCTV pintar, dan tren AI di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.length === 0 ? (
          <div className="col-span-3 p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            Belum ada artikel yang dipublikasikan.
          </div>
        ) : (
          articles.map((art: any) => (
            <div
              key={art.id}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={art.coverUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur">
                    {art.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-500" />
                    {art.authorName} • {formatDate(art.createdAt)}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{art.excerpt}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/insights/${art.slug}`}
                  className="text-xs font-bold text-brand-600 inline-flex items-center gap-1.5 hover:underline"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
