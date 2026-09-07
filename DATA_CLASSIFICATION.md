# DATA CLASSIFICATION & MINIMIZATION POLICY

## CV LIFE SOLUTION TECHNOLOGY

Sistem mengklasifikasikan seluruh data aplikasi ke dalam 4 tingkat sensitivitas:

### 1. PUBLIC DATA (Dapat diakses publik)
- Halaman Web Public, Artikel Blog, FAQ Terpublikasi.
- Katalog Produk (Nama, Brand, Foto, Deskripsi, Spesifikasi).
- Studi Kasus Portofolio Terpublikasi.

### 2. INTERNAL DATA (Dapat diakses staf internal terotorisasi)
- Template Penawaran umum & Kategori FAQ.
- Laporan Analitik Pengunjung Anonim.

### 3. CONFIDENTIAL DATA (Sangat Rahasia Klien/Bisnis)
- Data Prospek CRM (Nama Klien, No Telepon/WA, Email, Kebutuhan Solusi).
- Surat Penawaran Harga (RAB) & Detail Nilai Proyek.
- Percakapan CS Live Chat antara Klien dan CS Agent.
- Catatan Proyek Internal & Catatan Negosiasi Sales.
- **Proteksi**: Dibatasi oleh *Object-Level Access Control* (`canAccessObject`) & *Data Minimization DTOs* (`toCustomerDTO`).

### 4. SECRET DATA (Rahasia Tingkat Tinggi Sistem)
- Password Hashes (`bcrypt` salt rounds 10).
- Session Secret Tokens (`JWT_SECRET`).
- Database Connection String (`DATABASE_URL`).
- API Keys Third-Party (`OPENAI_API_KEY`, `GEMINI_API_KEY`).
- **Proteksi**: Tersimpan 100% server-side, terisolasi di [`lib/config/env.ts`](file:///d:/WAHYUDI/COPO%20LST/LST/lib/config/env.ts), dan disaring otomatis (`[REDACTED]`) oleh Audit Log Scrubber.
