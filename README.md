# LST Digital Business Platform
## CV Life Solution Technology (LST) — Temanggung, Jawa Tengah

Platform bisnis digital terintegrasi untuk **CV Life Solution Technology** yang menggabungkan website publik B2B corporate, katalog produk & 8 solusi teknologi, portal Customer Service Live Chat 3-panel, Executive Admin Dashboard, Mini CRM Prospek Lead, manajemen proyek, AI Virtual Consultant (Gemini & OpenAI Adapter), serta pemantauan keamanan & audit log.

---

## 🌟 Positioning & Layanan Utama LST

**Positioning**: *Technology Solution & Digital Transformation Partner*  
**Prinsip Kerja**: **Consult → Design → Supply → Implement → Support**

### Bidang Layanan Utama:
1. **Smart Classroom & Education Technology**: Interactive Flat Panel, OPS PC, smartboard, & multimedia pembelajaran digital.
2. **Network & IT Infrastructure**: Jaringan LAN, WLAN, fiber optic, router, switch, & server deployment.
3. **CCTV & Integrated Security**: Surveillance system, NVR, storage, & monitoring terpusat.
4. **IT & Office Equipment**: Laptop, PC, workstation, printer, scanner, & pengadaan IT kantor.
5. **System & Software Solutions**: Aplikasi web, sistem informasi, automation, & integrasi sistem.
6. **AI & Digital Learning**: Chatbot AI, integrasi LLM, & teknologi pembelajaran cerdas.
7. **IT Consulting & System Integration**: Asesmen kebutuhan, perencanaan sistem, & integrasi B2B.
8. **Maintenance & Technical Support**: Pemeliharaan rutin, penanganan kendala, & garansi purna jual.

---

## 📚 Suite Dokumentasi Teknis Lengkap

Platform ini dilengkapi dengan 11 dokumen teknis produksi yang dapat dipelajari pada berkas berikut:

1. 🏛️ **[ARCHITECTURE.md](ARCHITECTURE.md)**: Arsitektur Modular Monolith, Next.js App Router, & Realtime Polling Engine.
2. 🗄️ **[DATABASE.md](DATABASE.md)**: Skema ERD relasional Prisma ORM (MySQL / SQLite) & panduan indexing.
3. 🔒 **[SECURITY.md](SECURITY.md)**: Keamanan HttpOnly JWT, OWASP, audit logging, & AI guardrails.
4. 🤖 **[AI_INTEGRATION.md](AI_INTEGRATION.md)**: Adapter Gemini/OpenAI, RAG context loader, & AI-to-CS handoff.
5. 🛡️ **[RBAC.md](RBAC.md)**: Matriks peran & verifikasi izin server-side (`SUPER_ADMIN`, `ADMIN`, `SALES`, `CUSTOMER_SERVICE`, `CONTENT_EDITOR`).
6. 🔌 **[API.md](API.md)**: Kontrak API Route Handlers & Zod validation schema.
7. ⚙️ **[ENVIRONMENT.md](ENVIRONMENT.md)**: Panduan variabel lingkungan `.env`.
8. 📊 **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)**: Panduan pengoperasian Executive Admin Dashboard & Mini CRM.
9. 🎧 **[CS_GUIDE.md](CS_GUIDE.md)**: Panduan staf Customer Service (Inbox 3-Panel, Internal Notes, & Lead Tagging).
10. 🚀 **[HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md)**: Langkah deployment lengkap pada Hostinger Node.js Web Application.
11. 📋 **[README.md](README.md)**: Panduan utama proyek.

---

## 🚀 Panduan Memulai Cepat (Quick Start Local)

```bash
# 1. Install dependensi
npm install

# 2. Sinkronisasi database SQLite lokal & seed data
npx prisma db push
npx prisma db seed

# 3. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### Akses Cepat Modul:
- **Public Website B2B**: `http://localhost:3000`
- **Customer Service Workspace**: `http://localhost:3000/cs/inbox`
- **Executive Admin Dashboard**: `http://localhost:3000/admin/dashboard`

---

## 🏢 Legalitas & Klasifikasi Bisnis KBLI LST

* 26220 — Industri Perlengkapan Komputer
* 26791 — Industri Peralatan Laboratorium & Pengukuran
* 46511 — Perdagangan Besar Komputer & Perlengkapan Komputer
* 46512 — Perdagangan Besar Peranti Lunak
* 46591 — Perdagangan Besar Mesin Kantor & Industri
* 62090 — Aktivitas Teknologi Informasi & Jasa Komputer Lainnya
* 74201 — Jasa Konsultasi Perancangan Sistem
* 95110 — Reparasi Komputer & Peralatan Pembantu
* 95120 — Reparasi Peralatan Komunikasi

---

*Diproduksi untuk CV Life Solution Technology, Kasian, Mudal, Temanggung, Jawa Tengah.*
