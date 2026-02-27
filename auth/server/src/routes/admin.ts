import type { FastifyPluginAsync } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';
import { getSession, deleteSession, COOKIE_NAME } from '../lib/session.js';

const requireAdmin = async (request: any, reply: any) => {
  const token = request.cookies[COOKIE_NAME];
  const session = await getSession(token);
  if (!session || session.user.role !== 'ADMIN') {
    reply.code(403).send({ error: 'Forbidden' });
    return null;
  }
  return session;
};

const adminRoutes: FastifyPluginAsync = async (app) => {
  // List all users
  app.get('/api/users', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        appAccess: true,
        identities: { select: { provider: true } },
        sessions: {
          where: { expiresAt: { gt: new Date() } },
          select: { id: true, lastSeenAt: true, ip: true }
        }
      }
    });

    return users.map(u => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      role: u.role,
      createdAt: u.createdAt,
      providers: u.identities.map(i => i.provider),
      appAccess: u.appAccess,
      activeSessions: u.sessions.length
    }));
  });

  // Grant or update app access
  app.post('/api/users/:id/access', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const body = request.body as { appId: string; role: string; metadata?: object };

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }

    const access = await prisma.appAccess.upsert({
      where: { userId_appId: { userId: id, appId: body.appId } },
      update: { role: body.role, metadata: body.metadata ?? Prisma.JsonNull },
      create: { userId: id, appId: body.appId, role: body.role, metadata: body.metadata ?? Prisma.JsonNull }
    });

    return access;
  });

  // Revoke app access
  app.delete('/api/users/:id/access/:appId', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const { id, appId } = request.params as { id: string; appId: string };

    await prisma.appAccess.delete({
      where: { userId_appId: { userId: id, appId } }
    }).catch(() => undefined);

    reply.code(204).send();
  });

  // Revoke all sessions for a user
  app.delete('/api/users/:id/sessions', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    await prisma.session.deleteMany({ where: { userId: id } });
    reply.code(204).send();
  });

  // Delete user
  app.delete('/api/users/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    if (id === session.userId) {
      reply.code(400);
      return { error: 'Cannot delete your own account' };
    }

    await prisma.user.delete({ where: { id } }).catch(() => undefined);
    reply.code(204).send();
  });

  // Update user role
  app.patch('/api/users/:id', async (request, reply) => {
    const session = await requireAdmin(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const body = request.body as { role?: string; displayName?: string };

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.role ? { role: body.role as any } : {}),
        ...(body.displayName !== undefined ? { displayName: body.displayName } : {})
      }
    });

    return { id: user.id, email: user.email, role: user.role, displayName: user.displayName };
  });
};

export default adminRoutes;
