import type { ContentStatus } from '@prisma/client';
import { isAdmin } from './rbac.js';
import type { SessionUser } from './rbac.js';

export const normalizeStatus = (user: SessionUser, requested?: ContentStatus) => {
  if (!requested) {
    return isAdmin(user) ? 'PENDING' : 'DRAFT';
  }

  if (isAdmin(user)) return requested;

  if (requested === 'PUBLISHED') return 'PENDING';
  return requested;
};

export const publishMetadata = (user: SessionUser, status?: ContentStatus) => {
  if (!status) return {};
  if (status === 'PUBLISHED' && isAdmin(user)) {
    return { publishedAt: new Date(), publishedById: user.id };
  }
  if (status !== 'PUBLISHED') {
    return { publishedAt: null, publishedById: null };
  }
  return {};
};
