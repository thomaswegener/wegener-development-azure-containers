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
  port: parseNumber(process.env.PORT, 3010),
  databaseUrl: requireEnv('DATABASE_URL'),
  cookieSecret: requireEnv('COOKIE_SECRET'),
  cookieDomain: process.env.COOKIE_DOMAIN ?? '.wegener.no',
  sessionTtlDays: parseNumber(process.env.SESSION_TTL_DAYS, 30),
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? 'http://localhost:3010',
  allowedRedirectOrigins: (process.env.ALLOWED_REDIRECT_ORIGINS ?? 'http://localhost:5173').split(',').map(s => s.trim()),
  adminEmails: (process.env.ADMIN_EMAIL ?? 'thomas@wegener.no').split(',').map(s => s.trim()),
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  microsoftClientId: process.env.MICROSOFT_CLIENT_ID ?? '',
  microsoftClientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
  microsoftTenantId: process.env.MICROSOFT_TENANT_ID ?? 'common',
  smtpHost: process.env.SMTP_HOST ?? 'smtp.domeneshop.no',
  smtpPort: parseNumber(process.env.SMTP_PORT, 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  smtpFrom: process.env.SMTP_FROM ?? 'noreply@wegener.no',
  loginPageUrl: process.env.LOGIN_PAGE_URL ?? 'https://auth.wegener.no/login'
};
