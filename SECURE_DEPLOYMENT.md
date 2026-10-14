# PANDUAN DEPLOYMENT & CHECKLIST KEAMANAN PRODUKSI

## CV LIFE SOLUTION TECHNOLOGY — HOSTINGER BUSINESS NODE.JS

Dokumen ini berisi panduan langkah-demi-langkah deployment dan checklist keamanan produksi untuk mengunggah platform **LST Digital Business Platform** ke server Hostinger.

---

## 🚀 LANGKAH-LANGKAH DEPLOYMENT KE HOSTINGER

### LANGKAH 1: Persiapan Environment & Kunci Rahasia Produksi

Sebelum mengunggah kode, siapkan berkas environment produksi (misalnya `.env` atau diisi pada Environment Variables Hostinger hPanel):

```env
# 1. Mode Produksi
NODE_ENV=production

# 2. Database (MySQL Hostinger atau SQLite)
# Untuk SQLite:
DATABASE_URL="file:./dev.db"
# Untuk MySQL Hostinger:
# DATABASE_URL="mysql://username_db:password_db@localhost:3306/nama_db"

# 3. Kunci Rahasia JWT Session (Ganti dengan string acak 64 karakter)
JWT_SECRET="ganti-dengan-string-acak-64-karakter-keamanan-lst-2026"

# 4. Kunci AI Service (Server-Side Only - TANPA NEXT_PUBLIC_)
OPENAI_API_KEY="sk-proj-kunci-openai-anda"
GEMINI_API_KEY="kunci-gemini-anda"
AI_PROVIDER="openai"

# 5. URL Domain Utama / Subdomain Anda
NEXT_PUBLIC_APP_URL="https://domain-anda.com"
```

---

### LANGKAH 2: Upload Kode ke Hostinger

#### Cara A: Via GitHub (Sangat Direkomendasikan ⭐)
1. Push seluruh kode proyek di laptop Anda ke **GitHub Private Repository**.
2. Masuk ke **hPanel Hostinger** -> Buka menu **Git** -> Hubungkan ke repository GitHub Anda.
3. Klik **Deploy Branch** untuk mengunduh kode otomatis.

#### Cara B: Via ZIP / File Manager Hostinger
1. Buat file `.zip` dari folder proyek di laptop Anda **TANPA mengikutsertakan folder `node_modules` dan `.next`**.
2. Masuk ke **hPanel Hostinger** -> **File Manager** -> Upload dan Extract `.zip` di direktori proyek (`public_html` atau nama folder subdomain).

---

### LANGKAH 3: Setup Node.js App di hPanel Hostinger

1. Masuk ke **hPanel Hostinger** -> Cari menu **Setup Node.js App** (atau **Web Applications**).
2. Konfigurasi parameter berikut:
   - **Node.js Version**: Pilih **Node.js 18.x** atau **Node.js 20.x**.
   - **Application Mode**: `Production`
   - **Application Root**: `public_html` (atau folder subdomain Anda).
   - **Application Startup File**: `node_modules/next/dist/bin/next` (atau tentukan perintah `start`).
3. Masukkan seluruh **Environment Variables** (dari Langkah 1) pada bagian *Environment Variables Settings* di hPanel.

---

### LANGKAH 4: Eksekusi Perintah Build di Terminal Server Hostinger

Buka **SSH Terminal** atau **hPanel Web Terminal** di Hostinger, lalu jalankan perintah berikut secara berurutan:

```bash
# 1. Masuk ke direktori proyek
cd public_html

# 2. Install dependencies produksi
npm install --production=false

# 3. Generate Prisma Client Database
npx prisma generate

# 4. Push / Migrasi struktur tabel Database
npx prisma db push

# 5. (Opsional) Inisialisasi 5 Akun Role Default
npx ts-node prisma/seed.ts

# 6. Build aplikasi Next.js untuk Produksi
npm run build
```

---

### LANGKAH 5: Aktivasi SSL & Restart Aplikasi

1. **Aktivasi SSL (HTTPS)**:
   - Di hPanel Hostinger, buka menu **SSL** -> Aktifkan **Free Let's Encrypt SSL** untuk domain/subdomain Anda.
   - *Keamanan Cookie HTTPOnly & HSTS akan otomatis aktif 100% setelah HTTPS berjalan.*

