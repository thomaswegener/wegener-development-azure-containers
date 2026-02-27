import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { env } from './env.js';
import sessionRoutes from './routes/session.js';
import contactRoutes from './routes/contact.js';
import customerRoutes from './routes/customers.js';
import projectRoutes from './routes/projects.js';
import issueRoutes from './routes/issues.js';
import featureRoutes from './routes/features.js';
import planRoutes from './routes/plans.js';
import roadmapRoutes from './routes/roadmap.js';

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
  timeWindow: '1 minute'
});

app.setErrorHandler((error, _request, reply) => {
  const status = (error as Error & { statusCode?: number }).statusCode ?? 500;
  reply.code(status).send({ error: error.message });
});

await app.register(sessionRoutes);
await app.register(contactRoutes);
await app.register(customerRoutes);
await app.register(projectRoutes);
await app.register(issueRoutes);
await app.register(featureRoutes);
await app.register(planRoutes);
await app.register(roadmapRoutes);

app.get('/api/health', async () => ({ status: 'ok' }));

await app.listen({ port: env.port, host: '0.0.0.0' });
