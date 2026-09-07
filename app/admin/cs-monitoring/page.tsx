import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { recordAuditLog } from '@/lib/security/audit';
import { Eye } from 'lucide-react';

export const revalidate = 0;

export default async function CSMonitoringPage(): Promise<React.ReactNode> {
  await recordAuditLog({
    action: 'VIEW_CS_MONITORING',
    resource: 'cs_monitoring',
    details: 'Admin accessed read-only CS Live Chat Monitoring Dashboard.',
  });

  const csStaff = await prisma.user.findMany({
    where: { role: 'CUSTOMER_SERVICE' },
  });

  const activeChats = await prisma.conversation.findMany({
    take: 10,
    orderBy: { updatedAt: 'desc' },
    include: { customer: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">CS Performance & Monitoring Dashboard</h1>
          <p className="text-xs text-slate-500">
            Monitoring read-only percakapan live chat CS & metrik respon waktu (Audit Logged).
          </p>
        </div>
      </div>

      {/* Staff Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {csStaff.map((staff: any) => (
          <div key={staff.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                {staff.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{staff.name}</h4>
                <p className="text-[11px] text-slate-500">{staff.email}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${staff.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
              {staff.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        ))}
      </div>

      {/* Read-Only Active Chat Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-600" />
          <span>Stream Live Chat (Read-Only Mode)</span>
        </h3>

        <div className="space-y-3">
          {activeChats.map((chat: any) => (
            <div key={chat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{chat.customer?.name || 'Visitor'}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">{chat.status}</span>
                </div>
                <p className="text-xs text-slate-600 italic">&quot;{chat.messages[0]?.content || 'Tidak ada pesan'}&quot;</p>
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">ID: {chat.id.slice(0, 8)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
