export const API_URL = import.meta.env.VITE_API_URL || "/api";
export const SAFE_RUNNER_URL =
  import.meta.env.VITE_SAFE_RUNNER_URL || "/runner";

export type Session = {
  id: string;
  title: string;
  attached_collections: string[];
  dangerous_mode: boolean;
  updated_at: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  created_at?: string;
  retrieval_refs?: any;
};

export async function listSessions(): Promise<Session[]> {
  const res = await fetch(`${API_URL}/sessions`);
  return await res.json();
}

export async function createSession(title?: string): Promise<Session> {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return await res.json();
}

export async function getSession(id: string): Promise<{ session: Session; messages: Message[] }> {
  const res = await fetch(`${API_URL}/sessions/${id}`);
  return await res.json();
}

export async function triggerRebuildIndex(): Promise<any> {
  const res = await fetch(`${API_URL}/index/rebuild`, { method: "POST" });
  return await res.json();
}

async function streamSse(
  url: string,
  options: RequestInit,
  onEvent: (event: string, data: any) => void
) {
  const res = await fetch(url, options);
  if (!res.ok || !res.body) {
    throw new Error(`stream failed: ${res.status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const lines = raw.split("\n");
      let event = "message";
      let dataStr = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        if (line.startsWith("data:")) dataStr += line.slice(5).trim();
      }
      if (!dataStr) continue;
      try {
        onEvent(event, JSON.parse(dataStr));
      } catch {
        onEvent(event, dataStr);
      }
    }
  }
}

export async function streamAssistant(
  sessionId: string,
  content: string,
  handlers: {
    onRetrieval?: (chunks: any[]) => void;
    onDelta: (token: string) => void;
    onDone: () => void;
    onError: (message: string) => void;
  }
) {
  await streamSse(
    `${API_URL}/sessions/${sessionId}/messages`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content }),
    },
    (event, data) => {
      if (event === "retrieval") handlers.onRetrieval?.(data.chunks || []);
      else if (event === "delta") handlers.onDelta(data.token || "");
      else if (event === "error") handlers.onError(data.message || "error");
      else if (event === "done") handlers.onDone();
    }
  );
}

export async function startSafeJob(sessionId: string, command: string, cwd?: string) {
  const res = await fetch(`${API_URL}/jobs/safe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId, command, cwd }),
  });
  if (!res.ok) throw new Error(`job create failed: ${res.status}`);
  return (await res.json()) as { jobId: string; token: string };
}

export async function streamSafeJob(
  token: string,
  handlers: {
    onStdout?: (text: string) => void;
    onStderr?: (text: string) => void;
    onDone?: (exitCode: number | null) => void;
    onError?: (message: string) => void;
  }
) {
  await streamSse(
    `${SAFE_RUNNER_URL}/run`,
    {
      method: "POST",
      headers: {
        "x-job-token": token,
      },
    },
    (event, data) => {
      if (event === "stdout") handlers.onStdout?.(data.text || "");
      else if (event === "stderr") handlers.onStderr?.(data.text || "");
      else if (event === "done") handlers.onDone?.(data.exitCode ?? null);
      else if (event === "error") handlers.onError?.(data.message || "error");
    }
  );
}
