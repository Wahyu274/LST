import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Ensure SQLite dev.db path is resolved correctly for both local development and production (Hostinger)
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dev.db')) {
  const prismaDir = path.resolve(process.cwd(), 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }
  const dbPath = path.resolve(prismaDir, 'dev.db').replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

// Supabase Transaction Pooler (PgBouncer, port 6543) does not support prepared statements.
// Without `pgbouncer=true` Prisma fails with: prepared statement "sX" already exists (42P05).
if (/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL) && /:6543\//.test(process.env.DATABASE_URL)) {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    if (dbUrl.searchParams.get('pgbouncer') !== 'true') {
      dbUrl.searchParams.set('pgbouncer', 'true');
      process.env.DATABASE_URL = dbUrl.toString();
    }
  } catch {
    console.error('DATABASE_URL tidak valid. Pastikan password sudah di-URL-encode.');
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


