import type { FastifyPluginAsync } from 'fastify';
import { sendDiscordNotification } from '../lib/discord.js';

const contactRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/contact', async (request, reply) => {
    const body = request.body as {
      name?: string;
      email?: string;
      company?: string;
      phone?: string;
      tier?: string;
      addons?: string;
      budget?: string;
      timeline?: string;
      message?: string;
      lang?: string;
    };

    if (!body.name || !body.email) {
      reply.code(400);
      return { error: 'Name and email required' };
    }

    const lines = [
      `New contact request from wegener.no (${(body.lang ?? 'en').toUpperCase()})`,
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      body.company ? `Company: ${body.company}` : null,
      body.phone ? `Phone: ${body.phone}` : null,
      body.tier ? `Tier: ${body.tier}` : null,
      body.addons ? `Add-ons: ${body.addons}` : null,
      body.budget ? `Budget: ${body.budget}` : null,
      body.timeline ? `Timeline: ${body.timeline}` : null,
      body.message ? `Message: ${body.message}` : null
    ].filter(Boolean).join('\n');

    await sendDiscordNotification(lines);

    return { ok: true };
  });
};

export default contactRoutes;