2. **Restart Node.js App**:
   - Di hPanel Node.js App, klik tombol **Restart Application**.

---

### LANGKAH 6: Pengujian Kredensial 5 Role Setelah Deployment

Akses portal login di: **`https://domain-anda.com/login`** dan uji coba 5 akun role default:

| Role | Email Login | Password Default | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `superadmin@lst.co.id` | `password123` | `/admin/dashboard` |
| **Admin Operations** | `admin@lst.co.id` | `password123` | `/admin/dashboard` |
| **Sales Executive** | `sales@lst.co.id` | `password123` | `/admin/leads` |
| **Customer Service** | `cs1@lst.co.id` | `password123` | `/cs/inbox` |
| **Content Editor** | `editor@lst.co.id` | `password123` | `/admin/products` |

---

## 🛡️ CHECKLIST KEAMANAN PRODUKSI (PRODUCTION CHECKLIST)

Gunakan checklist ini sebagai standar sebelum & sesudah deployment:

### 1. Pre-Deployment Environment Check
- [x] `.env` tidak ter-commit ke Git (`.gitignore` diverifikasi).
- [x] `JWT_SECRET` diubah dari nilai default dev ke string acak 64-karakter.
- [x] `NODE_ENV=production` diset pada server Hostinger.
- [x] `OPENAI_API_KEY` dan `GEMINI_API_KEY` dikonfigurasi tanpa prefix `NEXT_PUBLIC_`.

### 2. Node.js & Database Setup
- [x] Eksekusi `npx prisma generate` dan `npx prisma db push` / migration pada server.
- [x] Batasi hak akses direktori `/public/uploads` (chmod 755).

### 3. HTTPS & Header Verification
- [x] Sertifikat SSL/TLS aktif pada domain Hostinger.
- [x] Flag `Secure: true` pada cookie HTTPOnly aktif otomatis saat HTTPS.
- [x] HTTP Security Headers (`Content-Security-Policy`, `X-Frame-Options: DENY`, `nosniff`, `HSTS`) diverifikasi via `curl -I https://domain-anda.com`.
- [x] `poweredByHeader: false` diaktifkan di `next.config.js` untuk menyembunyikan header `X-Powered-By: Next.js`.
- [x] CSP diperketat: `script-src 'self'` (tanpa `unsafe-inline` / `unsafe-eval`), `img-src` hanya `https:`/`blob:`/`data:` (tanpa `http:`).
- [x] Form data sensitif (`/contact` & `/login`) menggunakan `method="POST"` untuk mencegah kebocoran data pribadi (PII) ke query URL/log akses.
- [x] Berkas `robots.txt` dan `sitemap.xml` tersedia untuk kontrol crawler dan optimasi SEO.

### 5. Resolusi Header CSP Ganda (Comma sebelum upgrade-insecure-requests)
Jika pengujian keamanan mendeteksi tanda koma sebelum `upgrade-insecure-requests` pada header `Content-Security-Policy`:
- **Penyebab**: Header CSP dikirim oleh dua layer berbeda — Next.js (`next.config.js`) dan Reverse Proxy / CDN Hostinger (hPanel / Cloudflare / `.htaccess`). Berdasarkan spesifikasi HTTP (RFC 7230), proxy menggabungkan dua header bernama sama dengan tanda koma (`,`).
- **Solusi**:
  1. Di `next.config.js`, direktif `upgrade-insecure-requests;` telah disertakan secara resmi dalam satu string CSP.
  2. Di **Hostinger hPanel**: Buka menu **Security** / **SSL** / **CDN**, jika opsi *Automatic HTTPS Rewrites* atau *Security Headers* aktif dan menambahkan CSP `upgrade-insecure-requests`, nonaktifkan injeksi header CSP di level hPanel/CDN agar CSP dikelola secara tunggal & sentral oleh aplikasi Next.js.

### 4. Build & Compilation Verification
- [x] Jalankan `npx tsc --noEmit` -> Must Exit Code 0.
- [x] Jalankan `npm run build` -> Must complete without compilation errors.
