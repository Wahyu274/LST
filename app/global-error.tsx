'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-600 font-extrabold text-2xl">
            !
          </div>
          <h1 className="text-2xl font-bold text-[#071426]">
            Terjadi Kendala Teknis
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Maaf, terjadi gangguan sementara pada sistem. Silakan coba muat ulang halaman.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-[#1769E0] text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Coba Lagi
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
