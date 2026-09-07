/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, User, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InsightDetailPage({
  params,
}: {
  params: { slug: string };
}): Promise<React.ReactNode> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/insights"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Insight & Blog</span>
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold border border-brand-200">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-4 h-4 text-brand-500" /> {article.authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" /> {formatDate(article.createdAt)}
          </span>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
        <img
          src={article.coverUrl}
          alt={article.title}
          className="w-full h-80 object-cover"
        />
      </div>

      <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        {article.content}
      </div>
    </div>
  );
}
