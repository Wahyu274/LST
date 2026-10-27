import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-[#1769E0] font-display font-extrabold text-3xl">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#071426]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau tautan yang Anda tuju sudah dipindahkan.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-[#1769E0] text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
