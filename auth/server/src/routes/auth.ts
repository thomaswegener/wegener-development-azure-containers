import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';
import { env } from '../env.js';
import { createSession, setSessionCookie, clearSessionCookie, deleteSession, COOKIE_NAME } from '../lib/session.js';
import { buildGoogleAuthUrl, exchangeGoogleCode, getGoogleUserInfo, generateState } from '../lib/google.js';
import { buildMicrosoftAuthUrl, exchangeMicrosoftCode, getMicrosoftUserInfo } from '../lib/microsoft.js';
import { createMagicLink, verifyMagicLink, sendMagicLinkEmail } from '../lib/email.js';

// In-memory state store (fine for single-replica; could use Redis for HA)
const oauthStates = new Map<string, { redirect: string; createdAt: number }>();

const cleanStates = () => {
  const cutoff = Date.now() - 10 * 60 * 1000; // 10 min
  for (const [k, v] of oauthStates) {
    if (v.createdAt < cutoff) oauthStates.delete(k);
  }
};

const isAllowedRedirect = (url: string) => {
  try {
    const parsed = new URL(url);
    return env.allowedRedirectOrigins.some(origin => {
      const o = new URL(origin);
      return parsed.hostname === o.hostname || parsed.hostname.endsWith('.' + o.hostname);
    });
  } catch {
    return false;
  }
};

const upsertUser = async (
  provider: string,
  providerId: string,
  email: string,
  displayName?: string,
  avatarUrl?: string
) => {
  // Find by identity
  const identity = await prisma.identity.findUnique({
    where: { provider_providerId: { provider, providerId } },
    include: { user: true }
  });

  if (identity) {
    // Update display name/avatar if changed
    if (displayName || avatarUrl) {
      await prisma.user.update({
        where: { id: identity.userId },
        data: {
          ...(displayName ? { displayName } : {}),
          ...(avatarUrl ? { avatarUrl } : {})
        }
      });
    }
    return identity.user;
  }

  // Find by email (account linking)
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.identity.create({
      data: { userId: existing.id, provider, providerId }
    });
    return existing;
  }

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      displayName,
      avatarUrl,
      role: env.adminEmails.includes(email) ? 'ADMIN' : 'USER',
      identities: { create: { provider, providerId } }
    }
  });
  return user;
};

