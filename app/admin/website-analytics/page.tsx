'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

export default function WebsiteAnalyticsPage(): React.ReactNode {
  const [data, setData] = useState({
    uniqueVisitors: 0,
    totalPageViews: 0,
    onlineNow: 0,
    waClicks: 0,
    topPage: '-',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/website-analytics', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success) setData(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Website & Visitor Analytics</h1>
          <p className="text-xs text-slate-500">
            Statistik pengunjung website publik secara realtime (live).
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold">Realtime Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Sedang Online</span>
          <h3 className="text-3xl font-extrabold">{data.onlineNow}</h3>
          <p className="text-[11px] text-emerald-100">Pengunjung aktif saat ini</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unique Visitors</span>
          <h3 className="text-2xl font-extrabold text-slate-900">{data.uniqueVisitors.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400">Pengunjung 30 hari terakhir</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Page Views</span>
          <h3 className="text-2xl font-extrabold text-brand-600">{data.totalPageViews.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400">Tampilan halaman publik</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Landing Page</span>
          <h3 className="text-xl font-extrabold text-emerald-600 truncate">{data.topPage}</h3>
          <p className="text-[11px] text-slate-400">Halaman terpopuler</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">WhatsApp Clicks</span>
          <h3 className="text-2xl font-extrabold text-amber-600">{data.waClicks.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400">Konversi ke WhatsApp sales</p>
        </div>
      </div>
    </div>
  );
}
