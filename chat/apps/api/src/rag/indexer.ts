import { ulid } from "ulid";
import { exec, query } from "../db.js";
import { listNotes, readNote } from "../notesClient.js";
import { chunkMarkdown } from "./chunk.js";
import { embedTexts } from "./embeddings.js";

type NoteMeta = Awaited<ReturnType<typeof listNotes>>[number];

async function upsertNote(note: NoteMeta): Promise<void> {
  const markdown = await readNote(note.path);
  const chunks = chunkMarkdown(markdown);
  const embeddings = await embedTexts(chunks.map((c) => c.content));

  await exec(
    `DELETE FROM documents WHERE source='obsidian' AND path=$1`,
    [note.path]
  );

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const embedding = embeddings ? embeddings[i] : null;
    const embeddingLiteral = embedding ? `[${embedding.join(",")}]` : null;
    await exec(
      `
      INSERT INTO documents
        (id, collection, source, path, chunk_index, heading, content, embedding, mtime)
      VALUES
        ($1, 'obsidian', 'obsidian', $2, $3, $4, $5, $6, $7)
      `,
      [
        ulid(),
        note.path,
        i,
        c.heading,
        c.content,
        embeddingLiteral,
        note.mtime,
      ]
    );
  }
}

export async function rebuildObsidianIndex(): Promise<{ notes: number; chunks: number }> {
  const notes = (await listNotes()).filter((n) =>
    n.path.toLowerCase().endsWith(".md")
  );
  await exec(`DELETE FROM documents WHERE source='obsidian'`);
  let chunkCount = 0;
  for (const note of notes) {
    await upsertNote(note);
    const res = await query<{ count: string }>(
      `SELECT count(*) FROM documents WHERE source='obsidian' AND path=$1`,
      [note.path]
    );
    chunkCount += Number(res[0]?.count ?? 0);
  }
  return { notes: notes.length, chunks: chunkCount };
}

export async function indexChangedNotes(paths: string[]): Promise<{ notes: number }> {
  const allNotes = (await listNotes()).filter((n) =>
    n.path.toLowerCase().endsWith(".md")
  );
  const noteMap = new Map(allNotes.map((n) => [n.path, n]));
  let count = 0;
  for (const p of paths) {
    const note = noteMap.get(p);
    if (!note) continue;
    await upsertNote(note);
    count++;
  }
  return { notes: count };
}
