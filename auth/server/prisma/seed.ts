import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'thomas@wegener.no';

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      displayName: 'Thomas Wegener',
      role: 'ADMIN'
    }
  });

  console.log(`Seeded admin user: ${user.email} (${user.id})`);

  await prisma.appAccess.upsert({
    where: { userId_appId: { userId: user.id, appId: 'portal' } },
    update: { role: 'admin' },
    create: {
      userId: user.id,
      appId: 'portal',
      role: 'admin'
    }
  });

  console.log('Seeded portal admin access');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
