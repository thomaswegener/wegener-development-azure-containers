import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requirePortalAccess, requirePortalAdmin } from '../lib/auth.js';
import { sendDiscordNotification, colors } from '../lib/discord.js';
import { createGitHubIssue, buildIssueLabels, slugify } from '../lib/github.js';

const issueRoutes: FastifyPluginAsync = async (app) => {
  // List issues (scoped to customer's projects)
  app.get('/api/issues', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const query = request.query as { projectId?: string; status?: string };

    if (ctx.portalRole === 'admin') {
      return prisma.issue.findMany({
        where: {
          ...(query.projectId ? { projectId: query.projectId } : {}),
          ...(query.status ? { status: query.status as any } : {})
        },
        orderBy: { createdAt: 'desc' },
        include: { project: { select: { id: true, name: true, customer: { select: { companyName: true } } } } }
      });
    }

    if (!ctx.customerId) { reply.code(403); return { error: 'No customer record' }; }
    const projects = await prisma.project.findMany({
      where: { customerId: ctx.customerId },
      select: { id: true }
    });
    const projectIds = projects.map(p => p.id);

    return prisma.issue.findMany({
      where: {
        projectId: { in: projectIds },
        ...(query.projectId && projectIds.includes(query.projectId) ? { projectId: query.projectId } : {}),
        ...(query.status ? { status: query.status as any } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { id: true, name: true } } }
    });
  });

  // Get single issue
  app.get('/api/issues/:id', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, customerId: true } },
        comments: {
          where: ctx.portalRole === 'admin' ? {} : { visibility: 'PUBLIC' },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    if (!issue) { reply.code(404); return { error: 'Not found' }; }

    if (ctx.portalRole !== 'admin' && issue.project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    return issue;
  });

  // Create issue
  app.post('/api/issues', async (request, reply) => {
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

    // Verify access to project
    const project = await prisma.project.findUnique({
      where: { id: body.projectId },
      include: { customer: true }
    });
    if (!project) { reply.code(404); return { error: 'Project not found' }; }
    if (ctx.portalRole !== 'admin' && project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    const issue = await prisma.issue.create({
      data: {
        projectId: body.projectId,
        title: body.title,
        description: body.description ?? null,
        priority: (body.priority as any) ?? 'MEDIUM',
        authorUserId: ctx.userId
      }
    });

    // Discord notification
    await sendDiscordNotification('', [{
      title: `New Issue: ${issue.title}`,
      description: issue.description?.slice(0, 200) ?? '',
      color: colors.orange,
      fields: [
        { name: 'Project', value: project.name, inline: true },
        { name: 'Customer', value: project.customer.companyName ?? 'Unknown', inline: true },
        { name: 'Priority', value: issue.priority, inline: true }
      ],
      timestamp: new Date().toISOString()
    }]);

    reply.code(201);
    return issue;
  });

  // Update issue (admin changes status)
  app.patch('/api/issues/:id', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as any;

    const issue = await prisma.issue.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.status === 'RESOLVED' || body.status === 'CLOSED' ? { resolvedAt: new Date() } : {})
      },
      include: { project: { include: { customer: true } } }
    });

    // Discord notification on status change
    if (body.status) {
      await sendDiscordNotification('', [{
        title: `Issue ${body.status}: ${issue.title}`,
        color: body.status === 'RESOLVED' ? colors.green : colors.blue,
        fields: [
          { name: 'Project', value: issue.project.name, inline: true },
          { name: 'Customer', value: issue.project.customer.companyName ?? 'Unknown', inline: true }
        ],
        timestamp: new Date().toISOString()
      }]);
    }

    return issue;
  });

  // Create GitHub issue from portal issue
  app.post('/api/issues/:id/github', async (request, reply) => {
    const ctx = await requirePortalAdmin(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const issue = await prisma.issue.findUnique({
      where: { id },
      include: { project: { include: { customer: true } } }
    });
    if (!issue) { reply.code(404); return { error: 'Not found' }; }
    if (issue.githubIssueNumber) {
      return { githubIssueNumber: issue.githubIssueNumber, githubIssueUrl: issue.githubIssueUrl };
    }

    const companySlug = slugify(issue.project.customer.companyName ?? issue.project.customer.id);
    const labels = buildIssueLabels('bug', companySlug);

    const body = [
      `**Customer:** ${issue.project.customer.companyName ?? 'Unknown'}`,
      `**Project:** ${issue.project.name}`,
      '',
      issue.description ?? '',
      '',
      `*Reported via Customer Portal — Issue ID: ${issue.id}*`
    ].join('\n');

    const gh = await createGitHubIssue(issue.title, body, labels);

    const updated = await prisma.issue.update({
      where: { id },
      data: { githubIssueNumber: gh.number, githubIssueUrl: gh.html_url }
    });

    await sendDiscordNotification('', [{
      title: `GitHub Issue Created: #${gh.number}`,
      description: `[${issue.title}](${gh.html_url})`,
      color: colors.purple,
      fields: [
        { name: 'Project', value: issue.project.name, inline: true },
        { name: 'Customer', value: issue.project.customer.companyName ?? 'Unknown', inline: true }
      ],
      timestamp: new Date().toISOString()
    }]);

    return updated;
  });

  // Add comment to issue
  app.post('/api/issues/:id/comments', async (request, reply) => {
    const ctx = await requirePortalAccess(request, reply);
    if (!ctx) return;

    const { id } = request.params as { id: string };
    const body = request.body as { content: string; visibility?: string };

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: { project: true }
    });
    if (!issue) { reply.code(404); return { error: 'Not found' }; }
    if (ctx.portalRole !== 'admin' && issue.project.customerId !== ctx.customerId) {
      reply.code(403); return { error: 'Forbidden' };
    }

    const comment = await prisma.comment.create({
      data: {
        issueId: id,
        content: body.content,
        authorUserId: ctx.userId,
        visibility: (body.visibility as any) ?? (ctx.portalRole === 'admin' ? 'PUBLIC' : 'PUBLIC')
      }
    });

    reply.code(201);
    return comment;
  });
};

export default issueRoutes;
