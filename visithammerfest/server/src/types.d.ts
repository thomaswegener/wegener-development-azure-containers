import 'fastify';
import type { Session } from '@prisma/client';
import type { SessionUser } from './lib/rbac.js';

declare module 'fastify' {
  interface FastifyRequest {
    session?: Session & { user: SessionUser };
  }
}
