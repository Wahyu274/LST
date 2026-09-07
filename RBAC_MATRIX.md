# ROLE BASED ACCESS CONTROL (RBAC) MATRIX

## CV LIFE SOLUTION TECHNOLOGY

Berikut adalah matriks otorisasi server-side terpusat yang diimplementasikan pada [`lib/auth/rbac.ts`](file:///d:/WAHYUDI/COPO%20LST/LST/lib/auth/rbac.ts):

| Modul & Resource | Permisi (Permission Key) | Super Admin | Admin Operations | Sales Executive | CS Agent | Content Editor |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Katalog Produk** | `product.read` | ✅ | ✅ | ✅ | ✅ | ✅ |
| | `product.create` | ✅ | ✅ | ❌ | ❌ | ✅ |
| | `product.update` | ✅ | ✅ | ❌ | ❌ | ✅ |
| | `product.archive` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **CRM Leads** | `lead.read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `lead.create` | ✅ | ✅ | ✅ | ✅ | ❌ |
| | `lead.update` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `lead.assign` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Surat Penawaran (RAB)** | `quotation.read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `quotation.create` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `quotation.update` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Transaksi Sales** | `sales.read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `sales.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Manajemen Proyek** | `project.read` | ✅ | ✅ | ✅ | ❌ | ❌ |
| | `project.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| **CS Live Chat** | `conversation.read` | ✅ | ✅ | ❌ | ✅ (Assigned) | ❌ |
| | `conversation.reply` | ✅ | ❌ (Read-Only) | ❌ | ✅ (Assigned) | ❌ |
| | `conversation.monitor` | ✅ | ✅ (Read-Only) | ❌ | ❌ | ❌ |
| **CMS Content** | `content.manage` | ✅ | ✅ | ❌ | ❌ | ✅ |
| | `faq.manage` | ✅ | ✅ | ❌ | ❌ | ✅ |
| | `kb.manage` | ✅ | ✅ | ❌ | ❌ | ✅ |
| **User & Hak Akses** | `user.manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **System Settings** | `settings.manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **AI Management** | `ai.manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Audit Log Trail** | `audit.read` | ✅ | ✅ | ❌ | ❌ | ❌ |

---

### Prinsip Deny-By-Default:
Setiap permintaan API yang tidak secara eksplisit terdaftar pada matriks role pengguna akan **otomatis ditolak (HTTP 403 Forbidden)** oleh fungsi `hasPermission()`.
