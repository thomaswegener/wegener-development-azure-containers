import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'node:path';
import { env } from './env.js';
import { getSession, sessionCookieName } from './lib/session.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import partnerRoutes from './routes/partners.js';
import activityRoutes from './routes/activities.js';
import storeRoutes from './routes/stores.js';
import articleRoutes from './routes/articles.js';
import conceptRoutes from './routes/concepts.js';
import locationRoutes from './routes/locations.js';
import infoRoutes from './routes/info.js';
import mediaRoutes from './routes/media.js';
import faqRoutes from './routes/faqs.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: [env.corsOrigin],
  credentials: true
});

await app.register(helmet);

await app.register(cookie, {
  secret: env.cookieSecret
});

await app.register(rateLimit, {
  max: 120,
  timeWindow: '1 minute',
  allowList: (request) => request.url.startsWith('/uploads/')
});

await app.register(multipart, {
  limits: {
    fileSize: env.maxUploadMb * 1024 * 1024
  }
});

await app.register(staticPlugin, {
  root: path.resolve(env.uploadDir),
  prefix: '/uploads/'
});

app.addHook('preHandler', async (request) => {
  const token = request.cookies[sessionCookieName];
  const session = await getSession(token);
  if (session) {
    request.session = session;
  }
});

app.setErrorHandler((error, _request, reply) => {
  const status = (error as Error & { statusCode?: number }).statusCode ?? 500;
  reply.code(status).send({ error: error.message });
});

await app.register(authRoutes, { prefix: '/api' });
await app.register(userRoutes, { prefix: '/api' });
await app.register(partnerRoutes, { prefix: '/api' });
await app.register(activityRoutes, { prefix: '/api' });
await app.register(storeRoutes, { prefix: '/api' });
await app.register(articleRoutes, { prefix: '/api' });
await app.register(conceptRoutes, { prefix: '/api' });
await app.register(locationRoutes, { prefix: '/api' });
await app.register(infoRoutes, { prefix: '/api' });
await app.register(mediaRoutes, { prefix: '/api' });
await app.register(faqRoutes, { prefix: '/api' });

app.get('/api/health', async () => ({ status: 'ok' }));

await app.listen({ port: env.port, host: '0.0.0.0' });
