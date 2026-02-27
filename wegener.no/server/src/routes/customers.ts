import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAdmin } from '../lib/auth.js';
import { env } from '../env.js';

const resolveAuthUserId = async (email: string): Promise<string | null> => {
  try {
    const res = await fetch(`${env.authServiceUrl}/internal/users/by-email?email=${encodeURIComponent(email)}`);
    if (!res.ok) return null;
    const data = await res.json() as { id: string };
    return data.id;
  } catch {
    return null;
  }
};

const customerRoutes: FastifyPluginAsync = async (app) => {
  // List all customers (admin)
  app.get('/api/customers', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { projects: true } } }
    });
    return customers;
  });

  // Create customer (admin) — accepts email or authUserId
  app.post('/api/customers', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const body = request.body as { email?: string; authUserId?: string; companyName?: string };

    let authUserId = body.authUserId;

    if (!authUserId && body.email) {
      const resolved = await resolveAuthUserId(body.email);
      if (!resolved) {
        reply.code(404);
        return { error: `No user found with email ${body.email}. They must log in at least once first.` };
      }
      authUserId = resolved;
    }

    if (!authUserId) {
      reply.code(400);
      return { error: 'email or authUserId required' };
    }

    const customer = await prisma.customer.create({
      data: { authUserId, companyName: body.companyName ?? null }
    });

    reply.code(201);
    return customer;
  });

  // Get single customer (admin)
  app.get('/api/customers/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        projects: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!customer) { reply.code(404); return { error: 'Not found' }; }
    return customer;
  });

  // Update customer (admin)
  app.patch('/api/customers/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as { companyName?: string; authUserId?: string };

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(body.companyName !== undefined ? { companyName: body.companyName } : {}),
        ...(body.authUserId ? { authUserId: body.authUserId } : {})
      }
    });
    return customer;
  });

  // Delete customer (admin)
  app.delete('/api/customers/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    await prisma.customer.delete({ where: { id } });
    reply.code(204).send();
  });
};

export default customerRoutes;
