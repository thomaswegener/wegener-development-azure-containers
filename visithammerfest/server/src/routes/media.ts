import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { requireAuth, requireCsrfHeader } from '../lib/auth.js';
import { canAccessPartner, isAdmin } from '../lib/rbac.js';
import type { SessionUser } from '../lib/rbac.js';
import { writeLocalFile, publicUrlFor } from '../lib/storage.js';
import { env } from '../env.js';
import { optimizeImage } from '../lib/image.js';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const allowedTargets = new Set(['PARTNER', 'ACTIVITY', 'STORE', 'ARTICLE', 'SITE_INFO', 'CONCEPT', 'LOCATION']);

const mediaRoutes: FastifyPluginAsync = async (app) => {
  const maxUploadBytes = env.maxUploadMb * 1024 * 1024;

  const ensureTargetAccess = async (targetType: string, targetId: string, session: { user: SessionUser }) => {
    if (targetType === 'SITE_INFO' && !isAdmin(session.user)) {
      return { allowed: false, code: 403, error: 'Forbidden' };
    }

    if (targetType === 'CONCEPT') {
      if (!isAdmin(session.user)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      const concept = await prisma.concept.findUnique({ where: { id: targetId } });
      if (!concept) return { allowed: false, code: 404, error: 'Not found' };
      return { allowed: true };
    }

    if (targetType === 'LOCATION') {
      if (!isAdmin(session.user)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      const location = await prisma.location.findUnique({ where: { id: targetId } });
      if (!location) return { allowed: false, code: 404, error: 'Not found' };
      return { allowed: true };
    }

    if (targetType === 'PARTNER') {
      if (!canAccessPartner(session.user, targetId)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      return { allowed: true };
    }

    if (targetType === 'ACTIVITY') {
      const activity = await prisma.activity.findUnique({ where: { id: targetId } });
      if (!activity) return { allowed: false, code: 404, error: 'Not found' };
      if (!isAdmin(session.user) && !canAccessPartner(session.user, activity.partnerId)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      return { allowed: true };
    }

    if (targetType === 'STORE') {
      const store = await prisma.store.findUnique({ where: { id: targetId } });
      if (!store) return { allowed: false, code: 404, error: 'Not found' };
      if (!isAdmin(session.user) && !canAccessPartner(session.user, store.partnerId)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      return { allowed: true };
    }

    if (targetType === 'ARTICLE') {
      const article = await prisma.article.findUnique({ where: { id: targetId } });
      if (!article) return { allowed: false, code: 404, error: 'Not found' };
      if (!isAdmin(session.user) && !canAccessPartner(session.user, article.partnerId)) {
        return { allowed: false, code: 403, error: 'Forbidden' };
      }
      return { allowed: true };
    }

    return { allowed: true };
  };

  const ensurePublicAccess = async (targetType: string, targetId: string, session?: { user: SessionUser } | null) => {
    if (session) {
      const access = await ensureTargetAccess(targetType, targetId, session);
      return access.allowed ? { allowed: true } : { allowed: false };
    }
    if (targetType === 'SITE_INFO') {
      const info = await prisma.siteInfo.findFirst({ orderBy: { createdAt: 'desc' } });
      if (!info || info.id !== targetId) return { allowed: false };
      return info.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'PARTNER') {
      const partner = await prisma.partner.findUnique({ where: { id: targetId } });
      return partner && partner.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'ACTIVITY') {
      const activity = await prisma.activity.findUnique({ where: { id: targetId } });
      return activity && activity.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'STORE') {
      const store = await prisma.store.findUnique({ where: { id: targetId } });
      return store && store.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'ARTICLE') {
      const article = await prisma.article.findUnique({ where: { id: targetId } });
      return article && article.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'CONCEPT') {
      const concept = await prisma.concept.findUnique({ where: { id: targetId } });
      return concept && concept.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    if (targetType === 'LOCATION') {
      const location = await prisma.location.findUnique({ where: { id: targetId } });
      return location && location.status === 'PUBLISHED' ? { allowed: true } : { allowed: false };
    }

    return { allowed: false };
  };

  app.get('/media/links', async (request, reply) => {
    const query = request.query as { targetType?: string; targetId?: string; label?: string; includeAll?: string };
    const targetType = query.targetType?.toUpperCase() ?? '';
    const targetId = query.targetId ?? '';
    const label = query.label ?? undefined;

    if (!targetType || !targetId) {
      reply.code(400);
      return { error: 'targetType and targetId are required' };
    }

    if (!allowedTargets.has(targetType)) {
      reply.code(400);
      return { error: 'Invalid targetType' };
    }

    const hasSession = request.session ?? null;
    const access = await ensurePublicAccess(targetType, targetId, hasSession);
    if (!access.allowed) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const allowAll =
      query.includeAll === 'true' &&
      hasSession &&
      (await ensureTargetAccess(targetType, targetId, hasSession)).allowed;

    const links = await prisma.mediaLink.findMany({
      where: {
        targetType: targetType as never,
        targetId,
        ...(label ? { label } : {}),
        ...(allowAll ? {} : { isPublished: true })
      },
      include: { media: true },
      orderBy: { createdAt: 'asc' }
    });

    return links.map((link) => ({
      id: link.id,
      mediaId: link.mediaId,
      label: link.label,
      isPublished: link.isPublished,
      url: publicUrlFor(link.media.storagePath, link.media.provider),
      width: link.media.width ?? undefined,
      height: link.media.height ?? undefined,
      contentType: link.media.contentType,
      fileSize: link.media.fileSize
    }));
  });

  app.post('/media/upload', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);

    const file = await request.file();
    if (!file) {
      reply.code(400);
      return { error: 'File is required' };
    }

    if (!allowedTypes.has(file.mimetype)) {
      reply.code(415);
      return { error: 'Unsupported media type' };
    }

    const fields = file.fields as Record<string, { value: string } | undefined>;
    const targetType = fields.targetType?.value ?? '';
    const targetId = fields.targetId?.value ?? '';
    const label = fields.label?.value ?? undefined;

    const normalizedTargetType = targetType.toUpperCase();
    if (!normalizedTargetType || !targetId) {
      reply.code(400);
      return { error: 'targetType and targetId are required' };
    }

    if (!allowedTargets.has(normalizedTargetType)) {
      reply.code(400);
      return { error: 'Invalid targetType' };
    }

    const access = await ensureTargetAccess(normalizedTargetType, targetId, session);
    if (!access.allowed) {
      reply.code(access.code ?? 403);
      return { error: access.error ?? 'Forbidden' };
    }

    const buffer = await file.toBuffer();
    const optimized = await optimizeImage(buffer, file.mimetype);
    if (optimized.buffer.length > maxUploadBytes) {
      reply.code(413);
      return { error: 'Image too large after optimization' };
    }

    const checksum = crypto.createHash('sha256').update(optimized.buffer).digest('hex');
    const storage = await writeLocalFile(optimized.buffer, file.filename, normalizedTargetType, targetId);

    const asset = await prisma.mediaAsset.create({
      data: {
        provider: storage.provider,
        storagePath: storage.storagePath,
        originalName: storage.originalName,
        contentType: file.mimetype,
        fileSize: optimized.buffer.length,
        width: optimized.width ?? undefined,
        height: optimized.height ?? undefined,
        checksum,
        uploadedById: session.user.id,
        links: {
          create: {
            targetType: normalizedTargetType as never,
            targetId,
            label
          }
        }
      }
    });

    reply.code(201);
    return {
      id: asset.id,
      url: publicUrlFor(asset.storagePath, asset.provider),
      storagePath: asset.storagePath
    };
  });

  app.delete('/media/links/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);

    const { id } = request.params as { id: string };
    const link = await prisma.mediaLink.findUnique({ where: { id } });
    if (!link) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const access = await ensureTargetAccess(link.targetType, link.targetId, session);
    if (!access.allowed) {
      reply.code(access.code ?? 403);
      return { error: access.error ?? 'Forbidden' };
    }

    await prisma.mediaLink.delete({ where: { id } });
    reply.code(204);
    return null;
  });

  app.patch('/media/links/:id', async (request, reply) => {
    const session = requireAuth(request);
    requireCsrfHeader(request);

    const { id } = request.params as { id: string };
    const body = request.body as { isPublished?: boolean };
    const link = await prisma.mediaLink.findUnique({ where: { id } });
    if (!link) {
      reply.code(404);
      return { error: 'Not found' };
    }

    const access = await ensureTargetAccess(link.targetType, link.targetId, session);
    if (!access.allowed) {
      reply.code(access.code ?? 403);
      return { error: access.error ?? 'Forbidden' };
    }

    const updated = await prisma.mediaLink.update({
      where: { id },
      data: {
        isPublished: typeof body.isPublished === 'boolean' ? body.isPublished : link.isPublished
      }
    });

    return {
      id: updated.id,
      isPublished: updated.isPublished
    };
  });

  app.get('/media/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      reply.code(404);
      return { error: 'Not found' };
    }

    return {
      id: asset.id,
      url: publicUrlFor(asset.storagePath, asset.provider),
      contentType: asset.contentType,
      fileSize: asset.fileSize
    };
  });
};

export default mediaRoutes;
