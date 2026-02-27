import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import staticPlugin from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/session.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: env.allowedRedirectOrigins,
  credentials: true
});

await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"]
    }
  }
});

await app.register(cookie, {
  secret: env.cookieSecret
});

await app.register(rateLimit, {
  max: 60,
  timeWindow: '1 minute',
  keyGenerator: (request) => {
    const forwarded = request.headers['x-forwarded-for'];
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0].trim()) ?? request.ip;
  }
});

// Serve the login SPA and admin SPA static files
const webDist = path.resolve(__dirname, '../../web/dist');
await app.register(staticPlugin, {
  root: webDist,
  wildcard: false,
  decorateReply: true
});

// SPA fallback for /login and /admin routes
app.get('/login', async (_request, reply) => {
  return reply.sendFile('login/index.html', webDist);
});

app.get('/admin', async (_request, reply) => {
  return reply.sendFile('admin/index.html', webDist);
});

app.get('/admin/*', async (_request, reply) => {
  return reply.sendFile('admin/index.html', webDist);
});

app.setErrorHandler((error, _request, reply) => {
  const status = (error as Error & { statusCode?: number }).statusCode ?? 500;
  reply.code(status).send({ error: error.message });
});

await app.register(authRoutes);
await app.register(sessionRoutes);
await app.register(adminRoutes);

app.get('/api/health', async () => ({ status: 'ok' }));

await app.listen({ port: env.port, host: '0.0.0.0' });
