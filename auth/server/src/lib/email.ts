import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import { prisma } from '../db.js';
import { env } from '../env.js';

const transport = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass
  }
});

const MAGIC_LINK_TTL_MINUTES = 15;

const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const createMagicLink = async (email: string, redirect: string, rememberMe = false) => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

  const existing = await prisma.user.findUnique({ where: { email } });

  await prisma.magicLink.create({
    data: {
      email,
      tokenHash,
      redirect,
      expiresAt,
      rememberMe,
      userId: existing?.id ?? null
    }
  });

  return token;
};

export const verifyMagicLink = async (token: string) => {
  const tokenHash = hashToken(token);

  const link = await prisma.magicLink.findUnique({ where: { tokenHash } });
  if (!link) return null;
  if (link.usedAt) return null;
  if (link.expiresAt < new Date()) return null;

  await prisma.magicLink.update({ where: { tokenHash }, data: { usedAt: new Date() } });

  return link;
};

export const sendMagicLinkEmail = async (email: string, token: string) => {
  const url = `${env.publicBaseUrl}/auth/magic/verify?token=${token}`;

  await transport.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: 'Your login link — Wegener Development',
    text: `Click this link to log in (expires in ${MAGIC_LINK_TTL_MINUTES} minutes):\n\n${url}\n\nIf you did not request this, please ignore this email.`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:480px;margin:40px auto;color:#1f2a1f;">
  <h2 style="font-size:22px;margin-bottom:8px;">Log in to Wegener Development</h2>
  <p style="color:#5f6a5f;margin-bottom:24px;">Click the button below to sign in. This link expires in ${MAGIC_LINK_TTL_MINUTES} minutes.</p>
  <a href="${url}" style="display:inline-block;background:#2a93c9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
    Sign in
  </a>
  <p style="margin-top:24px;font-size:13px;color:#5f6a5f;">Or copy this link: <br><code style="word-break:break-all;">${url}</code></p>
  <p style="margin-top:32px;font-size:12px;color:#9aab9a;">If you did not request this email, you can safely ignore it.</p>
</body>
</html>`
  });
};
