import { env } from '../env.js';

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string };
  timestamp?: string;
}

export const sendDiscordNotification = async (
  content: string,
  embeds?: DiscordEmbed[]
) => {
  if (!env.discordWebhookUrl) return;

  try {
    await fetch(env.discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        embeds: embeds ?? [],
        username: 'Wegener Portal'
      })
    });
  } catch (err) {
    console.error('Discord notification failed:', err);
  }
};

export const colors = {
  blue: 0x2a93c9,
  green: 0x2ecc71,
  orange: 0xe67e22,
  red: 0xe74c3c,
  purple: 0x9b59b6,
  grey: 0x95a5a6
};
