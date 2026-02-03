import type { FastifyRequest } from 'fastify';
import type { Prisma } from '@prisma/client';
import { prisma } from '../db.js';

export const writeAudit = async (
  request: FastifyRequest,
  action: string,
  entityType: string,
  entityId?: string | null,
  metadata?: Prisma.InputJsonValue
) => {
  const session = request.session;
  if (!session) return;

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action,
      entityType,
      entityId: entityId ?? null,
      metadata: metadata ?? undefined,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }
  });
};
