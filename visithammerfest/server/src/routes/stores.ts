import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { canAccessPartner, isAdmin } from '../lib/rbac.js';
import { publicUrlFor } from '../lib/storage.js';
import { writeAudit } from '../lib/audit.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';

const storeRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (stores: Array<{ heroMediaId: string | null; logoMediaId: string | null }>) => {
    const mediaIds = Array.from(
      new Set(stores.flatMap((store) => [store.heroMediaId, store.logoMediaId]).filter(Boolean))
    ) as string[];

    if (!mediaIds.length) return stores;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return stores.map((store) => ({
      ...store,
      heroMediaUrl: store.heroMediaId ? urlMap.get(store.heroMediaId) : null,
      logoMediaUrl: store.logoMediaId ? urlMap.get(store.logoMediaId) : null
    }));
  };

  app.get('/stores', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const stores = await prisma.store.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });

    return withMediaUrls(stores);
  });

  app.get('/stores/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store || (store.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([store]);
    return withMedia;
  });

  app.post('/stores', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const body = request.body as {
      partnerId?: string;
      name: Record<string, string>;
      short?: Record<string, string>;
      description?: Record<string, string>;
      buttonLabel?: Record<string, string>;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      address?: string;
      email?: string;
      phone?: string;
      website?: string;
      category?: string[];
      location?: string[];
      conceptIds?: string[];
      target?: string[];
      mapEmbed?: string;
      heroMediaId?: string;
      logoMediaId?: string;
      slug?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const partnerId = body.partnerId ?? null;
    if (!isAdmin(session.user) && !canAccessPartner(session.user, partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.name);
    const slug = slugBase
      ? await ensureUniqueSlug(slugBase, async (candidate) =>
          Boolean(await prisma.store.findFirst({ where: { slug: candidate } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const store = await prisma.store.create({
      data: {
        partnerId,
        name: body.name,
        short: body.short ?? undefined,
        description: body.description ?? undefined,
        buttonLabel: body.buttonLabel ?? undefined,
        facebook: body.facebook ?? null,
        twitter: body.twitter ?? null,
        instagram: body.instagram ?? null,
        youtube: body.youtube ?? null,
        address: body.address ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        website: body.website ?? null,
        category: body.category ?? [],
        location: body.location ?? [],
        conceptIds: body.conceptIds ?? [],
        target: body.target ?? [],
        mapEmbed: body.mapEmbed ?? null,
        heroMediaId: body.heroMediaId ?? undefined,
        logoMediaId: body.logoMediaId ?? undefined,
        slug,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'store.create', 'store', store.id);

    reply.code(201);
    return store;
  });

  app.patch('/stores/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);
    const { id } = request.params as { id: string };
    const store = await prisma.store.findUnique({ where: { id } });
    if (!store) {
      reply.code(404);
      return { error: 'Not found' };
    }

    if (!isAdmin(session.user) && !canAccessPartner(session.user, store.partnerId)) {
      reply.code(403);
      return { error: 'Forbidden' };
    }

    const body = request.body as {
      name?: Record<string, string>;
      short?: Record<string, string>;
      description?: Record<string, string>;
      buttonLabel?: Record<string, string>;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      address?: string;
      email?: string;
      phone?: string;
      website?: string;
      category?: string[];
      location?: string[];
      conceptIds?: string[];
      target?: string[];
      mapEmbed?: string;
      heroMediaId?: string;
      logoMediaId?: string;
      slug?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const slug = body.slug
      ? await ensureUniqueSlug(slugify(body.slug), async (candidate) =>
          Boolean(await prisma.store.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const updated = await prisma.store.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        short: body.short ?? undefined,
        description: body.description ?? undefined,
        buttonLabel: body.buttonLabel ?? undefined,
        facebook: body.facebook ?? null,
        twitter: body.twitter ?? null,
        instagram: body.instagram ?? null,
        youtube: body.youtube ?? null,
        address: body.address ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        website: body.website ?? null,
        category: body.category ?? undefined,
        location: body.location ?? undefined,
        conceptIds: body.conceptIds ?? undefined,
        target: body.target ?? undefined,
        mapEmbed: body.mapEmbed ?? null,
        heroMediaId: body.heroMediaId ?? undefined,
        logoMediaId: body.logoMediaId ?? undefined,
        slug,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'store.update', 'store', updated.id);

    return updated;
  });
};

export default storeRoutes;
