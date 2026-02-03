import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { createSession, deleteSession, sessionCookieName } from '../lib/session.js';
import { assertEmail, assertPassword, assertNonEmpty } from '../lib/validation.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { env } from '../env.js';
import { requireAuth, requireCsrfHeader } from '../lib/auth.js';

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/auth/login', async (request, reply) => {
    const body = request.body as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? '';
    const password = body.password ?? '';

    assertNonEmpty(email, 'Email');
    assertEmail(email);
    assertNonEmpty(password, 'Password');

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } }, partnerLinks: true }
    });

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      reply.code(401);
      return { error: 'Invalid credentials' };
    }

    const session = await createSession(user.id, request.ip, request.headers['user-agent']);

    reply.setCookie(sessionCookieName, session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.nodeEnv === 'production',
      path: '/',
      expires: session.expiresAt
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        mustChangePassword: user.mustChangePassword,
        roles: user.roles.map((role) => role.role.name),
        partnerIds: user.partnerLinks.map((link) => link.partnerId)
      },
      csrfToken: session.csrfToken
    };
  });

  app.get('/auth/me', async (request, reply) => {
    if (!request.session) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    const user = request.session.user;
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        mustChangePassword: user.mustChangePassword,
        roles: user.roles.map((role) => role.role.name),
        partnerIds: user.partnerLinks.map((link) => link.partnerId)
      },
      csrfToken: request.session.csrfToken
    };
  });

  app.post('/auth/logout', async (request, reply) => {
    const token = request.cookies[sessionCookieName];
    await deleteSession(token);
    reply.clearCookie(sessionCookieName, { path: '/' });
    reply.code(204);
  });

  app.patch('/auth/password', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const body = request.body as { currentPassword?: string; newPassword?: string };
    const currentPassword = body.currentPassword ?? '';
    const newPassword = body.newPassword ?? '';

    assertNonEmpty(currentPassword, 'Current password');
    assertNonEmpty(newPassword, 'New password');
    assertPassword(newPassword);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || !(await verifyPassword(user.passwordHash, currentPassword))) {
      reply.code(401);
      return { error: 'Invalid credentials' };
    }

    const nextHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: nextHash, mustChangePassword: false }
    });

    reply.code(204);
  });
};

export default authRoutes;
