# Role-Based Access Control (RBAC) Specification
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini mendeskripsikan struktur peran dan izin akses pada platform LST.

---

## 1. Role Definitions & Access Scope

1. **SUPER_ADMIN**: Akses penuh ke seluruh modul sistem, konfigurasi keamanan, user role management, dan MFA settings.
2. **ADMIN**: Akses ke Executive Dashboard, Sales Analytics, CRM Leads, Projects, CS Monitoring (read-only), AI Analytics, Web Analytics, CMS, FAQ, KB, dan Audit Logs.
3. **SALES**: Akses khusus modul komersial (Executive Dashboard, Sales Analytics, CRM Leads Pipeline, Quotations, dan Projects).
4. **CUSTOMER_SERVICE**: Akses khusus CS Workspace Inbox (`/cs/inbox`), Live Chat, Catatan Internal, Customer Context Panel, dan pembuatan Prospect Lead baru.
5. **CONTENT_EDITOR**: Akses khusus CMS pengelolaan konten publik (Produk B2B, Solusi, Portofolio, Artikel Insight, dan FAQ).

---

## 2. Server-Side Enforcement

Setiap permintaan API divalidasi via `hasPermission(user, permission)` di backend (`lib/auth/rbac.ts`). Menyembunyikan elemen UI di frontend hanyalah peningkatan UX, bukan batas keamanan utama.
