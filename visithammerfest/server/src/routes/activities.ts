import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { canAccessPartner, isAdmin } from '../lib/rbac.js';
import { publicUrlFor } from '../lib/storage.js';
import { writeAudit } from '../lib/audit.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';

const activityRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (activities: Array<{ heroMediaId: string | null }>) => {
    const mediaIds = Array.from(new Set(activities.map((activity) => activity.heroMediaId).filter(Boolean))) as string[];
    if (!mediaIds.length) return activities;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return activities.map((activity) => ({
      ...activity,
      heroMediaUrl: activity.heroMediaId ? urlMap.get(activity.heroMediaId) : null
    }));
  };

  app.get('/activities', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const activities = await prisma.activity.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });

    return withMediaUrls(activities);
  });

  app.get('/activities/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity || (activity.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([activity]);
    return withMedia;
  });

  app.post('/activities', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const body = request.body as {
      partnerId?: string;
      name: Record<string, string>;
      short?: Record<string, string>;
      description?: Record<string, string>;
      category?: string[];
      season?: string[];
      location?: string[];
      conceptIds?: string[];
      mapEmbed?: string;
      bookingLink?: string;
      capacity?: string;
      heroMediaId?: string;
      slug?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const partnerId = body.partnerId ?? null;
    if (!isAdmin(session.user) && !canAccessPartner(session.user, partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const status = normalizeStatus(session.user, body.status);
    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.name);
    const slug = slugBase
      ? await ensureUniqueSlug(slugBase, async (candidate) =>
          Boolean(await prisma.activity.findFirst({ where: { slug: candidate } }))
        )
      : undefined;

    const activity = await prisma.activity.create({
      data: {
        partnerId,
        name: body.name,
        short: body.short ?? undefined,
        description: body.description ?? undefined,
        category: body.category ?? [],
        season: body.season ?? [],
        location: body.location ?? [],
        conceptIds: body.conceptIds ?? [],
        mapEmbed: body.mapEmbed ?? null,
        bookingLink: body.bookingLink ?? null,
        capacity: body.capacity ?? null,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'activity.create', 'activity', activity.id);

    reply.code(201);
    return activity;
  });

  app.patch('/activities/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      reply.code(404);
      return { error: 'Not found' };
    }

    if (!isAdmin(session.user) && !canAccessPartner(session.user, activity.partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const body = request.body as {
      name?: Record<string, string>;
      short?: Record<string, string>;
      description?: Record<string, string>;
      category?: string[];
      season?: string[];
      location?: string[];
      conceptIds?: string[];
      mapEmbed?: string;
      bookingLink?: string;
      capacity?: string;
      heroMediaId?: string;
      slug?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const slug = body.slug
      ? await ensureUniqueSlug(slugify(body.slug), async (candidate) =>
          Boolean(await prisma.activity.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.activity.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        short: body.short ?? undefined,
        description: body.description ?? undefined,
        category: body.category ?? undefined,
        season: body.season ?? undefined,
        location: body.location ?? undefined,
        conceptIds: body.conceptIds ?? undefined,
        mapEmbed: body.mapEmbed ?? null,
        bookingLink: body.bookingLink ?? null,
        capacity: body.capacity ?? null,
        heroMediaId: body.heroMediaId ?? undefined,
        slug,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'activity.update', 'activity', updated.id);

    return updated;
  });
};

export default activityRoutes;
