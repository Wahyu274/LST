# SECURITY POLICY & ARCHITECTURE OVERVIEW

## CV LIFE SOLUTION TECHNOLOGY — LST DIGITAL BUSINESS PLATFORM

### 1. Keamanan Aplikasi & Principles
Aplikasi LST Digital Business Platform dirancang dan dibangun dengan mengadopsi prinsip keamanan:
- **Secure by Design & Secure by Default**
- **Deny by Default** (Setiap akses/permission yang tidak terdaftar otomatis ditolak)
- **Principle of Least Privilege** (Pengguna hanya diberikan hak akses yang dibutuhkan untuk perannya)
- **Defense in Depth** (Perlindungan berlapis pada UI, Session, API Wrapper, Data Layer, & Database)
- **Data Minimization** (Data sensitif dibuang dari JSON response client)

---

### 2. Baseline Standar Keamanan
Implementasi keamanan mengacu pada baseline standar:
- **OWASP Top 10:2025** (A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, dll.)
- **OWASP ASVS 5.0** (Application Security Verification Standard)
- **Next.js Production Security Recommendations**

---

### 3. Arsitektur Pertahanan Berlapis
```
[ Client Browser / User ]
         ↓
[ HTTP Security Headers & Rate Limiter (lib/security/rateLimiter.ts) ]
         ↓
[ Session Token Validation (HTTPOnly JWT / lib/auth/session.ts) ]
         ↓
[ Server-Side Deny-By-Default RBAC (lib/auth/rbac.ts) ]
         ↓
[ Object-Level Access Control / IDOR Protection (canAccessObject) ]
         ↓
[ Server-Side Zod Input Validation (lib/validations/validate.ts) ]
         ↓
[ Explicit Field Allowlist & Safe Prisma ORM Layer ]
         ↓
[ Append-Only Audit Logging (lib/security/audit.ts) ]
```

---

### 4. Pelaporan Kerentanan Keamanan (Security Vulnerability Reporting)
Jika Anda menemukan potensi masalah atau celah keamanan pada platform ini, silakan hubungi Tim Keamanan IT LST:
- **Email**: `security@lst.co.id`
- **Tenggat Respon**: Maksimal 24 jam kerja.
