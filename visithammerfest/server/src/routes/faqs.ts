import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAdmin, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { isAdmin } from '../lib/rbac.js';
import { writeAudit } from '../lib/audit.js';

const faqRoutes: FastifyPluginAsync = async (app) => {
  const allowedRegions = ['HAMMERFEST', 'MASOY', 'PORSANGER'] as const;
  type FaqRegion = (typeof allowedRegions)[number];

  const normalizeRegion = (value?: string | null): FaqRegion => {
    if (!value) return 'HAMMERFEST';
    const upper = value.toUpperCase();
    return allowedRegions.includes(upper as FaqRegion) ? (upper as FaqRegion) : 'HAMMERFEST';
  };

  app.get('/faqs', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const faqs = await prisma.faq.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: [{ category: 'asc' }, { createdAt: 'asc' }]
    });

    return faqs;
  });

  app.post('/faqs', async (request, reply) => {
    const session = requireAdmin(request);
    requireCsrfHeader(request);
    const body = request.body as {
      region?: string;
      category?: string;
      question: Record<string, string>;
      answer?: Record<string, string>;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const status = normalizeStatus(session.user, body.status);
    const faq = await prisma.faq.create({
      data: {
        region: normalizeRegion(body.region),
        category: body.category?.trim() || null,
        question: body.question,
        answer: body.answer ?? undefined,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'faq.create', 'faq', faq.id);

    reply.code(201);
    return faq;
  });

  app.patch('/faqs/:id', async (request, reply) => {
    const session = requireAdmin(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const faq = await prisma.faq.findUnique({ where: { id } });
    if (!faq) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const body = request.body as {
      region?: string;
      category?: string;
      question?: Record<string, string>;
      answer?: Record<string, string>;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.faq.update({
      where: { id },
      data: {
        region: body.region ? normalizeRegion(body.region) : undefined,
        category: body.category?.trim() || null,
        question: body.question ?? undefined,
        answer: body.answer ?? undefined,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'faq.update', 'faq', updated.id);

    return updated;
  });
};

export default faqRoutes;
