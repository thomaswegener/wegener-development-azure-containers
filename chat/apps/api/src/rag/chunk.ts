export type Chunk = { heading: string | null; content: string };

export function chunkMarkdown(markdown: string, maxChars = 800): Chunk[] {
  const lines = markdown.split(/\r?\n/);
  const chunks: Chunk[] = [];
  let currentHeading: string | null = null;
  let buffer: string[] = [];

  function flush() {
    if (buffer.length === 0) return;
    const text = buffer.join("\n").trim();
    if (!text) return;
    for (let i = 0; i < text.length; i += maxChars) {
      chunks.push({
        heading: currentHeading,
        content: text.slice(i, i + maxChars),
      });
    }
    buffer = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#+)\s+(.*)$/);
    if (headingMatch) {
      flush();
      currentHeading = headingMatch[2].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();
  return chunks;
}

