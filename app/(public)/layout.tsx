import PublicNavbar from '@/components/public/Navbar';
import PublicFooter from '@/components/public/Footer';
import AIConsultantWidget from '@/components/public/AIConsultantWidget';
import AnalyticsTracker from '@/components/public/AnalyticsTracker';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AnalyticsTracker />
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <AIConsultantWidget />
      <PublicFooter />
    </div>
  );
}
