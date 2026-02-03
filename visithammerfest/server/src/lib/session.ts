import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { env } from '../env.js';

const SESSION_COOKIE = 'vhf_session';
const CSRF_HEADER = 'x-csrf-token';

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

const generateToken = () => crypto.randomBytes(32).toString('hex');

const sessionExpiry = () => new Date(Date.now() + env.sessionTtlDays * 24 * 60 * 60 * 1000);

export const sessionCookieName = SESSION_COOKIE;
export const csrfHeaderName = CSRF_HEADER;

export const createSession = async (userId: string, ip?: string, userAgent?: string) => {
  const token = generateToken();
  const csrfToken = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = sessionExpiry();

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      csrfToken,
      expiresAt,
      ip,
      userAgent
    }
  });

  return { token, csrfToken, expiresAt };
};

export const getSession = async (token: string | undefined) => {
  if (!token) return null;
  const tokenHash = hashToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: { include: { roles: { include: { role: true } }, partnerLinks: true } } }
  });

  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { tokenHash } });
    return null;
  }

  await prisma.session.update({
    where: { tokenHash },
    data: { lastSeenAt: new Date() }
  });

  return session;
};

export const deleteSession = async (token: string | undefined) => {
  if (!token) return;
  const tokenHash = hashToken(token);
  await prisma.session.delete({ where: { tokenHash } }).catch(() => undefined);
};

export const requireCsrf = (session: { csrfToken: string }, csrfHeader: string | undefined) => {
  if (!csrfHeader || csrfHeader !== session.csrfToken) {
    throw new Error('Invalid CSRF token');
  }
};
