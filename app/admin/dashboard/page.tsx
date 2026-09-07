import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  Users,
  Briefcase,
  Bot,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Realtime aggregation

export default async function AdminDashboardPage(): Promise<React.ReactNode> {
  const salesCount = await prisma.saleTransaction.count();
  const salesRevenue = await prisma.saleTransaction.aggregate({
    _sum: { totalRevenue: true },
  });
  const leadsCount = await prisma.lead.count();
  const projectsCount = await prisma.project.count({ where: { status: 'IN_PROGRESS' } });
  const conversationsCount = await prisma.conversation.count();
  const recentLeads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { customer: true },
  });

  const totalRevenue = salesRevenue._sum.totalRevenue || 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Executive Overview Dashboard</h1>
          <p className="text-xs text-slate-500">
            Pengawasan performa bisnis, omzet, lead pipeline, & aktivitas AI/CS CV Life Solution Technology.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/sales"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow transition-colors"
          >
            Laporan Penjualan Detail
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Omzet (Sales)</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalRevenue)}</h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0% bulan ini
            </span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Leads CRM</span>
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{leadsCount || 0} Prospect Leads</h3>
            <span className="text-[11px] font-semibold text-brand-600">Dari Form, AI & WA</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Proyek Aktif</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{projectsCount || 0} Proyek Berjalan</h3>
            <span className="text-[11px] font-semibold text-amber-600">Smart Classroom & Network</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Conversations</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{conversationsCount || 0} Sesi AI Chat</h3>
            <span className="text-[11px] font-semibold text-indigo-600">Triage & Escalation 85%</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Trend Visual Card */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Grafik Omzet & Revenue 12 Bulan</h3>
              <p className="text-xs text-slate-500">Kontribusi penjualan hardware & proyek infrastruktur</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">Tahun 2026</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-50 rounded-2xl border border-slate-100">
            {[
              { month: 'Jan', val: 0 },
              { month: 'Feb', val: 0 },
              { month: 'Mar', val: 0 },
              { month: 'Apr', val: 0 },
              { month: 'Mei', val: 0 },
              { month: 'Jun', val: 0 },
              { month: 'Jul', val: 0 },
              { month: 'Agu', val: 0 },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${(bar.val / 230) * 100}%` }}
                  className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg transition-all hover:brightness-110"
                />
                <span className="text-[10px] font-semibold text-slate-600">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Funnel Widget */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-base">Lead Conversion Funnel</h3>
            <p className="text-xs text-slate-400">Visitor → AI Chat → Quotation → Won Deal</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Web Visitors</span>
                <span className="font-bold">0</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-brand-500" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>AI Chat Starts</span>
                <span className="font-bold text-cyan-400">0 (0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-cyan-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>CS Handoff / Lead</span>
                <span className="font-bold text-amber-400">0 (0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-amber-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Quotation Issued</span>
                <span className="font-bold text-purple-400">0 (0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-purple-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Won Deals</span>
                <span className="font-bold text-emerald-400">0 (0%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Leads Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-bold text-slate-900 text-base">Prospect Lead Terbaru (CRM)</h3>
          <Link href="/admin/leads" className="text-xs font-semibold text-brand-600 hover:underline">
            Lihat Pipeline Kanban →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Klien / Instansi</th>
                <th className="py-3 px-4">Solusi Diminati</th>
                <th className="py-3 px-4">Sumber Lead</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Estimasi Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {lead.customer?.name || 'Client'}
                    <span className="block font-normal text-slate-500 text-[11px]">{lead.customer?.institution}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{lead.interest}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{lead.source}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold text-[10px]">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : 'Survey Needed'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
