import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAdmin, requireCsrfHeader, requirePartnerAccess } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { isAdmin } from '../lib/rbac.js';
import { publicUrlFor } from '../lib/storage.js';
import { writeAudit } from '../lib/audit.js';
import { ensureUniqueSlug, slugFromLocalized, slugify } from '../lib/slug.js';

const partnersRoutes: FastifyPluginAsync = async (app) => {
  const withMediaUrls = async (partners: Array<{ heroMediaId: string | null; logoMediaId: string | null }>) => {
    const mediaIds = Array.from(
      new Set(partners.flatMap((partner) => [partner.heroMediaId, partner.logoMediaId]).filter(Boolean))
    ) as string[];

    if (!mediaIds.length) return partners;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return partners.map((partner) => ({
      ...partner,
      heroMediaUrl: partner.heroMediaId ? urlMap.get(partner.heroMediaId) : null,
      logoMediaUrl: partner.logoMediaId ? urlMap.get(partner.logoMediaId) : null
    }));
  };

  app.get('/partners', async (request) => {
    const query = request.query as { includeAll?: string };
    const includeAll = request.session && isAdmin(request.session.user) && query.includeAll === 'true';

    const partners = await prisma.partner.findMany({
      where: includeAll ? {} : { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });

    return withMediaUrls(partners);
  });

  app.get('/partners/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const partner = await prisma.partner.findUnique({ where: { id } });
    if (!partner || (partner.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user)))) {
      reply.code(404);
      return { error: 'Not found' };
    }
    const [withMedia] = await withMediaUrls([partner]);
    return withMedia;
  });

  app.post('/partners', async (request, reply) => {
    const session = requireAdmin(request);
    requireCsrfHeader(request);
    const body = request.body as {
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

    const slugBase = body.slug ? slugify(body.slug) : slugFromLocalized(body.name);
    const slug = slugBase
      ? await ensureUniqueSlug(slugBase, async (candidate) =>
          Boolean(await prisma.partner.findFirst({ where: { slug: candidate } }))
        )
      : undefined;

    const status = body.status ?? 'PENDING';
    const partner = await prisma.partner.create({
      data: {
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

    await writeAudit(request, 'partner.create', 'partner', partner.id);

    reply.code(201);
    return partner;
  });

  app.patch('/partners/:id', async (request) => {
    const { id } = request.params as { id: string };
    const session = requirePartnerAccess(request, id);
    requireCsrfHeader(request);
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
          Boolean(await prisma.partner.findFirst({ where: { slug: candidate, id: { not: id } } }))
        )
      : undefined;

    const status = normalizeStatus(session.user, body.status);
    const partner = await prisma.partner.update({
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

    await writeAudit(request, 'partner.update', 'partner', partner.id);

    return partner;
  });
};

export default partnersRoutes;
