import 'dotenv/config';
import { prisma } from '../src/db.js';
import { hashPassword } from '../src/lib/password.js';
import { assertEmail, assertPassword } from '../src/lib/validation.js';

const adminEmail = process.env.ADMIN_EMAIL ?? '';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin';

if (!adminEmail) {
  throw new Error('ADMIN_EMAIL is required');
}

assertEmail(adminEmail);
assertPassword(adminPassword, true);

const main = async () => {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN' }
  });

  await prisma.role.upsert({
    where: { name: 'PARTNER' },
    update: {},
    create: { name: 'PARTNER' }
  });

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      mustChangePassword: true,
      roles: { create: [{ roleId: adminRole.id }] }
    }
  });

  console.log('Admin user created:', user.email);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
