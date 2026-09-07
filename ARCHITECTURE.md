# Technical System Architecture
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini mendeskripsikan arsitektur sistem full-stack production-ready untuk **LST Digital Business Platform**.

---

## 1. High-Level Architecture Overview

Platform ini dibangun menggunakan pola **Modular Monolith** berbasis **Next.js 14+ (App Router), TypeScript Strict Mode, Tailwind CSS, Prisma ORM, MySQL/SQLite, Zod Validation, AI Provider Adapters, dan Realtime Polling Engine**.

```
                        +---------------------------------------+
                        |      Public Web & Client Browsers     |
                        +---------------------------------------+
                           /                |                \
                          /                 |                 \
           +--------------------+  +------------------+  +-------------------+
           | Public B2B Website |  | CS Workspace App |  | Admin Executive   |
           | SEO & Marketing    |  | Live Chat 3-Panel|  | Dashboard & CRM   |
           +--------------------+  +------------------+  +-------------------+
                          \                 |                 /
                           +----------------+----------------+
                                            |
                                 +--------------------+
                                 |  Next.js App Server|
                                 | Route Handlers & Zod|
                                 +--------------------+
                                   /        |        \
                                  /         |         \
             +-----------------------+  +-------+  +--------------------+
             | AI Provider Gateway   |  | Prisma|  | Realtime Polling   |
             | (Gemini & OpenAI)     |  | ORM   |  | Abstraction Engine |
             +-----------------------+  +-------+  +--------------------+
                                            |
                                     +--------------+
                                     | MySQL Database|
                                     +--------------+
```

---

## 2. Component Design & Responsibilities

### 2.1 Public Corporate Website (`app/(public)/`)
- **Fungsi**: Memosisikan LST sebagai *Technology Solution & Digital Transformation Partner*.
- **Komponen Utama**:
  - `Navbar.tsx`: Sticky navigation dengan brand tokens & quick CTA.
  - `Footer.tsx`: Footer lengkap berisi info perusahaan, alamat Temanggung, legal KBLI tags, & navigasi.
  - `AIConsultantWidget.tsx`: Floating AI Virtual Consultant widget dengan quick intent pills, LLM response stream, & triage handoff button.

### 2.2 Customer Service Workspace (`app/cs/`)
- **Fungsi**: Portal penanganan pesan live chat untuk tim Customer Service.
- **Komponen Utama**:
  - `CSQueueSidebar.tsx`: Antrean pesan (`WAITING_FOR_CS`, `ASSIGNED`, `HUMAN_HANDLING`, `FOLLOW_UP`, `CLOSED`).
  - `ChatTimeline.tsx`: Timeline percakapan lengkap (AI Prompt history + CS messages + **Internal Notes** mode).
  - `CustomerContextPanel.tsx`: Sidebar konteks klien & quick actions ("Mark as Lead", "Set Follow-up", "Close", "Return to AI").

### 2.3 Executive Admin Dashboard (`app/admin/`)
- **Fungsi**: Pengawasan bisnis, omzet, CRM leads, proyek, monitoring CS, AI analytics, & CMS.
- **Komponen Utama**:
  - `AdminSidebar.tsx`: Navigasi modular ke seluruh 12 modul admin.
  - `AdminHeader.tsx`: Context bar status environment & user session.
  - `dashboard/page.tsx`: Executive Overview KPI Cards, Revenue trend chart 12-month, & Lead Conversion Funnel.

---

## 3. Hostinger Business Compatibility & Constraints

1. **Memory & CPU**: Dibatasi 2 CPU Cores / 3 GB RAM. Monolith modular Next.js menjaga jejak memori tetap di bawah 400 MB.
2. **Realtime Strategy**: Hostinger Business tidak mengizinkan incoming custom WebSocket servers. Sistem menggunakan **Realtime Polling Layer** dengan interval 3s untuk sinkronisasi pesan CS.
3. **Database Layer**: Prisma ORM mengelola query terarah dengan index penuh pada kolom status, date, dan relational foreign keys.
