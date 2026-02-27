import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAccess, requirePortalAdmin } from '../lib/auth.js';

const planRoutes: FastifyPluginAsync = async (app) => {
  // Customers see published plans for their projects
  app.get('/api/plans', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const query = request.query as { projectId?: string };

    if (ctx.portalRole === 'admin') {
      return prisma.plan.findMany({
        where: query.projectId ? { projectId: query.projectId } : {},
        orderBy: [{ projectId: 'asc' }, { order: 'asc' }],
        include: { project: { select: { id: true, name: true } } }
      });
    }

    if (!ctx.customerId) { reply.code(403); return { error: 'No customer record' }; }
    const projects = await prisma.project.findMany({
      where: { customerId: ctx.customerId },
      select: { id: true }
    });
    const projectIds = projects.map(p => p.id);

    return prisma.plan.findMany({
      where: {
        projectId: { in: projectIds },
        published: true,
        ...(query.projectId && projectIds.includes(query.projectId) ? { projectId: query.projectId } : {})
      },
      orderBy: [{ projectId: 'asc' }, { order: 'asc' }],
      include: { project: { select: { id: true, name: true } } }
    });
  });

  app.get('/api/plans/:id', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: { project: { select: { id: true, name: true, customerId: true } } }
    });
    if (!plan) { reply.code(404); return { error: 'Not found' }; }

    if (ctx.portalRole !== 'admin') {
      if (plan.project.customerId !== ctx.customerId || !plan.published) {
        reply.code(403); return { error: 'Forbidden' };
      }
    }

    return plan;
  });

  // Admin CRUD
  app.post('/api/plans', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const body = request.body as {
      projectId: string;
      title: string;
      content: string;
      phase?: string;
      order?: number;
      published?: boolean;
    };
    if (!body.projectId || !body.title) {
      reply.code(400);
      return { error: 'projectId and title required' };
    }

    const plan = await prisma.plan.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        content: body.content ?? '',
        phase: body.phase ?? null,
        order: body.order ?? 0,
        published: body.published ?? false
      }
    });
    reply.code(201);
    return plan;
  });

  app.patch('/api/plans/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as any;

    return prisma.plan.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.phase !== undefined ? { phase: body.phase } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.published !== undefined ? { published: body.published } : {})
      }
    });
  });

  app.delete('/api/plans/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    await prisma.plan.delete({ where: { id } });
    reply.code(204).send();
  });
};

export default planRoutes;
