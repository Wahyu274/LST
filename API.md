# API Specification & Route Handlers
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini mendeskripsikan seluruh API Route Handlers yang tersedia pada platform LST.

---

## 1. API Route Index

### 🤖 AI Gateway Routes
- `POST /api/ai/chat`: Mengirim pesan ke AI Virtual Consultant & menerima balasan LLM RAG context.
- `POST /api/ai/handoff`: Memicu eskalasi percakapan AI ke antrean CS manusia (`WAITING_FOR_CS`).

### 🎧 Customer Service Routes
- `GET /api/cs/conversations`: Mengambil antrean percakapan CS (Filter: `ALL`, `WAITING`, `ACTIVE`, `CLOSED`).
- `GET /api/cs/messages?conversationId=...`: Mengambil timeline pesan percakapan (termasuk Internal Notes).
- `POST /api/cs/messages`: Mengirim pesan CS baru atau Catatan Internal (`isInternalNote: true`).

### 📊 CRM & Leads Routes
- `POST /api/leads`: Membuat Prospek Lead baru dari form Kontak atau CS Workspace.
- `GET /api/leads`: Mengambil daftar Prospek Lead untuk Kanban Board Admin/Sales.

---

## 2. Standard Error Response Format

```json
{
  "error": "Validation Error",
  "issues": [
    {
      "path": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```
- `400 Bad Request`: Input tidak lolos skema Zod.
- `401 Unauthorized`: Token session tidak ditemukan atau expired.
- `403 Forbidden`: Pengguna tidak memiliki permission RBAC untuk modul tersebut.
- `500 Internal Server Error`: Server error (Stack trace tidak diekspos di lingkungan produksi).
