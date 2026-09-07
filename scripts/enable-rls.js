const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Enabling Row Level Security (RLS) on all public tables...');
  await prisma.$executeRawUnsafe(`
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations')
        LOOP
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
        END LOOP;
    END $$;
  `);
  console.log('✅ RLS successfully enabled on all tables!');
}

main()
  .catch(err => {
    console.error('Error enabling RLS:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
