import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAccess, requirePortalAdmin } from '../lib/auth.js';

const roadmapRoutes: FastifyPluginAsync = async (app) => {
  // Customers see their project entries + global entries (no projectId)
  app.get('/api/roadmap', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    if (ctx.portalRole === 'admin') {
      return prisma.roadmapEntry.findMany({
        orderBy: [{ targetQuarter: 'asc' }, { order: 'asc' }],
        include: { project: { select: { id: true, name: true, customer: { select: { companyName: true } } } } }
      });
    }

    if (!ctx.customerId) { reply.code(403); return { error: 'No customer record' }; }
    const projects = await prisma.project.findMany({
      where: { customerId: ctx.customerId },
      select: { id: true }
    });
    const projectIds = projects.map(p => p.id);

    return prisma.roadmapEntry.findMany({
      where: {
        OR: [
          { projectId: { in: projectIds } },
          { projectId: null }
        ]
      },
      orderBy: [{ targetQuarter: 'asc' }, { order: 'asc' }],
      include: { project: { select: { id: true, name: true } } }
    });
  });

  // Admin CRUD
  app.post('/api/roadmap', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const body = request.body as {
      projectId?: string;
      title: string;
      description?: string;
      category?: string;
      status?: string;
      targetQuarter?: string;
      order?: number;
    };
    if (!body.title) {
      reply.code(400);
      return { error: 'title required' };
    }

    const entry = await prisma.roadmapEntry.create({
      data: {
        projectId: body.projectId ?? null,
        title: body.title,
        description: body.description ?? null,
        category: body.category ?? null,
        status: body.status ?? 'planned',
        targetQuarter: body.targetQuarter ?? null,
        order: body.order ?? 0
      }
    });
    reply.code(201);
    return entry;
  });

  app.patch('/api/roadmap/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as any;

    return prisma.roadmapEntry.update({
      where: { id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.targetQuarter !== undefined ? { targetQuarter: body.targetQuarter } : {}),
        ...(body.order !== undefined ? { order: body.order } : {}),
        ...(body.projectId !== undefined ? { projectId: body.projectId } : {}),
        ...(body.completedAt !== undefined ? { completedAt: body.completedAt ? new Date(body.completedAt) : null } : {})
      }
    });
  });

  app.delete('/api/roadmap/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    await prisma.roadmapEntry.delete({ where: { id } });
    reply.code(204).send();
  });
};

export default roadmapRoutes;
