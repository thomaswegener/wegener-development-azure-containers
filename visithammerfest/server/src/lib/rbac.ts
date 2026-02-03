import type { RoleName } from '@prisma/client';

export type SessionUser = {
  id: string;
  email: string;
  displayName?: string | null;
  mustChangePassword: boolean;
  roles: { role: { name: RoleName } }[];
  partnerLinks: { partnerId: string }[];
};

export const isAdmin = (user: SessionUser) => user.roles.some((role) => role.role.name === 'ADMIN');

export const partnerIdsForUser = (user: SessionUser) => user.partnerLinks.map((link) => link.partnerId);

export const canAccessPartner = (user: SessionUser, partnerId: string | null | undefined) => {
  if (!partnerId) return false;
  if (isAdmin(user)) return true;
  return partnerIdsForUser(user).includes(partnerId);
};
