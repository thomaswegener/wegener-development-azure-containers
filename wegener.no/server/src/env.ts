import 'dotenv/config';

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env: ${key}`);
  return value;
};

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 3011),
  databaseUrl: requireEnv('DATABASE_URL'),
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? 'http://localhost:3010',
  cookieSecret: process.env.COOKIE_SECRET ?? 'dev-secret',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL ?? '',
  githubToken: process.env.GITHUB_TOKEN ?? '',
  githubOwner: process.env.GITHUB_OWNER ?? '',
  githubRepo: process.env.GITHUB_REPO ?? ''
};
