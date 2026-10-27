# BUKU DOKUMENTASI LENGKAP SISTEM (MASTER DOCUMENTATION)
## LST Digital Business Platform
### CV Life Solution Technology — Temanggung, Jawa Tengah

---

## DAFTAR ISI

1. [Informasi Umum & Identitas Bisnis](#1-informasi-umum--identitas-bisnis)
2. [Arsitektur Sistem & Desain Perangkat Lunak](#2-arsitektur-sistem--desain-perangkat-lunak)
3. [Struktur Direktori & Peta Kode Sumber](#3-struktur-direktori--peta-kode-sumber)
4. [Skema Basis Data & Model Prisma (ERD)](#4-skema-basis-data--model-prisma-erd)
5. [Autentikasi, Keamanan & RBAC (Role-Based Access Control)](#5-autentikasi-keamanan--rbac-role-based-access-control)
6. [Modul 1: Portal Publik B2B & Katalog Produk](#6-modul-1-portal-publik-b2b--katalog-produk)
7. [Modul 2: AI Virtual Consultant & Multi-LLM RAG Engine](#7-modul-2-ai-virtual-consultant--multi-llm-rag-engine)
8. [Modul 3: Customer Service (CS) Workspace Portal](#8-modul-3-customer-service-cs-workspace-portal)
9. [Modul 4: Executive Admin Dashboard & Mini CRM](#9-modul-4-executive-admin-dashboard--mini-crm)
10. [Spesifikasi Lengkap API Endpoints (REST API Reference)](#10-spesifikasi-lengkap-api-endpoints-rest-api-reference)
11. [Panduan Instalasi, Konfigurasi & Deployment](#11-panduan-instalasi-konfigurasi--deployment)
12. [SOP Operasional, Troubleshooting & FAQ](#12-sop-operasional-troubleshooting--faq)

---

## 1. INFORMASI UMUM & IDENTITAS BISNIS

### 1.1 Profil Perusahaan
- **Nama Entitas**: CV Life Solution Technology (LST)
- **Lokasi Kantor**: Kasian, Mudal, Kec. Temanggung, Kabupaten Temanggung, Jawa Tengah
- **Positioning**: *Technology Solution & Digital Transformation Partner*
- **Prinsip Layanan (End-to-End Cycle)**: 
  $$\text{Consult} \longrightarrow \text{Design} \longrightarrow \text{Supply} \longrightarrow \text{Implement} \longrightarrow \text{Support}$$
- **Kontak & Komunikasi**:
  - Email Resmi: `lifesolutiont@gmail.com`
  - WhatsApp Bisnis: `0821-3555-0007`
  - Website: `https://lifesolution.co.id`

### 1.2 Legalitas & Klasifikasi Baku Lapangan Usaha Indonesia (KBLI)
Platform ini dirancang untuk mematuhi dan merepresentasikan 9 klasifikasi KBLI resmi LST:
| Kode KBLI | Klasifikasi Bidang Usaha |
|---|---|
| **26220** | Industri Perlengkapan Komputer |
| **26791** | Industri Peralatan Laboratorium & Pengukuran |
| **46511** | Perdagangan Besar Komputer & Perlengkapan Komputer |
| **46512** | Perdagangan Besar Peranti Lunak (Software) |
| **46591** | Perdagangan Besar Mesin Kantor & Industri |
| **62090** | Aktivitas Teknologi Informasi & Jasa Komputer Lainnya |
| **74201** | Jasa Konsultasi Perancangan Sistem |
| **95110** | Reparasi Komputer & Peralatan Pembantu |
| **95120** | Reparasi Peralatan Komunikasi |

### 1.3 Delapan (8) Pilar Layanan Utama LST
1. **Smart Classroom & Education Technology**: Solusi digital interaktif untuk sekolah, kampus, dan bimbel (Interactive Flat Panel/IFP, OPS PC, Smartboard, sound system kelas, software LMS).
2. **Network & IT Infrastructure**: Perancangan dan instalasi jaringan LAN, WLAN enterprise, kabel Fiber Optic (FO), manajemen router/switch MikroTik/Cisco/Ruijie, dan server deployment.
3. **CCTV & Integrated Security**: Sistem pengawasan video closed-circuit, IP Camera resolusi tinggi, Network Video Recorder (NVR), media penyimpanan tersentralisasi, dan pemantauan jarak jauh.
4. **IT & Office Equipment**: Pengadaan komputer instansi, PC workstation, laptop dinas, printer laser/ink tank, scanner dokumen cepat, proyektor, dan aksesoris kantor.
5. **System & Software Solutions**: Pengembangan aplikasi berbasis web, sistem informasi manajemen (SIM), otomatisasi alur kerja, integrasi API, dan sistem digitalisasi bisnis kustom.
6. **AI & Digital Learning**: Penerapan kecerdasan buatan terapan, chatbot konsultasi cerdas, otomasi layanan pelanggan, dan platform pembelajaran adaptif.
7. **IT Consulting & System Integration**: Asesmen infrastruktur, audit kebutuhan perangkat, perencanaan anggaran teknologi (RAB), dan integrasi sistem lintas vendor untuk korporasi dan instansi pemerintah.
8. **Maintenance & Technical Support**: Kontrak pemeliharaan berkala (preventif & kuratif), teknisi on-site, troubleshooting jaringan/perangkat, dan garansi purna jual resmi.

---

## 2. ARSITEKTUR SISTEM & DESAIN PERANGKAT LUNAK

### 2.1 Pola Arsitektur (Modular Monolith)
Platform ini dibangun dengan pola **Modular Monolith** menggunakan **Next.js 15 (App Router)**. Pendekatan ini menyatukan antarmuka publik, portal operasional CS, dan dashboard eksekutif admin dalam satu repositori (*monorepo code base*) dengan pemisahan batas konteks (*bounded context*) yang ketat.

Keunggulan pola ini untuk infrastruktur LST:
- **Efisien Sumber Daya**: Jejak memori rendah (< 400 MB RAM), sangat ideal untuk lingkungan Cloud VPS maupun shared container seperti Hostinger Business Node.js.
- **Single Source of Truth**: Satu skema Prisma ORM mengontrol basis data secara konsisten.
- **Keamanan Terisolasi**: Middleware Next.js memvalidasi JWT cookie pada *edge layer* sebelum request mencapai Route Handlers atau Server Components.

### 2.2 Diagram Arsitektur Tingkat Tinggi (High-Level Architecture)

```mermaid
graph TD
    subgraph Klien / Pengguna
        PUB[Pengunjung Publik B2B<br>/, /products, /solutions]
        CSU[Operator Customer Service<br>/cs/inbox]
        ADM[Manajemen & Eksekutif<br>/admin/*]
    end

    subgraph Gerbang Akses & Edge Security
        MID[Next.js Middleware<br>JWT & Role Isolation]
        RATELIM[In-Memory Rate Limiter]
        SAN[Input Sanitizer & Boundary Check]
    end

    subgraph Next.js 15 App Server
        subgraph Modul Presentasi
            PAGES_PUB[Public Pages & SEO Layout]
            PAGES_CS[3-Panel CS Workspace UI]
            PAGES_ADM[15 Sub-Modul Admin Dashboard]
        end

        subgraph Core Business Services
            AUTH_SRV[Auth & Session Service<br>jose JWT + bcryptjs]
            RBAC_SRV[RBAC Guard & Deny-by-Default]
            EMAIL_SRV[Nodemailer SMTP Service<br>Hostinger SMTP / lifesolutiont@gmail.com]
            REALTIME_SRV[Realtime Polling Engine<br>3-Second Polling Fallback]
            AI_GATEWAY[AI Multi-LLM Gateway<br>Claude / Gemini / OpenAI]
            RAG_LOADER[RAG Knowledge Base Loader<br>FAQ + DB Product Catalog]
        end

        subgraph API Route Handlers
            API_PUB[/api/public/*]
            API_AI[/api/ai/*]
            API_CS[/api/cs/*]
            API_CRM[/api/leads, /api/admin/leads]
            API_ADM[/api/admin/*]
        end
    end

    subgraph Data & Layanan Eksternal
        PRISMA[Prisma ORM 5.22]
        DB[(PostgreSQL / Supabase / SQLite)]
        LLM_EXT[AI Providers: Anthropic / Google Gemini / OpenAI]
        SMTP_EXT[Hostinger SMTP Server: smtp.hostinger.com:465]
    end

    PUB --> MID
    CSU --> MID
    ADM --> MID

    MID --> RATELIM --> SAN

    SAN --> PAGES_PUB
    SAN --> PAGES_CS
    SAN --> PAGES_ADM

    PAGES_PUB --> API_PUB
    PAGES_PUB --> API_AI
    PAGES_CS --> API_CS
    PAGES_ADM --> API_ADM

    API_PUB & API_CS & API_CRM & API_ADM --> AUTH_SRV
    API_PUB & API_CS & API_CRM & API_ADM --> RBAC_SRV
    API_AI --> AI_GATEWAY
    AI_GATEWAY --> RAG_LOADER --> PRISMA
    AI_GATEWAY --> LLM_EXT

    API_PUB & API_CRM --> EMAIL_SRV --> SMTP_EXT
    API_CS --> REALTIME_SRV

    AUTH_SRV & RBAC_SRV & REALTIME_SRV --> PRISMA
    PRISMA --> DB
```

### 2.3 Strategi Real-time (Polling Engine vs WebSocket)
Pada lingkungan hosting shared seperti Hostinger Node.js Web Application, koneksi persisten seperti kustom WebSocket sering dibatasi oleh timeout reverse proxy Nginx. Oleh karena itu, platform ini menerapkan **Realtime Polling Engine** (`lib/realtime/polling.ts`) dengan interval adaptif 3 detik:
- **Efisien**: Pengambilan data CS Timeline dan CS Queue hanya memuat payload pesan baru menggunakan kueri berindeks (`createdAt > lastSync`).
- **Resilient**: Bebas dari resiko *dropped socket*, otomatis melakukan *reconnection* tanpa overhead reconnect handshake.
- **Kompatibel Penuh**: Bekerja 100% pada HTTP/1.1 dan HTTP/2 tanpa memerlukan server background socket terpisah.

---

## 3. STRUKTUR DIREKTORI & PETA KODE SUMBER

Berikut adalah pemetaan struktural berkas pada repositori `LST-repo`:

```
LST-repo/
├── app/                                # Next.js App Router (Halaman & Endpoint)
│   ├── (public)/                       # Route Group untuk Portal Publik (B2B)
│   │   ├── about/                      # Halaman Tentang LST & Legalitas
│   │   ├── contact/                    # Formulir Kontak & Integrasi Email
│   │   ├── faq/                        # Halaman FAQ Publik
│   │   ├── insights/                   # Artikel, Studi Kasus, & Berita
│   │   ├── portfolio/                  # Galeri Proyek Sukses & Showcase
│   │   ├── products/                   # Katalog Hardware & Software B2B
│   │   ├── solutions/                  # Detail 8 Solusi Teknologi LST
│   │   ├── layout.tsx                  # Navbar + Footer Wrapper Publik
│   │   └── page.tsx                    # Homepage Utama (Hero, Solusi, AI Widget)
│   ├── admin/                          # Executive Admin Dashboard Portal
│   │   ├── ai-analytics/               # Analitik Kinerja AI (Resolusi & Latensi)
│   │   ├── audit-log/                  # Audit Trail Keamanan Sistem
│   │   ├── cms/                        # Manajemen Halaman, FAQ & Banner
│   │   ├── cs-monitoring/              # Pemantauan Live Chat CS (Read-Only)
│   │   ├── dashboard/                  # Executive Overview KPI & Revenue Chart
│   │   ├── leads/                      # Kanban Board CRM 7 Tahap Prospek
│   │   ├── portfolio/                  # CMS Studi Kasus Portofolio
│   │   ├── products/                   # Manajemen Katalog & Switch Harga
│   │   ├── profile/                    # Profil Pengguna Aktif & 2FA
│   │   ├── projects/                   # Pelacakan Proyek & Publish Portfolio
│   │   ├── quotations/                 # Generator Surat Penawaran Harga
│   │   ├── sales/                      # Laporan Transaksi & Omzet Finansial
│   │   ├── settings/                   # Pengaturan Perusahaan & SMTP Email
│   │   ├── users/                      # Manajemen Akun & Hak Akses (RBAC)
│   │   ├── website-analytics/          # Statistik Event & Pengunjung Web
│   │   └── layout.tsx                  # Admin Sidebar & Header Shell
│   ├── cs/                             # Customer Service Workspace Portal
│   │   ├── inbox/                      # Workspace 3-Panel Chat Real-Time
│   │   └── layout.tsx                  # Isolasi Layout CS Operator
│   ├── api/                            # Backend REST Route Handlers
│   │   ├── admin/                      # Endpoint Terproteksi Role Admin
│   │   ├── ai/                         # Gateway AI Chat & Eskalasi Handoff
│   │   ├── auth/                       # Login, Logout, Session Profile
│   │   ├── cs/                         # Manajemen Antrean & Pesan CS
│   │   ├── leads/                      # Penerimaan Prospek Form / Widget
│   │   └── public/                     # Tracking Event & Settings Publik
│   ├── login/                          # Halaman Autentikasi Pengguna
│   ├── globals.css                     # Global Stylesheet & Design Tokens
│   └── layout.tsx                      # Root HTML Shell & Font Loader
├── components/                         # Komponen Antarmuka Reusable
│   ├── admin/                          # AdminHeader, AdminSidebar, ImageUploader
│   ├── cs/                             # CSQueueSidebar, ChatTimeline, CustomerContextPanel
│   ├── public/                         # AIConsultantWidget, Navbar, Footer, AnalyticsTracker
│   └── ui/                             # Komponen Dasar (Button, Badge, Modal, Card)
├── lib/                                # Core Engine, Utilitas & Library
│   ├── ai/                             # Multi-LLM Gateway, Prompt, RAG Loader
│   │   ├── adapters/                   # Adapter Claude, Gemini, OpenAI
│   │   ├── gateway.ts                  # Boundary Sanitizer & Tool Denylist
│   │   ├── handoff.ts                  # Ringkasan Otomatis Handoff ke CS
│   │   ├── knowledge.ts                # RAG Context Dynamic Scoring
│   │   └── types.ts                    # Tipe Data Pesan & LLM Interface
│   ├── auth/                           # Keamanan Sesi & RBAC
│   │   ├── guard.ts                    # Helper withPermission() Handler
│   │   ├── password.ts                 # Enkripsi & Hash Password bcryptjs
│   │   ├── rbac.ts                     # Matriks Hak Akses & Deny-by-Default
│   │   └── session.ts                  # Encoding & Verifikasi JWT jose
│   ├── db/                             # Prisma Client Singleton Instance
│   ├── realtime/                       # Polling Abstraction Engine
│   ├── security/                       # Audit Log, DTO Sanitizer, Rate Limiter
│   ├── validations/                    # Zod Schema Validator Terpadu
│   └── email.ts                        # Nodemailer Sender (SMTP Dispatched)
├── prisma/                             # Skema & Migrasi Basis Data
│   ├── schema.prisma                   # Deklarasi 21 Model Entitas Database
│   └── seed.ts                         # Data Awal Akun, Produk & Layanan
├── public/                             # Aset Statis Publik (Gambar, Logo, Ikon)
├── middleware.ts                       # Edge Session Gatekeeper & Route Protection
├── next.config.js                      # Konfigurasi Next.js & Header Keamanan
└── package.json                        # Dependensi & Skrip Node.js
```

---

## 4. SKEMA BASIS DATA & MODEL PRISMA (ERD)

Basis data dikelola menggunakan **Prisma ORM 5.22** dengan dukungan PostgreSQL (Supabase) dan kompatibel penuh dengan SQLite/MySQL. Skema ini terdiri dari **21 Model Relasional** yang mendukung siklus bisnis end-to-end.

```mermaid
erDiagram
    User ||--o{ ConversationAssignment : assigns
    User ||--o{ Lead : owns
    User ||--o{ Project : manages
    User ||--o{ AuditLog : acts

    Customer ||--o{ Lead : has
    Customer ||--o{ Conversation : initiates

    Lead ||--o{ LeadActivity : logs
    Lead ||--o{ LeadNote : contains
    Lead ||--o{ Quotation : generates
    Lead ||--o| Project : converts_to

    Conversation ||--o{ Message : contains
    Conversation ||--o{ ConversationAssignment : assigned_to

    ProductCategory ||--o{ Product : classifies
    Product ||--o{ QuotationItem : quoted_in
    Product ||--o{ SaleItem : sold_in

    Quotation ||--o{ QuotationItem : includes

    SaleTransaction ||--o{ SaleItem : contains

    Project ||--o{ ProjectUpdate : updates
    Project ||--o| PortfolioProject : publishes_as
    PortfolioProject ||--o{ PortfolioMedia : displays

    FAQCategory ||--o{ FAQ : groups
```

### 4.1 Rincian Entitas & Fungsi Tabel

#### Grup 1: Pengguna, Akses & Audit
1. **`User`**: Menyimpan akun pengguna internal sistem.
   - Kolom: `id`, `name`, `email` (Unique), `passwordHash`, `role` (`SUPER_ADMIN`, `SALES`, `CUSTOMER_SERVICE`, `CONTENT_EDITOR`), `status` (`ACTIVE`, `DISABLED`), `mfaEnabled`, `isOnline`, `deletedAt`, `createdAt`, `updatedAt`.
2. **`AuditLog`**: Mencatat semua perubahan krusial, aksi admin, pembuatan akun, dan inspeksi percakapan secara *tamper-evident*.
   - Kolom: `id`, `userId`, `action` (`CREATE`, `UPDATE`, `DELETE`, `ROLE_CHANGE`, `INSPECTION`), `resource`, `details`, `ipAddress`, `createdAt`.

#### Grup 2: Pelanggan & CRM Pipeline (Leads)
3. **`Customer`**: Data master profil instansi atau klien yang menghubungi LST.
   - Kolom: `id`, `name`, `institution`, `email`, `phone`, `location`, `notes`, `deletedAt`, `createdAt`.
4. **`Lead`**: Rekam jejak peluang prospek bisnis dalam pipeline CRM.
   - Kolom: `id`, `customerId`, `ownerId` (User PIC), `source` (`AI_CHAT`, `CONTACT_FORM`, `WHATSAPP`, `MANUAL`), `interest`, `stage` (`NEW`, `CONTACTED`, `QUALIFIED`, `QUOTATION`, `NEGOTIATION`, `WON`, `LOST`), `estimatedValue`, `notes`, `nextFollowUp`, `deletedAt`.
5. **`LeadActivity`**: Jejak audit perpindahan tahap kanban atau aktivitas follow-up klien.
   - Kolom: `id`, `leadId`, `type` (`STAGE_CHANGE`, `NOTE_ADDED`, `CALL`, `MEETING`, `EMAIL`), `title`, `details`, `actorName`, `createdAt`.
6. **`LeadNote`**: Catatan kolaboratif staf internal mengenai prospek tertentu.
   - Kolom: `id`, `leadId`, `author`, `content`, `createdAt`.

#### Grup 3: Percakapan & Live Chat CS
7. **`Conversation`**: Sesi obrolan pengunjung, baik saat ditangani AI maupun staf CS.
   - Kolom: `id`, `customerId`, `visitorId`, `status` (`AI_HANDLING`, `WAITING_FOR_CS`, `ASSIGNED`, `HUMAN_HANDLING`, `FOLLOW_UP`, `CLOSED`), `summary`, `intentCategory`, `channel`, `unreadCS`, `deletedAt`.
8. **`Message`**: Butir pesan individual dalam percakapan.
   - Kolom: `id`, `conversationId`, `senderType` (`VISITOR`, `AI`, `CS`, `SYSTEM`), `senderName`, `content`, `isInternalNote` (Boolean), `attachmentUrl`, `createdAt`.
   - *Catatan Penting*: Kolom `isInternalNote: true` menandakan pesan diskusi rahasia tim CS/internal yang difilter dan tidak akan pernah dikirimkan ke browser pengunjung.
9. **`ConversationAssignment`**: Penugasan sesi obrolan kepada staf CS spesifik.
   - Kolom: `id`, `conversationId`, `userId`, `assignedAt`, `releasedAt`.

#### Grup 4: Produk & Solusi Layanan
10. **`ProductCategory`**: Kategori perangkat keras/lunak (Smart Classroom, Networking, CCTV, PC, Server).
    - Kolom: `id`, `name`, `slug`, `description`, `status`, `sortOrder`.
11. **`Product`**: Entitas produk hardware/software B2B.
    - Kolom: `id`, `categoryId`, `name`, `slug`, `sku`, `brand`, `shortDescription`, `specifications` (JSON), `description`, `price`, `showPrice` (Boolean), `availability` (`IN_STOCK`, `BY_REQUEST`, `PROJECT_BASED`), `status`, `imageUrl`, `isFeatured`.
    - *Fitur Khusus*: Sakelar `showPrice` memungkinkan menyembunyikan harga eceran jika produk tersebut bersifat harga proyek/tender pemerintah.
12. **`ServiceSolution`**: Presentasi 8 pilar solusi utama LST pada website publik.
    - Kolom: `id`, `title`, `slug`, `iconName`, `tagline`, `problemText`, `scopeText`, `processText`, `imageUrl`, `status`, `isFeatured`.

#### Grup 5: Penawaran, Transaksi & Proyek
13. **`Quotation`**: Surat penawaran harga resmi (*Quotations*) untuk klien instansi.
    - Kolom: `id`, `leadId`, `code` (Unique), `clientName`, `totalAmount`, `status` (`DRAFT`, `REVIEW`, `SENT`, `NEGOTIATION`, `APPROVED`, `REJECTED`, `EXPIRED`), `validUntil`, `notes`.
14. **`QuotationItem`**: Rincian barang, jumlah, dan harga satuan dalam penawaran.
    - Kolom: `id`, `quotationId`, `productId`, `itemTitle`, `quantity`, `unitPrice`, `totalPrice`.
15. **`SaleTransaction`**: Catatan riwayat transaksi penjualan pengadaan yang telah selesai.
    - Kolom: `id`, `code`, `clientName`, `category`, `totalRevenue`, `paymentStatus` (`UNPAID`, `PARTIAL`, `PAID`, `OVERDUE`), `status`, `saleDate`.
16. **`SaleItem`**: Item produk yang terjual dalam transaksi penjualan.
    - Kolom: `id`, `transactionId`, `productId`, `productName`, `quantity`, `price`.
17. **`Project`**: Manajemen pengerjaan proyek implementasi setelah kesepakatan *WON*.
    - Kolom: `id`, `leadId`, `title`, `clientName`, `sector`, `location`, `value`, `picId`, `progress` (0 - 100), `paymentStatus`, `startDate`, `endDate`, `status` (`PLANNING`, `PROCUREMENT`, `INSTALLATION`, `TESTING`, `COMPLETED`, `ON_HOLD`, `CANCELLED`).
18. **`ProjectUpdate`**: Catatan progres mingguan dan persentase pengerjaan proyek.
    - Kolom: `id`, `projectId`, `note`, `progress`, `createdAt`.
19. **`PortfolioProject`**: Studi kasus implementasi yang dipublikasikan ke portal publik.
    - Kolom: `id`, `projectId` (One-to-One), `title`, `slug`, `sector`, `location`, `solutionType`, `challengeText`, `scopeText`, `resultText`, `coverImageUrl`, `isPublished`.
20. **`PortfolioMedia`**: Galeri foto dan dokumentasi instalasi lapangan pada portofolio.
    - Kolom: `id`, `portfolioProjectId`, `mediaUrl`, `caption`.

#### Grup 6: Konten, Pengetahuan AI & Metrik
21. **`FAQCategory` & `FAQ`**: Pertanyaan umum yang dikelompokkan berdasarkan topik. Memiliki kolom `syncToAI: Boolean` yang otomatis memasukkan tanya-jawab ke dalam RAG AI Context.
22. **`Article`**: Artikel publikasi, edukasi teknologi, dan wawasan industri.
23. **`PageContent`**: Variabel konfigurasi konten halaman dinamis (Hero homepage, Pengaturan perusahaan, SMTP konfigurasi).
24. **`AIKnowledgeSource`**: Dokumen referensi resmi (manual teknis, kebijakan garansi, SOP LST) yang disetujui untuk diumpankan ke AI LLM.
25. **`AIConversationMetric`**: Pengukuran efisiensi AI (Total pesan, apakah selesai oleh AI, apakah dieskalasi ke CS, klasifikasi intent, dan waktu respons latensi).
26. **`WebsiteEvent`**: Rekam jejak interaksi pengguna publik (`PAGE_VIEW`, `CTA_CLICK`, `AI_START`, `CS_REQUEST`, `WA_CLICK`, `QUOTE_REQ`).
27. **`PartnerLogo`**: Logo instansi mitra, klien korporat, dan prinsipal teknologi.

---

## 5. AUTENTIKASI, KEAMANAN & RBAC (ROLE-BASED ACCESS CONTROL)

### 5.1 Mekanisme Sesi & Cookie HttpOnly
Platform ini tidak menggunakan local storage rentan XSS. Sesi dikelola dengan **Stateless JSON Web Token (JWT)** menggunakan pustaka standar industri `jose`:
- **Nama Cookie**: `lst_session_token`
- **Atribut Keamanan**: `HttpOnly` (tidak dapat dibaca oleh skrip JavaScript klien), `SameSite=Lax`, `Secure` (pada lingkungan HTTPS), dan `Path=/`.
- **Payload Token**: Berisi `userId`, `email`, dan `role`.

### 5.2 Middleware Gatekeeper (`middleware.ts`)
Pintu masuk rute `/admin/*` dan `/cs/*` dijaga ketat di lapisan Edge Runtime:
1. **Pemeriksaan Token**: Jika cookie kosong atau tidak valid, pengguna langsung dialihkan ke `/login?error=Otentikasi diperlukan`.
2. **Isolasi Rute CS (`CUSTOMER_SERVICE`)**: Staf Customer Service **dilarang keras** mengakses modul admin keuangan/CRM. Upaya membuka rute admin akan otomatis dialihkan ke `/cs/inbox`.
3. **Isolasi Rute Sales (`SALES`)**: Peran Sales hanya diizinkan mengakses modul bisnis: `/admin/leads`, `/admin/quotations`, `/admin/sales`, `/admin/projects`, `/admin/products`, dan `/admin/profile`. Upaya membuka CMS/User/Audit Log akan dialihkan ke `/admin/leads`.
4. **Isolasi Rute Editor (`CONTENT_EDITOR`)**: Hanya diizinkan mengakses `/admin/products`, `/admin/cms`, `/admin/portfolio`, dan `/admin/profile`.

### 5.3 Matriks Izin (Role Permission Matrix)
Pemberian izin menerapkan prinsip **Deny-by-Default** (`lib/auth/rbac.ts`):

| Hak Akses / Permission | SUPER_ADMIN | SALES | CUSTOMER_SERVICE | CONTENT_EDITOR |
|---|:---:|:---:|:---:|:---:|
| **Semua Akses (`*`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |
| **Akses Dashboard KPI (`dashboard:read`)** | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| **Kelola Prospek CRM (`lead.*`)** | ✅ Ya | ✅ Ya | ✅ Hanya Buat Baru | ❌ Tidak |
| **Kelola Penawaran (`quotation.*`)** | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| **Kelola Transaksi Penjualan (`sales.*`)** | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| **Kelola Proyek Pengerjaan (`project.*`)** | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| **Kelola Katalog Produk (`product.*`)** | ✅ Ya | ✅ Lihat Saja | ❌ Tidak | ✅ Buat & Edit |
| **Kelola CMS & Portofolio (`content.manage`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ✅ Ya |
| **Kelola Basis Pengetahuan AI (`kb.manage`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ✅ Ya |
| **Baca & Balas Chat CS (`conversation.*`)** | ✅ Ya | ❌ Tidak | ✅ Ya | ❌ Tidak |
| **Kelola Akun Pengguna (`user.manage`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |
| **Lihat Audit Log Keamanan (`audit.read`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |
| **Monitoring CS Live (`cs.monitor`)** | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |

---

## 6. MODUL 1: PORTAL PUBLIK B2B & KATALOG PRODUK

### 6.1 Antarmuka Publik & Navigasi
Portal publik difokuskan untuk instansi sekolah, universitas, dinas pemerintahan, dan korporasi dengan desain modern yang cepat, elegan, dan ramah SEO.
- **Halaman Utama (`/`)**:
  - Banner Hero interaktif dengan CTA *Konsultasi Gratis* dan *Lihat Solusi*.
  - Showcase 8 Pilar Solusi Teknologi LST.
  - Featured Products (perangkat unggulan seperti Interactive Flat Panel dan Server).
  - Logo klien terpercaya dan prinsipal hardware.
  - Ringkasan nilai perusahaan: *Consult → Design → Supply → Implement → Support*.
- **Halaman Solusi (`/solutions` & `/solutions/[slug]`)**:
  - Penjelasan mendalam mengenai arsitektur solusi, tantangan umum klien, ruang lingkup pengerjaan (*Scope of Work*), dan proses implementasi standar LST.
- **Katalog Produk B2B (`/products` & `/products/[slug]`)**:
  - Pencarian pintar & filter berdasarkan kategori produk.
  - Tampilan spesifikasi teknis lengkap.
  - Status ketersediaan (*Ready stock*, *Inden*, atau *Berbasis proyek*).
  - Tombol aksi: "Minta Penawaran Resmi" yang otomatis membuka chat konsultasi atau formulir penawaran.
- **Studi Kasus Portofolio (`/portfolio` & `/portfolio/[slug]`)**:
  - Dokumentasi proyek nyata di berbagai sektor (Pendidikan, Korporasi, Pemerintahan).
  - Breakdown: Tantangan Lapangan, Solusi LST, dan Hasil/Dampak Implementasi.
- **FAQ Publik (`/faq`)**:
  - Tanya jawab umum seputar garansi, survei lokasi, metode pembayaran proyek, dan alur kontrak.
- **Formulir Kontak Terintegrasi (`/contact`)**:
  - Formulir konsultasi langsung yang menyimpan prospek ke basis data dan **secara otomatis mengirim notifikasi email** via SMTP ke admin LST (`lifesolutiont@gmail.com`).

### 6.2 Widget Konsultasi AI Mengambang (`AIConsultantWidget.tsx`)
Terletak di sudut kanan bawah seluruh halaman publik:
- **Pills Saran Cepat (Quick Intent Prompts)**: Contoh: "Pengadaan Smart Classroom", "Kebutuhan Fiber Optic Sekolah", "Pasang CCTV Kantor".
- **Realtime Response Handling**: Merespons pertanyaan seputar layanan dan produk LST dalam hitungan detik.
- **Tombol Eskalasi CS Manusia**: Klien dapat menekan tombol "Hubungi Staf CS Kami" kapan saja untuk beralih dari bot AI ke antrean CS manusia.

### 6.3 Pelacak Event Analitik (`AnalyticsTracker.tsx`)
Secara otomatis mencatat metrik interaksi pengunjung tanpa melanggar privasi:
- `PAGE_VIEW`: Halaman yang dikunjungi.
- `CTA_CLICK`: Tombol penawaran atau konsultasi yang diklik.
- `AI_START`: Pengunjung yang mulai membuka widget AI.
- `CS_REQUEST`: Permintaan eskalasi ke staf CS.
- `WA_CLICK`: Klik tombol tautan WhatsApp resmi.

---

## 7. MODUL 2: AI VIRTUAL CONSULTANT & MULTI-LLM RAG ENGINE

### 7.1 Multi-Provider Adapter Architecture
Sistem AI LST dirancang modular melalui antarmuka `AIProviderAdapter` (`lib/ai/index.ts`). Sistem mendukung 3 provider utama:
1. **Anthropic Claude** (Default: `claude-3-haiku` / `claude-3-5-sonnet`)
2. **Google Gemini** (`gemini-1.5-flash` / `gemini-2.0-flash`)
3. **OpenAI** (`gpt-4o-mini`)

Pemilihan model dapat diatur fleksibel melalui variabel lingkungan `AI_PRIMARY_PROVIDER`.

### 7.2 Retrieval-Augmented Generation (RAG) Loader (`lib/ai/knowledge.ts`)
Setiap kali pengunjung mengirim pesan, sistem mengumpulkan konteks resmi dari basis data untuk diumpankan ke prompt AI:
1. **Dynamic Product Ranking**: Mencocokkan kata kunci pertanyaan pengunjung dengan seluruh katalog produk terbitan LST, menyaring 25 produk paling relevan.
2. **Solusi & Layanan**: Menyertakan ikhtisar 8 layanan resmi LST.
3. **FAQ Terverifikasi**: Menyertakan seluruh FAQ yang ditandai `syncToAI: true`.
4. **Dokumen Knowledge Base**: Menyertakan petunjuk teknis yang disetujui oleh admin pada tabel `AIKnowledgeSource`.

### 7.3 Batasan & Keamanan AI (AI Guardrails)
Untuk menjaga integritas dan keamanan reputasi bisnis:
- **Sanitasi Prompt Boundary**: Membersihkan pola manipulasi prompt (*Prompt Injection*) seperti `ignore previous instructions`, `<system_override>`, atau upaya mengambil data internal.
- **Denylist Alat AI (Prohibited Tools)**:
  AI secara tegas dilarang mengeksekusi operasi berbahaya seperti `executeSQL`, `runCommand`, `readSecrets`, `readAllSales`, `changeUserRole`, atau `deleteUser`.
- **Approved Tools Only**: AI hanya diberi izin mengeksekusi fungsi terverifikasi:
  - `searchProducts`: Mencari katalog hardware/software.
  - `searchFAQ`: Mencari referensi tanya jawab.
  - `createLead`: Mendaftarkan prospek kontak klien ke dalam CRM secara otomatis.

### 7.4 Ringkasan Eskalasi Otomatis (AI-to-CS Handoff)
Ketika pengunjung meminta berbicara dengan manusia:
1. Sistem menganalisis seluruh riwayat obrolan pengunjung bersama AI.
2. AI menghasilkan rangkuman terstruktur dalam format JSON:
   ```json
   {
     "intentCategory": "Smart Classroom & EduTech",
     "summaryText": "Klien membutuhkan 6 unit Smartboard 75 inch dan instalasi jaringan LAN untuk laboratorium sekolah.",
     "urgencyLevel": "HIGH"
   }
   ```
3. Status percakapan dialihkan menjadi `WAITING_FOR_CS`.
4. Rangkuman ini langsung muncul pada panel CS, sehingga staf CS memahami kebutuhan klien tanpa harus bertanya dari awal.

---

## 8. MODUL 3: CUSTOMER SERVICE (CS) WORKSPACE PORTAL

Modul CS (`/cs/inbox`) adalah pusat kerja terintegrasi bagi staf Customer Service untuk menangani eskalasi obrolan publik secara efisien.

```
+-----------------------------------------------------------------------------------------+
|                               CS LIVE WORKSPACE (3-PANEL)                               |
+--------------------------+------------------------------------+-------------------------+
| PANEL 1: QUEUE SIDEBAR   | PANEL 2: TIMELINE OBROLAN          | PANEL 3: KONTEKS KLIEN  |
| (Daftar Antrean Chat)    | (Riwayat Percakapan & Balasan)     | (Profil & Integrasi CRM)|
+--------------------------+------------------------------------+-------------------------+
| [Menunggu CS] (2)        | [Banner Rangkuman Kebutuhan AI]    | NAMA PELANGGAN:         |
| • SMA Negeri 1 Tmg       | "Klien butuh penawaran 8 unit IFP" | Bpk. Hendro Cahyono     |
|   14:20 • Smartboard     | ---------------------------------- | INSTANSI / SEKOLAH:     |
| • PT Graha Media         | [Pengunjung] Halo, mohon dibantu.  | SMA Negeri 1 Temanggung |
|   14:15 • Jaringan FO    | [AI Bot] Baik, kami sambungkan...  | NO WHATSAPP:            |
|                          | [CS Anton] Selamat siang Pak...    | 0812-3456-7890          |
| [Sedang Berlangsung] (1) |                                    |                         |
| • Lab Komputer SMKN 2    | ---------------------------------- | [AKSI CEPAT CRM]        |
|                          | [ Mode: Catatan Internal (Kuning) ]| • Jadwalkan Follow-Up   |
| [Selesai / Ditutup]      | "Teknisi survey lokasi jam 15.00"  | • Buat Prospek CRM Baru |
|                          |                                    | • Selesaikan / Tutup    |
+--------------------------+------------------------------------+-------------------------+
```

### 8.1 Alur Kerja Operasional Staf CS
1. **Memonitor Antrean Masuk**:
   Staf CS membuka tab **Menunggu CS** (*Waiting*). Percakapan yang baru dieskalasi dari bot AI akan berkedip dan memiliki tanda lencana *unread*.
2. **Klaim Percakapan (*Accept Chat*)**:
   Staf menekan tombol "Terima Percakapan". Sistem mengunci sesi ke staf tersebut (`ConversationAssignment`) dan mengubah status menjadi `HUMAN_HANDLING`.
3. **Membaca Rangkuman AI**:
   Di bagian atas timeline, staf langsung melihat kotak biru berisi rangkuman kebutuhan dan tingkat urgensi klien.
4. **Fitur Catatan Internal (*Internal Note Mode*)**:
   - Jika staf mengaktifkan tombol sakelar **Catatan Internal (Warna Kuning)**, pesan yang diketik disimpan dengan `isInternalNote: true`.
   - Pesan ini ditujukan untuk koordinasi antar-staf internal (misal: "Klien ini minta diskon khusus 5%, konfirmasi ke Pak Sales").
   - **Klien di website tidak akan pernah melihat catatan internal ini**.
5. **Konversi ke Lead CRM (*Mark as Lead*)**:
   Staf cukup mengklik tombol **Jadikan Prospek CRM** di panel kanan. Data nama, institusi, nomor telepon, dan kebutuhan klien otomatis masuk ke Kanban Board tim Sales.
6. **Penutupan Sesi (*Close Conversation*)**:
   Setelah konsultasi selesai, staf mengubah status menjadi `CLOSED` atau menjadwalkan tanggal tindak lanjut (`FOLLOW_UP`).

---

## 9. MODUL 4: EXECUTIVE ADMIN DASHBOARD & MINI CRM

Modul Admin (`/admin`) menyediakan 15 sub-modul terpadu untuk mengelola seluruh aspek operasional bisnis CV Life Solution Technology.

### 9.1 Daftar 15 Sub-Modul Admin

```mermaid
graph LR
    ADMIN_ROOT[Portal Eksekutif Admin<br>/admin]
    ADMIN_ROOT --> BISNIS[Manajemen Bisnis & CRM]
    ADMIN_ROOT --> KONTEN[Katalog & CMS Publik]
    ADMIN_ROOT --> OPERASIONAL[Operasional & AI]
    ADMIN_ROOT --> KEAMANAN[Keamanan & Konfigurasi]

    BISNIS --> D1[Dashboard KPI /admin/dashboard]
    BISNIS --> D2[CRM Leads Kanban /admin/leads]
    BISNIS --> D3[Penawaran Quotation /admin/quotations]
    BISNIS --> D4[Penjualan & Omzet /admin/sales]
    BISNIS --> D5[Proyek Pengerjaan /admin/projects]

    KONTEN --> C1[Katalog Produk /admin/products]
    KONTEN --> C2[CMS Portofolio /admin/portfolio]
    KONTEN --> C3[CMS Konten & FAQ /admin/cms]

    OPERASIONAL --> O1[Monitoring CS Live /admin/cs-monitoring]
    OPERASIONAL --> O2[Analitik AI /admin/ai-analytics]
    OPERASIONAL --> O3[Analitik Website /admin/website-analytics]

    KEAMANAN --> S1[Manajemen Pengguna /admin/users]
    KEAMANAN --> S2[Audit Log Sistem /admin/audit-log]
    KEAMANAN --> S3[Pengaturan & SMTP /admin/settings]
    KEAMANAN --> S4[Profil Pengguna /admin/profile]
```

### 9.2 Penjelasan Rinci Sub-Modul Unggulan

#### 1. Executive Dashboard (`/admin/dashboard`)
- **Kartu Metrik KPI**: Total Pendapatan Bulanan, Jumlah Deal Closed, Prospek Aktif, Proyek Berjalan, dan AI Resolution Rate (persentase obrolan yang tuntas diselesaikan oleh AI tanpa eskalasi manusia).
- **Grafik Tren Pendapatan 12 Bulan**: Visualisasi tren omzet berbasis Recharts.
- **Funnel Konversi Prospek**: Visualisasi konversi dari prospek baru hingga mencapai transaksi berhasil (*WON*).

#### 2. Mini CRM Kanban Pipeline (`/admin/leads`)
Memfasilitasi tim sales dalam mengelola siklus penawaran menggunakan Kanban 7 tahap:
$$\text{NEW} \longrightarrow \text{CONTACTED} \longrightarrow \text{QUALIFIED} \longrightarrow \text{QUOTATION} \longrightarrow \text{NEGOTIATION} \longrightarrow \text{WON} \longrightarrow \text{LOST}$$
- Setiap kartu prospek menampilkan nama instansi, nilai potensi transaksi (Rp), PIC sales penanggung jawab, dan tanggal batas follow-up.
- Mendukung pembaruan status, penambahan catatan aktivitas pertemuan, telepon, atau survei lokasi.

#### 3. Manajemen Proyek & Publikasi Portofolio (`/admin/projects`)
- Melacak pengerjaan implementasi nyata di lapangan: `PLANNING` ➔ `PROCUREMENT` ➔ `INSTALLATION` ➔ `TESTING` ➔ `COMPLETED`.
- **Fitur Publikasi Otomatis (One-Click Publish to Portfolio)**:
  Saat proyek berstatus `COMPLETED`, admin dapat menekan tombol **Publikasikan ke Portofolio**. Sistem otomatis membuat draf studi kasus di `/portfolio` lengkap dengan nama klien, lokasi, dan sektor industri.

#### 4. Manajemen Produk & Sakelar Harga Proyek (`/admin/products`)
- Pengelolaan master katalog hardware dan software.
- **Sakelar Tampilkan Harga (`showPrice`)**:
  Jika diaktifkan, harga eceran tampil di katalog publik. Jika dinonaktifkan, tombol harga diubah menjadi "Hubungi Tim Sales untuk Penawaran Harga Proyek".

#### 5. Pemantauan CS Live Read-Only (`/admin/cs-monitoring`)
- Memungkinkan pimpinan (Super Admin) memantau obrolan CS yang sedang berlangsung secara real-time untuk audit kualitas layanan (Quality Assurance).
- **Pencatatan Audit**: Setiap kali admin membuka sesi pantauan, sistem mencatat riwayat ke dalam `AuditLog` untuk mencegah penyalahgunaan privasi.

#### 6. Pengaturan Perusahaan & SMTP Email (`/admin/settings`)
- Mengonfigurasi nama instansi, alamat Temanggung, nomor WhatsApp layanan, dan akun media sosial.
- **Konfigurasi SMTP Email Terpadu**:
  Menyimpan konfigurasi server surat Hostinger (`smtpHost: smtp.hostinger.com`, `smtpPort: 465`, `smtpUser`, `smtpPass`).
  Seluruh formulir kontak di website publik akan otomatis didisposisikan ke alamat email yang dikonfigurasi di sini serta ke cadangan permanen `lifesolutiont@gmail.com`.

---

## 10. SPESIFIKASI LENGKAP API ENDPOINTS (REST API REFERENCE)

Seluruh request yang memerlukan payload dikirimkan dalam format JSON (`Content-Type: application/json`) dan divalidasi ketat menggunakan skema Zod.

### 10.1 Format Respons Standar
**Respons Berhasil (`200 OK` / `201 Created`):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operasi berhasil diselesaikan."
}
```

**Respons Validasi Gagal (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Validation Error",
  "issues": [
    {
      "path": "phone",
      "message": "Nomor telepon minimal 6 karakter"
    }
  ]
}
```

**Respons Akses Ditolak (`401 Unauthorized` / `403 Forbidden`):**
```json
{
  "success": false,
  "error": "Otentikasi diperlukan / Anda tidak memiliki izin untuk tindakan ini."
}
```

### 10.2 Katalog Lengkap Endpoint Backend

#### A. Autentikasi (`/api/auth/*`)
| Endpoint | Metode | Izin | Deskripsi |
|---|:---:|:---:|---|
| `/api/auth/login` | `POST` | Publik | Autentikasi email & password, mengembalikan HttpOnly JWT cookie. |
| `/api/auth/logout` | `POST` | Terotentikasi | Menghapus HttpOnly JWT cookie sesi. |
| `/api/auth/profile` | `GET` | Terotentikasi | Mengambil profil pengguna yang sedang login. |
| `/api/auth/profile` | `PUT` | Terotentikasi | Memperbarui nama, foto profil, dan kata sandi pengguna. |

#### B. Gerbang AI (`/api/ai/*`)
| Endpoint | Metode | Izin | Deskripsi |
|---|:---:|:---:|---|
| `/api/ai/chat` | `POST` | Publik | Mengirim pertanyaan ke AI Consultant, mengembalikan jawaban berbasis RAG. |
| `/api/ai/handoff` | `POST` | Publik | Memicu serah terima percakapan ke antrean staf Customer Service manusia. |

#### C. Portal Customer Service (`/api/cs/*`)
| Endpoint | Metode | Izin | Deskripsi |
|---|:---:|:---:|---|
| `/api/cs/conversations` | `GET` | CS / Admin | Mengambil daftar antrean pesan (`ALL`, `WAITING`, `ACTIVE`, `CLOSED`). |
| `/api/cs/messages` | `GET` | CS / Admin | Mengambil riwayat obrolan lengkap berdasarkan `conversationId`. |
| `/api/cs/messages` | `POST` | CS / Admin | Mengirim balasan CS ke pengunjung atau membuat Catatan Internal (`isInternalNote: true`). |

#### D. Prospek & Formulir Kontak (`/api/leads` & `/api/admin/leads`)
| Endpoint | Metode | Izin | Deskripsi |
|---|:---:|:---:|---|
| `/api/leads` | `POST` | Publik | Menyimpan formulir kontak website & mengirim notifikasi email SMTP ke admin. |
| `/api/admin/leads` | `GET` | Sales / Admin | Mengambil seluruh kartu prospek untuk Kanban Pipeline CRM. |
| `/api/admin/leads` | `POST` | Sales / Admin | Menambahkan prospek baru secara manual. |
| `/api/admin/leads` | `PUT` | Sales / Admin | Memperbarui tahap kanban (`stage`), nilai deal, atau tanggal follow-up. |
| `/api/admin/leads` | `DELETE`| Sales / Admin | Soft-delete prospek lead (`deletedAt = now()`). |

#### E. Manajemen Katalog & CMS Admin (`/api/admin/*`)
| Endpoint | Metode | Izin | Deskripsi |
|---|:---:|:---:|---|
| `/api/admin/products` | `GET`, `POST`, `PUT`, `DELETE` | Content / Admin | CRUD katalog produk hardware/software & sakelar `showPrice`. |
| `/api/admin/categories` | `GET`, `POST`, `PUT`, `DELETE` | Content / Admin | CRUD kategori produk. |
| `/api/admin/projects` | `GET`, `POST`, `PUT`, `DELETE` | Sales / Admin | CRUD pengerjaan proyek implementasi klien. |
| `/api/admin/portfolio` | `GET`, `POST`, `PUT`, `DELETE` | Content / Admin | CRUD studi kasus portofolio publik. |
| `/api/admin/quotations` | `GET`, `POST`, `PUT`, `DELETE` | Sales / Admin | CRUD dokumen surat penawaran harga resmi. |
| `/api/admin/sales` | `GET`, `POST` | Sales / Admin | Rekam jejak transaksi penjualan dan pembayaran. |
| `/api/admin/faq` | `GET`, `POST`, `PUT`, `DELETE` | Content / Admin | CRUD tanya-jawab FAQ dan sakelar `syncToAI`. |
| `/api/admin/knowledge-base` | `GET`, `POST`, `PUT`, `DELETE` | Admin | CRUD dokumen referensi RAG untuk AI Consultant. |
| `/api/admin/solutions` | `GET`, `POST`, `PUT` | Content / Admin | Pengaturan deskripsi 8 layanan utama LST. |
| `/api/admin/partners` | `GET`, `POST`, `DELETE` | Content / Admin | Pengelolaan logo mitra teknologi dan klien. |
| `/api/admin/settings` | `GET`, `PUT` | Admin | Pengaturan data perusahaan & konfigurasi SMTP email. |
| `/api/admin/upload` | `POST` | Content / Admin | Mengunggah gambar produk, galeri portofolio, atau banner. |
| `/api/admin/website-analytics` | `GET` | Admin | Mengambil metrik event pengunjung website. |
| `/api/admin/users` | `GET`, `POST`, `PUT`, `DELETE` | Super Admin | CRUD akun staf internal, reset password, dan penetapan role. |
| `/api/admin/audit-log` | `GET` | Super Admin | Mengambil rekaman log keamanan sistem. |

---

## 11. PANDUAN INSTALASI, KONFIGURASI & DEPLOYMENT

### 11.1 Persyaratan Sistem (Prerequisites)
- **Node.js**: Versi `18.18.0` atau `20.x` LTS (Sangat disarankan Node.js 20).
- **Package Manager**: `npm` versi 9 ke atas.
- **Basis Data**: PostgreSQL 14+ (direkomendasikan Supabase) atau SQLite / MySQL.

### 11.2 Langkah Instalasi Lokal (Quick Start Local)

```bash
# 1. Klon repositori atau masuk ke direktori proyek
cd c:\Users\Microsoft\OneDrive\LST-repo

# 2. Salin template variabel lingkungan
cp .env.example .env

# 3. Buka file .env dan sesuaikan kredensial basis data serta API key AI
# (Lihat rincian variabel lingkungan pada sub-bab 11.3)

# 4. Pasang seluruh dependensi proyek
npm install

# 5. Sinkronisasi skema basis data Prisma
npx prisma db push

# 6. Jalankan seeding untuk membuat akun admin default & katalog contoh
npx prisma db seed

# 7. Jalankan server pengembangan
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

### 11.3 Konfigurasi Variabel Lingkungan (`.env`)

```ini
# ==============================================================
# KONFIGURASI LINGKUNGAN RESMI CV LIFE SOLUTION TECHNOLOGY
# ==============================================================

# Mode Aplikasi
NODE_ENV="production"
PORT=3000

# URL Basis Data Relasional (Contoh: Supabase PostgreSQL Pooling)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"

# Kunci Rahasia Sesi JWT (Gunakan minimal 64 karakter acak kuat)
JWT_SECRET="isi-dengan-kunci-enkripsi-jwt-sangat-rahasia-dan-panjang-2026"

# Kunci API Provider AI (Hanya dipanggil server-side)
AI_PRIMARY_PROVIDER="claude"          # Pilihan: "claude" | "gemini" | "openai"
ANTHROPIC_API_KEY="sk-ant-api-key-anda"

# Opsi Provider Alternatif
# OPENAI_API_KEY="sk-proj-api-key-anda"
# GEMINI_API_KEY="AIzaSy-api-key-anda"

# URL Publik Aplikasi
NEXT_PUBLIC_APP_URL="https://lifesolution.co.id"

# Konfigurasi Pengiriman Email Notifikasi (Hostinger SMTP)
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT=465
SMTP_USER="support@lifesolution.co.id"
SMTP_PASS="PasswordEmailHostingerAnda"
SMTP_FROM='"LST Website Official" <support@lifesolution.co.id>'
```

### 11.4 Akun Bawaan Hasil Seeding (`prisma/seed.ts`)

| Peran Akun | Alamat Email | Kata Sandi Default | Hak Akses Utama |
|---|---|---|---|
| **Super Admin** | `admin@lst.co.id` | `AdminLST2026!` | Seluruh 15 modul admin, audit log & user |
| **Sales Executive** | `sales1@lst.co.id` | `SalesLST2026!` | CRM Leads, Quotations, Sales, & Proyek |
| **CS Operator** | `cs1@lst.co.id` | `CSLST2026!` | CS Workspace Inbox 3-Panel (`/cs/inbox`) |

> [!WARNING]
> Segera ubah kata sandi akun default di atas pada menu `/admin/profile` sebelum mempublikasikan sistem ke jaringan publik produksi.

### 11.5 Panduan Deployment ke Hostinger (Node.js Web App)
Hostinger menyediakan fitur **Node.js Web Application Manager** pada hPanel:
1. **Persiapan di Git Repository**:
   Pastikan berkas `server.js` ada di root repositori untuk menjalankan Next.js standalone runner.
2. **Setup Aplikasi di hPanel**:
   - Buka hPanel ➔ **Websites** ➔ **Node.js**.
   - Klik **Create Application**.
   - Node.js Version: Pilih **Node.js 20.x**.
   - Application Mode: Pilih **Production**.
   - Application Root: `public_html` (atau subfolder domain).
   - Application Startup File: `server.js`.
3. **Konfigurasi Environment Variables**:
   - Masukkan seluruh variabel dari `.env` ke tabel *Environment Variables* di hPanel.
4. **Build & Jalankan Aplikasi**:
   - Jalankan terminal SSH atau fitur Console hPanel:
     ```bash
     npm install --production=false
     npx prisma generate
     npx prisma db push
     npm run build
     ```
   - Restart Node.js Application melalui tombol **Restart** di hPanel.

---

## 12. SOP OPERASIONAL, TROUBLESHOOTING & FAQ

### 12.1 Prosedur Operasional Standar (SOP) Harian Tim

#### SOP 1: Penanganan Percakapan Live Chat (Customer Service)
1. CS masuk ke `/cs/inbox` pukul 08.00 WIB setiap hari kerja.
2. Pastikan indikator status di pojok kanan atas berstatus **Online**.
3. Tangani antrean dari tab **Waiting** maksimal 2 menit setelah eskalasi.
4. Gunakan gaya bahasa sopan dan santun khas CV Life Solution Technology.
5. Jika ada komitmen tindak lanjut, selalu gunakan tombol **Mark as Lead** untuk memasukkan ke tim Sales.

#### SOP 2: Pengelolaan Prospek (Tim Sales)
1. Setiap pagi buka `/admin/leads` untuk meninjau prospek baru dari formulir kontak atau eskalasi CS.
2. Hubungi prospek dalam waktu 1x24 jam melalui WhatsApp atau telepon.
3. Geser tahap kanban dari `NEW` ke `CONTACTED` setelah komunikasi pertama terjadi.
4. Catat setiap kemajuan pada menu *Lead Activities* dan buatkan draf penawaran resmi di `/admin/quotations`.

#### SOP 3: Pembaruan Pengetahuan AI (Admin / Content Editor)
1. Setiap kali LST meluncurkan produk hardware baru atau program paket promo, admin membuka `/admin/products`.
2. Jika ada kebijakan garansi baru, tambahkan di `/admin/cms` (menu FAQ) dan pastikan tombol **Sync to AI** aktif.
3. RAG AI Gateway akan langsung mempelajari informasi baru tanpa perlu melatih ulang (*retraining*) model LLM.

---

### 12.2 Pemecahan Masalah Umum (Troubleshooting Guide)

#### Masalah 1: Formulir Kontak Tidak Mengirimkan Email ke Admin
- **Gejala**: Pengunjung berhasil mengirim pesan kontak, namun email notifikasi tidak masuk ke inbox `lifesolutiont@gmail.com`.
- **Penyebab**: Kredensial SMTP Hostinger belum lengkap atau password email belum diisi pada menu Pengaturan Admin.
- **Solusi**:
  1. Masuk ke `/admin/settings`.
  2. Periksa bagian **Pengaturan SMTP & Email Notifikasi**.
  3. Pastikan `smtpHost` bernilai `smtp.hostinger.com`, port bernilai `465`, dan masukkan password email resmi yang benar.
  4. Sistem LST dirancang tangguh (*fault-tolerant*): data kontak pengunjung **tetap tersimpan aman** di tabel `Lead` dan `Customer` basis data sekalipun server SMTP eksternal sedang mengalami kendala.

#### Masalah 2: Respon Widget AI Melambat atau Gagal Menjawab
- **Gejala**: Widget AI menampilkan pesan "Maaf, asisten AI sedang mengalami gangguan sementara".
- **Penyebab**: Kuota API Key (Anthropic / OpenAI / Gemini) habis atau batas kecepatan (*rate limit*) provider tercapai.
- **Solusi**:
  1. Periksa dasbor billing provider AI Anda.
  2. Anda dapat beralih provider seketika dengan mengubah `AI_PRIMARY_PROVIDER` di file `.env` (misal: ganti dari `claude` ke `gemini` atau sebaliknya) tanpa mengubah baris kode apapun.

#### Masalah 3: Sesi Login Kerap Kembali ke Halaman Login (Redirect Loop)
- **Gejala**: Pengguna berhasil login, namun saat membuka menu admin langsung terpental kembali ke `/login`.
- **Penyebab**: Kunci `JWT_SECRET` pada `.env` berubah saat server berjalan, atau waktu jam sistem server tidak tersinkronisasi (NTP desync).
- **Solusi**:
  1. Pastikan `JWT_SECRET` konsisten di seluruh instance.
  2. Bersihkan cookie peramban untuk domain terkait (`lst_session_token`).
  3. Periksa kecocokan zona waktu server (WIB / UTC+7).

#### Masalah 4: Skema Database Berubah Setelah Update Kode
- **Solusi**:
  Jalankan perintah berikut di lingkungan produksi:
  ```bash
  npx prisma generate
  npx prisma db push
  ```

---

## PENUTUP & KEPEMILIKAN HAK CIPTA

Dokumentasi teknis ini disusun secara komprehensif sebagai acuan baku bagi pengembang perangkat lunak (*software engineers*), administrator sistem (*devops*), tim pemasaran & penjualan (*sales*), serta staf layanan pelanggan (*customer service*) pada **CV Life Solution Technology**.

*Hak Cipta © 2026 CV Life Solution Technology. Seluruh hak cipta dilindungi undang-undang.*  
*Kasian, Mudal, Temanggung, Jawa Tengah.*
