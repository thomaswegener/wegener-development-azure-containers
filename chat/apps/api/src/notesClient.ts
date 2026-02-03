const notesUrl = process.env.NOTES_SERVICE_URL;

export type NoteMeta = {
  path: string;
  mtime: string;
  size: number;
};

export async function listNotes(): Promise<NoteMeta[]> {
  if (!notesUrl) throw new Error("NOTES_SERVICE_URL not set");
  const res = await fetch(`${notesUrl}/vault?recursive=true`);
  if (!res.ok) throw new Error(`Notes list failed: ${res.status}`);
  return (await res.json()) as NoteMeta[];
}

export async function readNote(path: string): Promise<string> {
  if (!notesUrl) throw new Error("NOTES_SERVICE_URL not set");
  const res = await fetch(`${notesUrl}/note/${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`Notes read failed: ${res.status}`);
  return await res.text();
}

