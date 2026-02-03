import { query } from "../db.js";
import { embedQuery } from "./embeddings.js";

export type RetrievedChunk = {
  path: string;
  heading: string | null;
  content: string;
  score: number;
};

function vectorLiteral(v: number[]): string {
  return `[${v.join(",")}]`;
}

export async function retrieveRelevantChunks(
  queryText: string,
  collections: string[],
  topK = 6
): Promise<RetrievedChunk[]> {
  const vector = await embedQuery(queryText);
  if (vector) {
    const rows = await query<RetrievedChunk>(
      `
      SELECT path, heading, content,
        1 - (embedding <=> $1::vector) AS score
      FROM documents
      WHERE collection = ANY($2)
        AND embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $3
      `,
      [vectorLiteral(vector), collections, topK]
    );
    return rows;
  }

  const rows = await query<RetrievedChunk>(
    `
    SELECT path, heading, content, 0 AS score
    FROM documents
    WHERE collection = ANY($1)
      AND content ILIKE '%' || $2 || '%'
    LIMIT $3
    `,
    [collections, queryText, topK]
  );
  return rows;
}
