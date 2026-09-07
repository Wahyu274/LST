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

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


