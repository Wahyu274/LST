const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('root@ADMIN', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'lifesolutiont@gmail.com' },
    update: {
      passwordHash: hash,
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'lifesolutiont@gmail.com',
      name: 'Super Admin LST',
      passwordHash: hash,
      role: 'SUPER_ADMIN',
      mfaEnabled: false,
      isOnline: true,
    },
  });

  console.log('Super Admin user successfully created/updated:', user.email);
}

main()
  .catch((e) => {
    console.error('Error updating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
