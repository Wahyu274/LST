# Environment Variables Specification
## LST Digital Business Platform — CV Life Solution Technology

Dokumen ini mendeskripsikan seluruh variabel lingkungan (`.env`) yang dibutuhkan oleh platform LST.

---

## 1. Environment Variable Reference

```env
# Node & Application Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://lifesolution.co.id

# Database Connection (Prisma ORM)
# MySQL Production (Hostinger) / SQLite Development
DATABASE_URL="mysql://u123456_lst:SecurePassword123!@localhost:3306/u123456_lst_db"

# Authentication & Session Security
JWT_SECRET="super-secret-jwt-key-change-in-production-min-32-chars"
SESSION_EXPIRES_IN="8h"

# AI Provider Configuration
AI_PRIMARY_PROVIDER="gemini" # Options: "gemini" | "openai"
GEMINI_API_KEY="AIzaSy..."
OPENAI_API_KEY="sk-proj-..."

# Company Default Info
NEXT_PUBLIC_COMPANY_NAME="CV Life Solution Technology"
NEXT_PUBLIC_WHATSAPP_NUMBER="6282135550007"
```

---

## 2. Safety Guidelines
- **JANGAN PERNAH** melakukan commit file `.env` ke versi kontrol (Git).
- Variabel rahasia seperti `JWT_SECRET`, `GEMINI_API_KEY`, dan `OPENAI_API_KEY` wajib dikonfigurasi melalui panel Hostinger Node.js Application Manager.
