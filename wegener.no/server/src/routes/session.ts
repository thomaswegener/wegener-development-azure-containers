import type { FastifyPluginAsync } from 'fastify';
import { requirePortalAccess } from '../lib/auth.js';
import { prisma } from '../db.js';

const sessionRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/session', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    let customerId = ctx.customerId;
    if (!customerId && ctx.portalRole !== 'admin') {
      reply.code(403);
      return { error: 'No customer record linked' };
    }

    if (customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: customerId } });
      return {
        ...ctx,
        customer: customer ? { id: customer.id, companyName: customer.companyName } : null
      };
    }

    return { ...ctx, customer: null };
  });

  app.post('/api/auth/logout', async (request, reply) => {
    // Forward logout to auth service
    const cookie = (request.cookies as any)['wgn_auth'];
    try {
      await fetch(`${process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010'}/auth/logout`, {
        method: 'POST',
        headers: cookie ? { Cookie: `wgn_auth=${cookie}` } : {}
      });
    } catch {
      // best-effort
    }
    reply.clearCookie('wgn_auth', {
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.wegener.no' : undefined
    });
    reply.code(204).send();
  });
};

export default sessionRoutes;
