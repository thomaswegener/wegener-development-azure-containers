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

export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const c = getClient();
  if (!c) return null;
  const model = process.env.EMBEDDING_MODEL || "text-embedding-3-small";
  const res = await c.embeddings.create({ model, input: texts });
  return res.data.map((d) => d.embedding);
}

export async function embedQuery(text: string): Promise<number[] | null> {
  const vectors = await embedTexts([text]);
  return vectors ? vectors[0] : null;
}

