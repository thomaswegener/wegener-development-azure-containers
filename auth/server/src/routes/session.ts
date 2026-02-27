import type { FastifyPluginAsync } from 'fastify';
import { getSession, COOKIE_NAME } from '../lib/session.js';
import { env } from '../env.js';

/**
 * GET /api/session
 *
 * Internal endpoint — called by other services (portal API, VHF API, etc.)
 * to validate the wgn_auth cookie and get user context.
 *
 * Returns user info + app access list.
 * Returns 401 if no valid session.
 */
const sessionRoutes: FastifyPluginAsync = async (app) => {
  // Internal service-to-service endpoint — not exposed via Traefik
  app.get('/internal/users/by-email', async (request, reply) => {
    const { email } = request.query as { email?: string };
    if (!email) { reply.code(400); return { error: 'email required' }; }

    const user = await (await import('../db.js')).prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, displayName: true, role: true }
    });
    if (!user) { reply.code(404); return { error: 'User not found' }; }
    return user;
  });

  /**
   * GET /auth/forward
   *
   * Traefik ForwardAuth endpoint. Validates the wgn_auth session cookie.
   * - Valid session → 200 with X-WEBAUTH-USER (email) header for Grafana auth proxy
   * - No/expired session → 302 redirect to login page with original URL as redirect target
   */
  app.get('/auth/forward', { config: { rateLimit: false } }, async (request, reply) => {
    const token = request.cookies[COOKIE_NAME];
    const session = await getSession(token);

    if (!session) {
      const proto = (request.headers['x-forwarded-proto'] as string) ?? 'https';
      const host = (request.headers['x-forwarded-host'] as string) ?? '';
      const uri = (request.headers['x-forwarded-uri'] as string) ?? '/';
      const originalUrl = host ? `${proto}://${host}${uri}` : env.allowedRedirectOrigins[0];
      return reply.redirect(`${env.loginPageUrl}?redirect=${encodeURIComponent(originalUrl)}`);
    }

    const grafanaRole = env.adminEmails.includes(session.user.email) ? 'Admin' : 'Viewer';
    reply.header('X-WEBAUTH-USER', session.user.email);
    reply.header('X-WEBAUTH-ROLE', grafanaRole);
    if (session.user.displayName) {
      reply.header('X-Display-Name', session.user.displayName);
    }
    return reply.code(200).send();
  });

  app.get('/api/session', async (request, reply) => {
    const token = request.cookies[COOKIE_NAME];
    const session = await getSession(token);

    if (!session) {
      reply.code(401);
      return { error: 'No active session' };
    }

    const { user } = session;

    return {
      userId: user.id,
      email: user.email,
      displayName: user.displayName ?? null,
      avatarUrl: user.avatarUrl ?? null,
      role: user.role,
      apps: user.appAccess.map(a => ({
        appId: a.appId,
        role: a.role,
        metadata: a.metadata ?? null
      }))
    };
  });
};

export default sessionRoutes;
