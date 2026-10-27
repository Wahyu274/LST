# Hostinger Node.js Application Deployment Guide
## LST Digital Business Platform — CV Life Solution Technology

Panduan langkah demi langkah deployment platform LST pada **Hostinger Business / Managed Node.js Application Hosting**.

---

## 1. Requirement Checklist Lingkungan Hostinger

- Node.js Version: **v18.x / v20.x / v24.x LTS**
- Database: **MySQL Server 8.0+**
- Build Engine: **Next.js Standalone Build** (`next.config.js` -> `output: 'standalone'`)
- SSL Certificate: **Active Let's Encrypt / Hostinger SSL**

---

## 2. Langkah-Langkah Deployment

### Langkah 1: Persiapan Database Supabase
Karena Anda menggunakan Supabase, Anda **tidak perlu** membuat database MySQL di Hostinger. 
Cukup masuk ke Dashboard Supabase Anda (Project Settings -> Database) dan salin **Connection String (URI)**.
*(Format biasanya: `postgresql://postgres.[namaproject]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`)*

### Langkah 2: Konfigurasi Environment Variables di Hostinger Panel
Pada hPanel ➔ **Node.js Web App** ➔ **Environment Variables**, tambahkan:

```env
NODE_ENV=production
DATABASE_URL="postgresql://postgres.[namaproject]:[password]@[host].supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="ganti-dengan-kunci-jwt-rahasia-minimal-32-karakter"
AI_PRIMARY_PROVIDER="openrouter"
OPENROUTER_API_KEY="sk-or-v1-..."
OPENROUTER_MODEL="nvidia/nemotron-3-ultra-550b-a55b:free"
NEXT_PUBLIC_APP_URL="https://lifesolution.co.id"
```

### Langkah 3: Build & Seed Database
Jalankan perintah berikut melalui SSH Terminal atau Build Script:

```bash
# 1. Install Dependencies
npm install

# 2. Prisma Database Push & Migration
npx prisma db push

# 3. Seed Initial Data (User, Solutions, Products, FAQs)
npx prisma db seed

# 4. Build Next.js Application
npm run build
```

### Langkah 4: Menjalankan Aplikasi
Set **Startup File** di Hostinger Panel Node.js ke: `server.js` atau jalankan `npm start`.

---

## 3. Akun Default Setelah Database Seed

- **Super Admin**: `admin@lst.co.id` / `AdminLST2026!`
- **CS Operator**: `cs1@lst.co.id` / `CSLST2026!`
- **Sales Executive**: `sales1@lst.co.id` / `SalesLST2026!`
