const { execSync } = require('child_process');
const fs = require('fs');

// Ensure NODE_ENV is strictly standard lowercase 'production' to prevent Next.js 15 prerender errors
const env = { ...process.env, NODE_ENV: 'production' };

try {
  fs.rmSync('.next', { recursive: true, force: true });
} catch (e) {}

try {
  fs.rmSync('tsconfig.tsbuildinfo', { force: true });
} catch (e) {}

console.log('> Running prisma generate...');
execSync('npx prisma generate', { stdio: 'inherit', env });

console.log('> Running next build with clean production environment...');
execSync('npx next build', { stdio: 'inherit', env });
