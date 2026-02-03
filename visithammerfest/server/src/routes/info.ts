import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { requireAdmin, requireCsrfHeader } from '../lib/auth.js';
import { normalizeStatus, publishMetadata } from '../lib/content.js';
import { isAdmin } from '../lib/rbac.js';
import { publicUrlFor } from '../lib/storage.js';
import { writeAudit } from '../lib/audit.js';

const infoRoutes: FastifyPluginAsync = async (app) => {
  app.get('/info', async (request, reply) => {
    const info = await prisma.siteInfo.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (!info) {
      reply.code(404);
      return { error: 'Not found' };
    }

    if (info.status !== 'PUBLISHED' && !(request.session && isAdmin(request.session.user))) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const mediaIds = [info.heroMediaId, info.logoMediaId].filter(Boolean) as string[];
    if (!mediaIds.length) return info;

    const assets = await prisma.mediaAsset.findMany({ where: { id: { in: mediaIds } } });
    const urlMap = new Map(assets.map((asset) => [asset.id, publicUrlFor(asset.storagePath, asset.provider)]));

    return {
      ...info,
      heroMediaUrl: info.heroMediaId ? urlMap.get(info.heroMediaId) : null,
      logoMediaUrl: info.logoMediaId ? urlMap.get(info.logoMediaId) : null
    };
  });

  app.patch('/info', async (request) => {
    const session = requireAdmin(request);
    requireCsrfHeader(request);
    const body = request.body as {
      name?: Record<string, string>;
      short?: Record<string, string>;
      description?: Record<string, string>;
      buttonLabel?: Record<string, string>;
      buttonLink?: string;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      address?: string;
      email?: string;
      website?: string;
      mapEmbed?: string;
      heroMediaId?: string;
      logoMediaId?: string;
      status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED';
    };

    const info = await prisma.siteInfo.findFirst();
    if (info) {
      const status = normalizeStatus(session.user, body.status);
      const updated = await prisma.siteInfo.update({
        where: { id: info.id },
        data: {
          name: body.name ?? undefined,
          short: body.short ?? undefined,
          description: body.description ?? undefined,
          buttonLabel: body.buttonLabel ?? undefined,
          buttonLink: body.buttonLink ?? null,
          facebook: body.facebook ?? null,
          twitter: body.twitter ?? null,
          instagram: body.instagram ?? null,
          youtube: body.youtube ?? null,
          address: body.address ?? null,
          email: body.email ?? null,
          website: body.website ?? null,
          mapEmbed: body.mapEmbed ?? null,
          heroMediaId: body.heroMediaId ?? undefined,
          logoMediaId: body.logoMediaId ?? undefined,
          status,
          ...publishMetadata(session.user, status)
        }
      });

      await writeAudit(request, 'siteInfo.update', 'siteInfo', updated.id);
      return updated;
    }

    const status = normalizeStatus(session.user, body.status);
    const created = await prisma.siteInfo.create({
      data: {
        name: body.name ?? { en: 'Visit Hammerfest', no: 'Visit Hammerfest' },
        short: body.short ?? undefined,
        description: body.description ?? undefined,
        buttonLabel: body.buttonLabel ?? undefined,
        buttonLink: body.buttonLink ?? null,
        facebook: body.facebook ?? null,
        twitter: body.twitter ?? null,
        instagram: body.instagram ?? null,
        youtube: body.youtube ?? null,
        address: body.address ?? null,
        email: body.email ?? null,
        website: body.website ?? null,
        mapEmbed: body.mapEmbed ?? null,
        heroMediaId: body.heroMediaId ?? undefined,
        logoMediaId: body.logoMediaId ?? undefined,
        status,
        ...publishMetadata(session.user, status)
      }
    });

    await writeAudit(request, 'siteInfo.create', 'siteInfo', created.id);
    return created;
  });
};

export default infoRoutes;
