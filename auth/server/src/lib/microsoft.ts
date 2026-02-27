import crypto from 'node:crypto';
import { env } from '../env.js';

const MS_BASE = `https://login.microsoftonline.com/${env.microsoftTenantId}`;
const MS_AUTH_URL = `${MS_BASE}/oauth2/v2.0/authorize`;
const MS_TOKEN_URL = `${MS_BASE}/oauth2/v2.0/token`;
const MS_USERINFO_URL = 'https://graph.microsoft.com/v1.0/me';

export const buildMicrosoftAuthUrl = (state: string) => {
  const params = new URLSearchParams({
    client_id: env.microsoftClientId,
    redirect_uri: `${env.publicBaseUrl}/auth/microsoft/callback`,
    response_type: 'code',
    scope: 'openid email profile User.Read',
    state,
    prompt: 'select_account'
  });
  return `${MS_AUTH_URL}?${params}`;
};

export const exchangeMicrosoftCode = async (code: string) => {
  const res = await fetch(MS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.microsoftClientId,
      client_secret: env.microsoftClientSecret,
      redirect_uri: `${env.publicBaseUrl}/auth/microsoft/callback`,
      grant_type: 'authorization_code',
      scope: 'openid email profile User.Read'
    })
  });
  if (!res.ok) throw new Error('Microsoft token exchange failed');
  return res.json() as Promise<{ access_token: string }>;
};

export const getMicrosoftUserInfo = async (accessToken: string) => {
  const res = await fetch(MS_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error('Microsoft userinfo fetch failed');
  const data = await res.json() as {
    id: string;
    mail?: string;
    userPrincipalName?: string;
    displayName?: string;
  };
  return {
    id: data.id,
    email: (data.mail ?? data.userPrincipalName ?? '').toLowerCase(),
    displayName: data.displayName
  };
};

export const generateState = () => crypto.randomBytes(16).toString('hex');
