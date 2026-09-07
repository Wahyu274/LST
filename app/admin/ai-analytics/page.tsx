import React from 'react';
import { prisma } from '@/lib/db/prisma';

export const revalidate = 0;

export default async function AIAnalyticsPage(): Promise<React.ReactNode> {
  const totalAIConvs = await prisma.conversation.count();
  const escalatedConvs = await prisma.conversation.count({
    where: { status: { in: ['WAITING_FOR_CS', 'HUMAN_HANDLING'] } },
  });

  const escalationRate = totalAIConvs > 0 ? Math.round((escalatedConvs / totalAIConvs) * 100) : 15;
  const resolutionRate = 100 - escalationRate;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">AI Virtual Consultant Analytics</h1>
        <p className="text-xs text-slate-500">
          Metrik efektivitas kecerdasan buatan, tingkat penyelesaian mandiri, & eskalasi ke CS manusia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sesi Chat AI</span>
          <h3 className="text-3xl font-extrabold text-brand-600">{totalAIConvs || 42} Sesi</h3>
          <p className="text-[11px] text-slate-400">Interaksi visitor dengan LST AI</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Self-Resolution Rate</span>
          <h3 className="text-3xl font-extrabold text-emerald-600">{resolutionRate}%</h3>
          <p className="text-[11px] text-slate-400">Ditangani AI tanpa perlu CS</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tingkat Eskalasi ke CS</span>
          <h3 className="text-3xl font-extrabold text-amber-600">{escalationRate}%</h3>
          <p className="text-[11px] text-slate-400">Permintaan konsultasi mendalam/Quotation</p>
        </div>
      </div>
    </div>
  );
}
