# AI SECURITY ARCHITECTURE & GUARDRAILS DOCUMENTATION

## CV LIFE SOLUTION TECHNOLOGY

### 1. Secure AI Gateway Flow
Sistem mengadopsi alur arsitektur AI yang terisolasi:
```
[ Customer Prompt ]
         ↓
[ Prompt Injection Sanitizer (sanitizePromptBoundary) ]
         ↓
[ LST Backend & Rate Limiter (Max 20 req/min) ]
         ↓
[ Approved Tool Registry (executeAITool) ]
         ↓
[ Zod Parameter Validation ]
         ↓
[ Data Minimization Layer ]
         ↓
[ LLM Provider (OpenAI / Gemini Server-Only Keys) ]
```

---

### 2. Approved Tool Allowlist vs Prohibited Tool Denylist
- **Approved Tools**: `searchProducts`, `searchServices`, `searchFAQ`, `searchPortfolio`, `createLead`, `requestCustomerService`.
- **Prohibited Denylist**: `executeSQL`, `runCommand`, `readSecrets`, `readEnvironment`, `readAllCustomers`, `readAllSales`, `changeUserRole`, `deleteUser`, `executeCode`.

---

### 3. Business Guardrails Enforcement
- AI **dilarang keras** mengarang harga pasti, nilai diskon khusus, garansi kustom, atau janji tanggal penyelesaian proyek.
- Jika data tidak tersedia di Knowledge Base yang disetujui, AI wajib mengarahkan pengguna ke tim Sales / Customer Service manusia.
