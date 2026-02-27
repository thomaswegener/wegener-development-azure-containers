import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../env.js';

const COOKIE_NAME = 'wgn_auth';

export interface SessionUser {
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  apps: Array<{ appId: string; role: string; metadata: any }>;
}

export interface PortalContext extends SessionUser {
  portalRole: string;
  customerId: string | null;
}

export const getAuthSession = async (request: FastifyRequest): Promise<SessionUser | null> => {
  const cookie = request.cookies[COOKIE_NAME];
  if (!cookie) return null;

  try {
    const res = await fetch(`${env.authServiceUrl}/api/session`, {
      headers: { Cookie: `${COOKIE_NAME}=${cookie}` }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const requireAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<SessionUser | null> => {
  const session = await getAuthSession(request);
  if (!session) {
    reply.code(401).send({ error: 'Unauthorized' });
    return null;
  }
  return session;
};

export const requirePortalAccess = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<PortalContext | null> => {
  const session = await getAuthSession(request);
  if (!session) {
    reply.code(401).send({ error: 'Unauthorized' });
    return null;
  }

  const portalAccess = session.apps.find(a => a.appId === 'portal');
  if (!portalAccess && session.role !== 'ADMIN') {
    reply.code(403).send({ error: 'No portal access' });
    return null;
  }

  // ADMIN users always have admin portal access
  if (session.role === 'ADMIN') {
    return { ...session, portalRole: 'admin', customerId: null };
  }

  return {
    ...session,
    portalRole: portalAccess!.role,
    customerId: portalAccess!.metadata?.customerId ?? null
  };
};

export const requirePortalAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<PortalContext | null> => {
  const ctx = await requirePortalAccess(request, reply);
  if (!ctx) return null;

  if (ctx.portalRole !== 'admin') {
    reply.code(403).send({ error: 'Admin access required' });
    return null;
  }
  return ctx;
};
