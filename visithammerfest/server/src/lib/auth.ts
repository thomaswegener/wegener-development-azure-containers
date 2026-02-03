import type { FastifyRequest } from 'fastify';
import { csrfHeaderName, requireCsrf } from './session.js';
import { canAccessPartner, isAdmin } from './rbac.js';

export const requireAuth = (request: FastifyRequest) => {
  if (!request.session) {
    const error = new Error('Unauthorized');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }
  return request.session;
};

export const requireAdmin = (request: FastifyRequest) => {
  const session = requireAuth(request);
  if (!isAdmin(session.user)) {
    const error = new Error('Forbidden');
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }
  return session;
};

export const requirePartnerAccess = (request: FastifyRequest, partnerId: string | null | undefined) => {
  const session = requireAuth(request);
  if (!canAccessPartner(session.user, partnerId)) {
    const error = new Error('Forbidden');
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }
  return session;
};

export const requireCsrfHeader = (request: FastifyRequest) => {
  const session = requireAuth(request);
  const header = request.headers[csrfHeaderName] as string | undefined;
  requireCsrf(session, header);
};
