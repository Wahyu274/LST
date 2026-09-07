import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { canAccessAdmin } from '@/lib/auth/rbac';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Executive Admin Dashboard | CV Life Solution Technology',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-Side Authentication & Role Enforcement
  const session = await getSession();

  if (!session || !canAccessAdmin(session)) {
    redirect('/login?error=Otentikasi+diperlukan+untuk+mengakses+dashboard+admin.');
  }

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
