import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CV Life Solution Technology | Technology Solution & Digital Transformation Partner',
  description:
    'Mitra transformasi digital terpercaya untuk sekolah, kampus, perusahaan, & instansi. Solusi Smart Classroom, IT Equipment, Jaringan FO/WiFi, CCTV Enterprise, Custom Software, dan AI Learning.',
  keywords: [
    'Life Solution Technology',
    'LST',
    'Smart Classroom Jawa Tengah',
    'Pengadaan IT Sekolah',
    'CCTV Enterprise',
    'Solusi Jaringan FO',
    'Software Kustom',
    'Temanggung Technology Partner',
  ],
  authors: [{ name: 'CV Life Solution Technology' }],
  icons: {
    icon: '/images/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${manrope.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-[#111827] antialiased selection:bg-[#1769E0] selection:text-white">
        {children}
      </body>
    </html>
  );
}
