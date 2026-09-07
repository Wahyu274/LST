const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const prismaDir = path.resolve(__dirname, '..', 'prisma');
if (!fs.existsSync(prismaDir)) {
  fs.mkdirSync(prismaDir, { recursive: true });
}

if (!process.env.DATABASE_URL) {
  const dbPath = path.resolve(prismaDir, 'dev.db').replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

try {
  console.log('Syncing database schema with Prisma db push...');
  execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
  
  console.log('Seeding initial data...');
  execSync('npx ts-node --compiler-options "{\\"module\\":\\"CommonJS\\"}" prisma/seed.ts', { stdio: 'inherit', env: process.env });
  
  console.log('Database initialization completed successfully!');
} catch (err) {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}
