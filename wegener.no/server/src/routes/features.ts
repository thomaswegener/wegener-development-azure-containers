import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAccess, requirePortalAdmin } from '../lib/auth.js';
import { sendDiscordNotification, colors } from '../lib/discord.js';
import { createGitHubIssue, buildIssueLabels, slugify } from '../lib/github.js';

const featureRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/features', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const query = request.query as { projectId?: string; status?: string };

    if (ctx.portalRole === 'admin') {
      return prisma.featureRequest.findMany({
        where: {
          ...(query.projectId ? { projectId: query.projectId } : {}),
          ...(query.status ? { status: query.status as any } : {})
        },
        orderBy: [{ votes: 'desc' }, { createdAt: 'desc' }],
        include: { project: { select: { id: true, name: true, customer: { select: { companyName: true } } } } }
      });
    }

    if (!ctx.customerId) { reply.code(403); return { error: 'No customer record' }; }
    const projects = await prisma.project.findMany({
      where: { customerId: ctx.customerId },
      select: { id: true }
    });
    const projectIds = projects.map(p => p.id);

    return prisma.featureRequest.findMany({
      where: {
        projectId: { in: projectIds },
        ...(query.status ? { status: query.status as any } : {})
      },
      orderBy: [{ votes: 'desc' }, { createdAt: 'desc' }],
      include: { project: { select: { id: true, name: true } } }
    });
  });

  app.get('/api/features/:id', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const feature = await prisma.featureRequest.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, customerId: true } },
        comments: {
          where: ctx.portalRole === 'admin' ? {} : { visibility: 'PUBLIC' },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!feature) { reply.code(404); return { error: 'Not found' }; }
    if (ctx.portalRole !== 'admin' && feature.project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }
    return feature;
  });

  app.post('/api/features', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const body = request.body as {
      projectId: string;
      title: string;
      description?: string;
      priority?: string;
    };
    if (!body.projectId || !body.title) {
      reply.code(400);
      return { error: 'projectId and title required' };
    }

    const project = await prisma.project.findUnique({
      where: { id: body.projectId },
      include: { customer: true }
    });
    if (!project) { reply.code(404); return { error: 'Project not found' }; }
    if (ctx.portalRole !== 'admin' && project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    const feature = await prisma.featureRequest.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        description: body.description ?? null,
        priority: (body.priority as any) ?? 'MEDIUM',
        authorUserId: ctx.userId
      }
    });

    await sendDiscordNotification('', [{
      title: `New Feature Request: ${feature.title}`,
      description: feature.description?.slice(0, 200) ?? '',
      color: colors.blue,
      fields: [
        { name: 'Project', value: project.name, inline: true },
        { name: 'Customer', value: project.customer.companyName ?? 'Unknown', inline: true },
        { name: 'Priority', value: feature.priority, inline: true }
      ],
      timestamp: new Date().toISOString()
    }]);

    reply.code(201);
    return feature;
  });

  app.patch('/api/features/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as any;

    const feature = await prisma.featureRequest.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {})
      }
    });
    return feature;
  });

  app.post('/api/features/:id/github', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const feature = await prisma.featureRequest.findUnique({
      where: { id },
      include: { project: { include: { customer: true } } }
    });
    if (!feature) { reply.code(404); return { error: 'Not found' }; }
    if (feature.githubIssueNumber) {
      return { githubIssueNumber: feature.githubIssueNumber, githubIssueUrl: feature.githubIssueUrl };
    }

    const companySlug = slugify(feature.project.customer.companyName ?? feature.project.customer.id);
    const labels = buildIssueLabels('feature', companySlug);

    const body = [
      `**Customer:** ${feature.project.customer.companyName ?? 'Unknown'}`,
      `**Project:** ${feature.project.name}`,
      '',
      feature.description ?? '',
      '',
      `*Submitted via Customer Portal — Feature ID: ${feature.id}*`
    ].join('\n');

    const gh = await createGitHubIssue(feature.title, body, labels);

    const updated = await prisma.featureRequest.update({
      where: { id },
      data: { githubIssueNumber: gh.number, githubIssueUrl: gh.html_url }
    });

    return updated;
  });

  app.post('/api/features/:id/comments', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as { content: string; visibility?: string };

    const feature = await prisma.featureRequest.findUnique({
      where: { id },
      include: { project: true }
    });
    if (!feature) { reply.code(404); return { error: 'Not found' }; }
    if (ctx.portalRole !== 'admin' && feature.project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    const comment = await prisma.comment.create({
      data: {
        featureId: id,
        content: body.content,
        authorUserId: ctx.userId,
        visibility: (body.visibility as any) ?? 'PUBLIC'
      }
    });

    reply.code(201);
    return comment;
  });
};

export default featureRoutes;
