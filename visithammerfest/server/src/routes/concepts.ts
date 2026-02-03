import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { requireAdmin, requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { publicUrlFor } from '../lib/storage.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';
import { isAdmin } from '../lib/rbac.js';
import { writeAudit } from '../lib/audit.js';

const conceptRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (concepts: Array<{ heroMediaId: string | null }>) => {
    const mediaIds = Array.from(new Set(concepts.map((concept) => concept.heroMediaId).filter(Boolean))) as string[];
    if (!mediaIds.length) return concepts;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return concepts.map((concept) => ({
      ...concept,
      heroMediaUrl: concept.heroMediaId ? urlMap.get(concept.heroMediaId) : null
    }));
  };

  app.get('/concepts', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const concepts = await prisma.concept.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: [{ createdAt: 'asc' }]
    });

    return withMediaUrls(concepts);
  });

  app.get('/concepts/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const concept = await prisma.concept.findUnique({ where: { slug } });
    if (!concept || (concept.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([concept]);
    return withMedia;
  });

  app.post('/concepts', async (request, reply) => {
    const session = requireAuth(request);
    requireAdmin(request);
    requireCsrfHeader(request);

    const body = request.body as {
      title: Record<string, string>;
      summary?: Record<string, string>;
      body?: Record<string, string>;
      tag?: Record<string, string>;
      slug?: string;
      heroMediaId?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
      showOnHome?: boolean;
    };

    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.title);
    const slugSeed = slugBase || `concept-${crypto.randomUUID()}`;
    const slug = await ensureUniqueSlug(slugSeed, async (candidate) =>
      Boolean(await prisma.concept.findFirst({ where: { slug: candidate } }))
    );

    const status = normalizeStatus(session.user, body.status);
    const concept = await prisma.concept.create({
      data: {
        title: body.title,
        summary: body.summary ?? undefined,
        body: body.body ?? undefined,
        tag: body.tag ?? undefined,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        showOnHome: body.showOnHome ?? true,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'concept.create', 'concept', concept.id);

    reply.code(201);
    return concept;
  });

  app.patch('/concepts/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireAdmin(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const concept = await prisma.concept.findUnique({ where: { id } });
    if (!concept) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const body = request.body as {
      title?: Record<string, string>;
      summary?: Record<string, string>;
      body?: Record<string, string>;
      tag?: Record<string, string>;
      slug?: string;
      heroMediaId?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
      showOnHome?: boolean;
    };

    const slug = body.slug
      ? await ensureUniqueSlug(slugify(body.slug), async (candidate) =>
          Boolean(await prisma.concept.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.concept.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        summary: body.summary ?? undefined,
        body: body.body ?? undefined,
        tag: body.tag ?? undefined,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        showOnHome: body.showOnHome ?? undefined,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'concept.update', 'concept', updated.id);

    return updated;
  });
};

export default conceptRoutes;
