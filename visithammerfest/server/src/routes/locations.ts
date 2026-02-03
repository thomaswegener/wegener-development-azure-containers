import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { requireAdmin, requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { publicUrlFor } from '../lib/storage.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';
import { isAdmin } from '../lib/rbac.js';
import { writeAudit } from '../lib/audit.js';

const locationRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (locations: Array<{ heroMediaId: string | null }>) => {
    const mediaIds = Array.from(new Set(locations.map((location) => location.heroMediaId).filter(Boolean))) as string[];
    if (!mediaIds.length) return locations;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return locations.map((location) => ({
      ...location,
      heroMediaUrl: location.heroMediaId ? urlMap.get(location.heroMediaId) : null
    }));
  };

  app.get('/locations', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const locations = await prisma.location.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: [{ createdAt: 'asc' }]
    });

    return withMediaUrls(locations);
  });

  app.get('/locations/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const location = await prisma.location.findUnique({ where: { slug } });
    if (!location || (location.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([location]);
    return withMedia;
  });

  app.post('/locations', async (request, reply) => {
    const session = requireAuth(request);
    requireAdmin(request);
    requireCsrfHeader(request);

    const body = request.body as {
      name: Record<string, string>;
      summary?: Record<string, string>;
      slug?: string;
      heroMediaId?: string;
      showOnHome?: boolean;
      showOnMenu?: boolean;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.name);
    const slugSeed = slugBase || `location-${crypto.randomUUID()}`;
    const slug = await ensureUniqueSlug(slugSeed, async (candidate) =>
      Boolean(await prisma.location.findFirst({ where: { slug: candidate } }))
    );

    const status = normalizeStatus(session.user, body.status);
    const location = await prisma.location.create({
      data: {
        name: body.name,
        summary: body.summary ?? undefined,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        showOnHome: body.showOnHome ?? false,
        showOnMenu: body.showOnMenu ?? true,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'location.create', 'location', location.id);

    reply.code(201);
    return location;
  });

  app.patch('/locations/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireAdmin(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const body = request.body as {
      name?: Record<string, string>;
      summary?: Record<string, string>;
      slug?: string;
      heroMediaId?: string;
      showOnHome?: boolean;
      showOnMenu?: boolean;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const slug = body.slug
      ? await ensureUniqueSlug(slugify(body.slug), async (candidate) =>
          Boolean(await prisma.location.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.location.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        summary: body.summary ?? undefined,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        showOnHome: body.showOnHome ?? undefined,
        showOnMenu: body.showOnMenu ?? undefined,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'location.update', 'location', updated.id);

    return updated;
  });
};

export default locationRoutes;
