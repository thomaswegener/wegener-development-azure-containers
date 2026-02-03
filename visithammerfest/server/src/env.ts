import 'dotenv/config';

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 5170),
  databaseUrl: requireEnv('DATABASE_URL'),
  sessionTtlDays: parseNumber(process.env.SESSION_TTL_DAYS, 30),
  cookieSecret: requireEnv('COOKIE_SECRET'),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:4179',
  uploadDir: process.env.UPLOAD_DIR ?? new URL('../uploads', import.meta.url).pathname,
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? 'http://localhost:5170',
  maxUploadMb: parseNumber(process.env.MAX_UPLOAD_MB, 15),
  azureStorageAccount: process.env.AZURE_STORAGE_ACCOUNT ?? '',
  azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER ?? '',
  azureStorageKey: process.env.AZURE_STORAGE_KEY ?? ''
};
