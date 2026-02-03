import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { canAccessPartner, isAdmin } from '../lib/rbac.js';
import { publicUrlFor } from '../lib/storage.js';
import { writeAudit } from '../lib/audit.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';

const articleRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (articles: Array<{ heroMediaId: string | null }>) => {
    const mediaIds = Array.from(new Set(articles.map((article) => article.heroMediaId).filter(Boolean))) as string[];
    if (!mediaIds.length) return articles;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return articles.map((article) => ({
      ...article,
      heroMediaUrl: article.heroMediaId ? urlMap.get(article.heroMediaId) : null
    }));
  };

  app.get('/articles', async (request) => {
    const query = request.query as { includeAll?: string; type?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';
    const type = query.type?.trim().toLowerCase();

    const articles = await prisma.article.findMany({
      where: includeAll
        ? type
          ? { type }
          : {}
        : type
          ? { status: 'PUBLISHED', type }
          : { status: 'PUBLISHED' },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }]
    });

    return withMediaUrls(articles);
  });

  app.get('/articles/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article || (article.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([article]);
    return withMedia;
  });

  app.post('/articles', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const body = request.body as {
      partnerId?: string;
      title: Record<string, string>;
      summary?: Record<string, string>;
      body?: Record<string, string>;
      author?: string;
      priority?: number;
      buttonLabel?: Record<string, string>;
      buttonLink?: string;
      heroMediaId?: string;
      location?: string[];
      slug?: string;
      type?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
      showOnHome?: boolean;
    };

    const partnerId = body.partnerId ?? null;
    if (!isAdmin(session.user) && !canAccessPartner(session.user, partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.title);
    const slug = slugBase
      ? await ensureUniqueSlug(slugBase, async (candidate) =>
          Boolean(await prisma.article.findFirst({ where: { slug: candidate } }))
        )
      : undefined;

    const type = body.type?.trim().toLowerCase() || null;
    const status = normalizeStatus(session.user, body.status);
    const article = await prisma.article.create({
      data: {
        partnerId,
        title: body.title,
        summary: body.summary ?? undefined,
        body: body.body ?? undefined,
        author: body.author ?? null,
        priority: body.priority ?? null,
        buttonLabel: body.buttonLabel ?? undefined,
        buttonLink: body.buttonLink ?? null,
        location: body.location ?? [],
        heroMediaId: body.heroMediaId ?? undefined,
        showOnHome: body.showOnHome ?? false,
        slug,
        type,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'article.create', 'article', article.id);

    reply.code(201);
    return article;
  });

  app.patch('/articles/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      reply.code(404);
      return { error: 'Not found' };
    }

    if (!isAdmin(session.user) && !canAccessPartner(session.user, article.partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const body = request.body as {
      title?: Record<string, string>;
      summary?: Record<string, string>;
      body?: Record<string, string>;
      author?: string;
      priority?: number;
      buttonLabel?: Record<string, string>;
      buttonLink?: string;
      heroMediaId?: string;
      location?: string[];
      slug?: string;
      type?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
      showOnHome?: boolean;
    };

    const slug = body.slug
      ? await ensureUniqueSlug(slugify(body.slug), async (candidate) =>
          Boolean(await prisma.article.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const type = body.type?.trim().toLowerCase();
    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        summary: body.summary ?? undefined,
        body: body.body ?? undefined,
        author: body.author ?? null,
        priority: body.priority ?? null,
        buttonLabel: body.buttonLabel ?? undefined,
        buttonLink: body.buttonLink ?? null,
        location: body.location ?? undefined,
        heroMediaId: body.heroMediaId ?? undefined,
        showOnHome: body.showOnHome ?? undefined,
        slug,
        type,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'article.update', 'article', updated.id);

    return updated;
  });
};

export default articleRoutes;
