/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { ArrowLeft, MapPin, CheckCircle2, PhoneCall, Award, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<React.ReactNode> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        href="/portfolio"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Portofolio</span>
      </Link>

      {/* Hero */}
      <div className="rounded-3xl overflow-hidden bg-slate-900 text-white relative">
        <img
          src={project.coverImageUrl}
          alt={project.title}
          className="w-full h-80 object-cover opacity-40"
        />
        <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-semibold">
              {project.sector}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> {project.location}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white max-w-4xl">{project.title}</h1>
        </div>
      </div>

      {/* Structured Case Study Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-500" />
            <span>Tantangan Proyek (Challenge)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{project.challengeText}</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            <span>Cakupan Pekerjaan (Scope)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{project.scopeText}</p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Hasil & Dampak (Result)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{project.resultText}</p>
        </div>
      </div>

      {/* Diskusikan Proyek Serupa CTA */}
      <div className="p-10 rounded-3xl bg-gradient-to-r from-slate-900 to-navy-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold">Ingin Mengimplementasikan Proyek Serupa?</h3>
          <p className="text-xs sm:text-sm text-slate-300">Tim LST siap membantu perencanaan budget dan survey teknis gratis.</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
          >
            Diskusikan Proyek Anda
          </Link>
        </div>
      </div>
    </div>
  );
}
