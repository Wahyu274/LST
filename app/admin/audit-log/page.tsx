import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { formatDateTime } from '@/lib/utils';

export const revalidate = 0;

export default async function AuditLogPage(): Promise<React.ReactNode> {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Security Audit Log</h1>
        <p className="text-xs text-slate-500">
          Catatan aktivitas sensitif admin & monitoring percakapan live chat.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Aksi (Action)</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-slate-500">{formatDateTime(log.createdAt)}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-brand-600">{log.resource}</td>
                  <td className="py-3 px-4 text-slate-700">{log.user?.name || 'System / Admin'}</td>
                  <td className="py-3 px-4 text-slate-500">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
