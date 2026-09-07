import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Headset } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import { canAccessCS } from '@/lib/auth/rbac';

export const metadata = {
  title: 'CS Workspace | CV Life Solution Technology',
};

export default async function CSWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !canAccessCS(session)) {
    redirect('/login?role=CUSTOMER_SERVICE&error=Otentikasi+CS+diperlukan.');
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between shrink-0 shadow">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1769E0] flex items-center justify-center text-white shadow">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              LST CS Workspace
            </span>
            <span className="text-[10px] text-slate-400 block">
              Customer Support & Lead Handoff Portal ({session.name})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> CS Online ({session.role})
          </span>
          <Link href="/" className="text-slate-400 hover:text-white">
            Public Website
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}
