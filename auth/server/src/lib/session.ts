import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { env } from '../env.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const COOKIE_NAME = 'wgn_auth';

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');
const generateToken = () => crypto.randomBytes(32).toString('hex');
const sessionExpiry = () => new Date(Date.now() + env.sessionTtlDays * 24 * 60 * 60 * 1000);

export const createSession = async (userId: string, ip?: string, userAgent?: string) => {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = sessionExpiry();

  await prisma.session.create({
    data: { userId, tokenHash, expiresAt, ip, userAgent }
  });

  return { token, expiresAt };
};

export const getSession = async (token: string | undefined) => {
  if (!token) return null;
  const tokenHash = hashToken(token);

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: { appAccess: true }
      }
    }
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { tokenHash } }).catch(() => undefined);
    return null;
  }

  await prisma.session.update({ where: { tokenHash }, data: { lastSeenAt: new Date() } });
  return session;
};

export const deleteSession = async (token: string | undefined) => {
  if (!token) return;
  const tokenHash = hashToken(token);
  await prisma.session.delete({ where: { tokenHash } }).catch(() => undefined);
};

export const setSessionCookie = (reply: FastifyReply, token: string, expiresAt: Date) => {
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    domain: env.nodeEnv === 'production' ? env.cookieDomain : undefined,
    path: '/',
    expires: expiresAt
  });
};

export const clearSessionCookie = (reply: FastifyReply) => {
  reply.clearCookie(COOKIE_NAME, {
    path: '/',
    domain: env.nodeEnv === 'production' ? env.cookieDomain : undefined
  });
};

export const requireSession = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.cookies[COOKIE_NAME];
  const session = await getSession(token);
  if (!session) {
    reply.code(401).send({ error: 'Unauthorized' });
    return null;
  }
  return session;
};
