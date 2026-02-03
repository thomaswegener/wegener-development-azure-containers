import type { FastifyPluginAsync } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import { hashPassword } from '../lib/password.js';
import { assertEmail, assertPassword, assertNonEmpty } from '../lib/validation.js';
import { requireAdmin, requireCsrfHeader } from '../lib/auth.js';

const ensureRole = async (name: 'ADMIN' | 'PARTNER') =>
  prisma.role.upsert({
    where: { name },
    update: {},
    create: { name }
  });

const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/users', async (request) => {
    requireAdmin(request);
    const users = await prisma.user.findMany({
      include: { roles: { include: { role: true } }, partnerLinks: true }
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      mustChangePassword: user.mustChangePassword,
      roles: user.roles.map((role) => role.role.name),
      partnerIds: user.partnerLinks.map((link) => link.partnerId)
    }));
  });

  app.post('/users', async (request, reply) => {
    requireAdmin(request);
    requireCsrfHeader(request);
    const body = request.body as {
      email?: string;
      password?: string;
      displayName?: string;
      role?: 'ADMIN' | 'PARTNER';
      partnerIds?: string[];
    };

    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    assertNonEmpty(email, 'Email');
    assertEmail(email);
    assertNonEmpty(password, 'Password');
    assertPassword(password, true);

    const roleName = body.role ?? 'PARTNER';
    const role = await ensureRole(roleName);
    const passwordHash = await hashPassword(password);

    let user;
    try {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          displayName: body.displayName?.trim() || null,
          roles: { create: [{ roleId: role.id }] },
          partnerLinks: body.partnerIds?.length
            ? { create: body.partnerIds.map((partnerId) => ({ partnerId })) }
            : undefined
        },
        include: { roles: { include: { role: true } }, partnerLinks: true }
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        reply.code(409);
        return { error: 'Email already exists' };
      }
      throw error;
    }

    reply.code(201);
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      mustChangePassword: user.mustChangePassword,
      roles: user.roles.map((roleEntry) => roleEntry.role.name),
      partnerIds: user.partnerLinks.map((link) => link.partnerId)
    };
  });

  app.patch('/users/:id', async (request) => {
    requireAdmin(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const body = request.body as {
      displayName?: string;
      role?: 'ADMIN' | 'PARTNER';
      partnerIds?: string[];
      mustChangePassword?: boolean;
    };

    const updates: Record<string, unknown> = {};
    if (body.displayName !== undefined) {
      updates.displayName = body.displayName?.trim() || null;
    }
    if (body.mustChangePassword !== undefined) {
      updates.mustChangePassword = body.mustChangePassword;
    }

    if (body.role) {
      const role = await ensureRole(body.role);
      await prisma.userRole.deleteMany({ where: { userId: id } });
      await prisma.userRole.create({ data: { userId: id, roleId: role.id } });
    }

    if (body.partnerIds) {
      await prisma.partnerUser.deleteMany({ where: { userId: id } });
      if (body.partnerIds.length) {
        await prisma.partnerUser.createMany({
          data: body.partnerIds.map((partnerId) => ({ userId: id, partnerId }))
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updates,
      include: { roles: { include: { role: true } }, partnerLinks: true }
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      mustChangePassword: user.mustChangePassword,
      roles: user.roles.map((roleEntry) => roleEntry.role.name),
      partnerIds: user.partnerLinks.map((link) => link.partnerId)
    };
  });
};

export default usersRoutes;
