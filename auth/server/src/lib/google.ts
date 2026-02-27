import crypto from 'node:crypto';
import { env } from '../env.js';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export const buildGoogleAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: `${env.publicBaseUrl}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account'
  });
  return `${GOOGLE_AUTH_URL}?${params}`;
};

export const exchangeGoogleCode = async (code: string) => {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      redirect_uri: `${env.publicBaseUrl}/auth/google/callback`,
      grant_type: 'authorization_code'
    })
  });
  if (!res.ok) throw new Error('Google token exchange failed');
  return res.json() as Promise<{ access_token: string; id_token: string }>;
};

export const getGoogleUserInfo = async (accessToken: string) => {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Google userinfo fetch failed');
  return res.json() as Promise<{
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
  }>;
};

export const generateState = () => crypto.randomBytes(16).toString('hex');
