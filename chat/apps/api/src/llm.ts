import OpenAI from "openai";

let client: OpenAI | null = null;

function getClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (client) return client;
  client = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  return client;
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function* streamChatCompletion(messages: ChatMessage[]): AsyncGenerator<string> {
  const c = getClient();
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  if (!c) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const text = `(no OPENAI_API_KEY set) ${lastUser}`;
    yield text;
    return;
  }

  const stream = await c.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const part of stream) {
    const token = part.choices[0]?.delta?.content;
    if (token) yield token;
  }
}