const authRoutes: FastifyPluginAsync = async (app) => {
  // --- Google OAuth ---
  app.get('/auth/google', async (request, reply) => {
    cleanStates();
    const redirect = (request.query as Record<string, string>).redirect ?? env.allowedRedirectOrigins[0];
    const state = generateState();
    oauthStates.set(state, { redirect, createdAt: Date.now() });
    return reply.redirect(buildGoogleAuthUrl(state));
  });

  app.get('/auth/google/callback', async (request, reply) => {
    const { code, state, error } = request.query as Record<string, string>;

    if (error) {
      return reply.redirect(`${env.loginPageUrl}?error=google_denied`);
    }

    const stateData = oauthStates.get(state);
    if (!stateData) {
      return reply.redirect(`${env.loginPageUrl}?error=invalid_state`);
    }
    oauthStates.delete(state);

    try {
      const tokens = await exchangeGoogleCode(code);
      const profile = await getGoogleUserInfo(tokens.access_token);

      if (!profile.email_verified) {
        return reply.redirect(`${env.loginPageUrl}?error=unverified_email`);
      }

      const user = await upsertUser('google', profile.sub, profile.email, profile.name, profile.picture);
      const session = await createSession(user.id, request.ip, request.headers['user-agent'], true);
      setSessionCookie(reply, session.token, session.expiresAt);

      const redirectTo = isAllowedRedirect(stateData.redirect)
        ? stateData.redirect
        : env.allowedRedirectOrigins[0];

      return reply.redirect(redirectTo);
    } catch (err) {
      app.log.error(err);
      return reply.redirect(`${env.loginPageUrl}?error=google_failed`);
    }
  });

  // --- Microsoft OAuth ---
  app.get('/auth/microsoft', async (request, reply) => {
    cleanStates();
    const redirect = (request.query as Record<string, string>).redirect ?? env.allowedRedirectOrigins[0];
    const state = generateState();
    oauthStates.set(state, { redirect, createdAt: Date.now() });
    return reply.redirect(buildMicrosoftAuthUrl(state));
  });

  app.get('/auth/microsoft/callback', async (request, reply) => {
    const { code, state, error } = request.query as Record<string, string>;

    if (error) {
      return reply.redirect(`${env.loginPageUrl}?error=ms_denied`);
    }

    const stateData = oauthStates.get(state);
    if (!stateData) {
      return reply.redirect(`${env.loginPageUrl}?error=invalid_state`);
    }
    oauthStates.delete(state);

    try {
      const tokens = await exchangeMicrosoftCode(code);
      const profile = await getMicrosoftUserInfo(tokens.access_token);

      if (!profile.email) {
        return reply.redirect(`${env.loginPageUrl}?error=no_email`);
      }

      const user = await upsertUser('microsoft', profile.id, profile.email, profile.displayName);
      const session = await createSession(user.id, request.ip, request.headers['user-agent'], true);
      setSessionCookie(reply, session.token, session.expiresAt);

      const redirectTo = isAllowedRedirect(stateData.redirect)
        ? stateData.redirect
        : env.allowedRedirectOrigins[0];

      return reply.redirect(redirectTo);
    } catch (err) {
      app.log.error(err);
      return reply.redirect(`${env.loginPageUrl}?error=ms_failed`);
    }
  });

  // --- Magic Link ---
  app.post('/auth/magic/request', async (request, reply) => {
    const body = request.body as { email?: string; redirect?: string; rememberMe?: boolean };
    const email = body.email?.trim().toLowerCase() ?? '';
    const redirect = body.redirect ?? env.allowedRedirectOrigins[0];
    const rememberMe = body.rememberMe ?? false;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      reply.code(400);
      return { error: 'Invalid email address' };
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo  = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [hourCount, dayCount] = await Promise.all([
      prisma.magicLink.count({ where: { email, createdAt: { gt: oneHourAgo } } }),
      prisma.magicLink.count({ where: { email, createdAt: { gt: oneDayAgo } } }),
    ]);

    if (hourCount < 3 && dayCount < 10) {
      try {
        const token = await createMagicLink(email, redirect, rememberMe);
        await sendMagicLinkEmail(email, token);
      } catch (err) {
        app.log.error(err);
      }
    }

    // Always return the same response to avoid email enumeration
    return { ok: true, message: 'If an account exists, a login link was sent.' };
  });

  app.get('/auth/magic/verify', async (request, reply) => {
    const { token } = request.query as Record<string, string>;

    if (!token) {
      return reply.redirect(`${env.loginPageUrl}?error=missing_token`);
    }

    const link = await verifyMagicLink(token);
    if (!link) {
      return reply.redirect(`${env.loginPageUrl}?error=invalid_or_expired_token`);
    }

    let user = link.userId
      ? await prisma.user.findUnique({ where: { id: link.userId } })
      : null;

    if (!user) {
      user = await prisma.user.findUnique({ where: { email: link.email } });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: link.email,
          role: env.adminEmails.includes(link.email) ? 'ADMIN' : 'USER'
        }
      });
    }

    const session = await createSession(user.id, request.ip, request.headers['user-agent'], link.rememberMe);
    setSessionCookie(reply, session.token, session.expiresAt);

    const redirectTo = isAllowedRedirect(link.redirect)
      ? link.redirect
      : env.allowedRedirectOrigins[0];

    return reply.redirect(redirectTo);
  });

  // --- Logout ---
  app.post('/auth/logout', async (request, reply) => {
    const token = request.cookies[COOKIE_NAME];
    await deleteSession(token);
    clearSessionCookie(reply);
    reply.code(204).send();
  });
};

export default authRoutes;
