import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAccess, requirePortalAdmin } from '../lib/auth.js';

const projectRoutes: FastifyPluginAsync = async (app) => {
  // List projects — admin sees all, customer sees own
  app.get('/api/projects', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    if (ctx.portalRole === 'admin') {
      return prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { id: true, companyName: true } } }
      });
    }

    if (!ctx.customerId) { reply.code(403); return { error: 'No customer record' }; }
    return prisma.project.findMany({
      where: { customerId: ctx.customerId },
      orderBy: { createdAt: 'desc' }
    });
  });

  // Get single project
  app.get('/api/projects/:id', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const project = await prisma.project.findUnique({
      where: { id },
      include: { customer: { select: { id: true, companyName: true } } }
    });
    if (!project) { reply.code(404); return { error: 'Not found' }; }

    if (ctx.portalRole !== 'admin' && project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    return project;
  });

  // Create project (admin)
  app.post('/api/projects', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const body = request.body as {
      customerId: string;
      name: string;
      description?: string;
      tier?: string;
      status?: string;
      websiteUrl?: string;
      githubRepo?: string;
    };

    if (!body.customerId || !body.name) {
      reply.code(400);
      return { error: 'customerId and name required' };
    }

    const project = await prisma.project.create({
      data: {
        customerId: body.customerId,
        name: body.name,
        description: body.description ?? null,
        tier: body.tier ?? null,
        status: (body.status as any) ?? 'DISCOVERY',
        websiteUrl: body.websiteUrl ?? null,
        githubRepo: body.githubRepo ?? null
      }
    });

    reply.code(201);
    return project;
  });

  // Update project (admin)
  app.patch('/api/projects/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as any;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.tier !== undefined ? { tier: body.tier } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.websiteUrl !== undefined ? { websiteUrl: body.websiteUrl } : {}),
        ...(body.githubRepo !== undefined ? { githubRepo: body.githubRepo } : {}),
        ...(body.launchedAt !== undefined ? { launchedAt: new Date(body.launchedAt) } : {})
      }
    });
    return project;
  });

  // Delete project (admin)
  app.delete('/api/projects/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    await prisma.project.delete({ where: { id } });
    reply.code(204).send();
  });
};

export default projectRoutes;
