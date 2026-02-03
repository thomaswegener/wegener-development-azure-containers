import { useEffect, useMemo, useRef, useState } from "react";
import {
  createSession,
  getSession,
  listSessions,
  startSafeJob,
  streamAssistant,
  streamSafeJob,
  triggerRebuildIndex,
  type Message,
  type Session,
} from "./api";
import { formatTime } from "./utils";
import TerminalTab from "./TerminalTab";

type UiMessage = Message & { retrievalChunks?: any[] };

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [commandInput, setCommandInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);
  const sendInFlightRef = useRef(false);
  const runInFlightRef = useRef(false);
  const [activeTab, setActiveTab] = useState<"chat" | "terminal">("chat");

  async function refreshSessions() {
    const s = await listSessions();
    setSessions(s);
    if (!activeSessionId && s[0]) setActiveSessionId(s[0].id);
  }

  useEffect(() => {
    refreshSessions().catch(console.error);
    const id = setInterval(refreshSessions, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!activeSessionId) return;
    getSession(activeSessionId)
      .then((data) => setMessages(data.messages as UiMessage[]))
      .catch(console.error);
  }, [activeSessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages.length]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );

  async function onNewSession() {
    const s = await createSession();
    await refreshSessions();
    setActiveSessionId(s.id);
    setMessages([]);
  }

  async function onSend() {
    if (!activeSessionId || !input.trim() || loading) return;
    if (sendInFlightRef.current) return;
    sendInFlightRef.current = true;
    const userText = input.trim();
    setInput("");
    setLoading(true);

    const assistantLocalId = `local-assistant-${Date.now()}`;
    const userMsg: UiMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      content: userText,
    };
    const assistantMsg: UiMessage = {
      id: assistantLocalId,
      role: "assistant",
      content: "",
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);

    try {
      await streamAssistant(activeSessionId, userText, {
        onRetrieval: (chunks) => {
          setMessages((m) =>
            m.map((msg) => (msg.id === assistantLocalId ? { ...msg, retrievalChunks: chunks } : msg))
          );
        },
        onDelta: (token) => {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === assistantLocalId ? { ...msg, content: msg.content + token } : msg
            )
          );
        },
        onDone: () => setLoading(false),
        onError: (message) => {
          setLoading(false);
          setMessages((m) => [
            ...m,
            { id: `err-${Date.now()}`, role: "tool", content: `Error: ${message}` },
          ]);
        },
      });
    } finally {
      setLoading(false);
      sendInFlightRef.current = false;
      refreshSessions().catch(console.error);
    }
  }

  async function onRunCommand() {
    if (!activeSessionId || !commandInput.trim()) return;
    if (runInFlightRef.current) return;
    runInFlightRef.current = true;
    const cmd = commandInput.trim();
    setCommandInput("");
    const toolLocalId = `local-tool-${Date.now()}`;
    const toolMsg: UiMessage = {
      id: toolLocalId,
      role: "tool",
      content: `> ${cmd}\n`,
    };
    setMessages((m) => [...m, toolMsg]);

    try {
      const { token } = await startSafeJob(activeSessionId, cmd);
      await streamSafeJob(token, {
        onStdout: (t) =>
          setMessages((m) =>
            m.map((msg) => (msg.id === toolLocalId ? { ...msg, content: msg.content + t } : msg))
          ),
        onStderr: (t) =>
          setMessages((m) =>
            m.map((msg) => (msg.id === toolLocalId ? { ...msg, content: msg.content + t } : msg))
          ),
        onDone: (code) =>
          setMessages((m) =>
            m.map((msg) =>
              msg.id === toolLocalId ? { ...msg, content: msg.content + `\n(exit ${code})\n` } : msg
            )
          ),
      });
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: "tool", content: `Job error: ${e.message}` },
      ]);
    } finally {
      runInFlightRef.current = false;
    }
  }

  async function onRebuildIndex() {
    setIndexing(true);
    try {
      const res = await triggerRebuildIndex();
      setMessages((m) => [
        ...m,
        {
          id: `idx-${Date.now()}`,
          role: "tool",
          content: `Index rebuilt: ${JSON.stringify(res)}`,
        },
      ]);
    } finally {
      setIndexing(false);
    }
  }

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="app-title">Chat Dev</div>
          <button className="btn btn-primary" onClick={onNewSession}>
            New chat
          </button>
        </div>
        <div className="sidebar-actions">
          <button className="btn" onClick={onRebuildIndex} disabled={indexing}>
            {indexing ? "Indexing..." : "Rebuild index"}
          </button>
        </div>
        <div className="sessions">
          {sessions.map((s) => (
            <button
              key={s.id}
              className={`session-item ${s.id === activeSessionId ? "active" : ""}`}
              onClick={() => {
                setActiveSessionId(s.id);
                if (window.innerWidth <= 900) setSidebarOpen(false);
              }}
            >
              <div className="session-title">{s.title}</div>
              <div className="session-meta">{formatTime(s.updated_at)}</div>
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn btn-ghost" onClick={() => setSidebarOpen((v) => !v)}>
              Menu
            </button>
            <div className="topbar-title">{activeSession?.title || "Chat"}</div>
          </div>
          <div className="tabs" role="tablist" aria-label="Views">
            <button
              className={`tab ${activeTab === "chat" ? "active" : ""}`}
              onClick={() => setActiveTab("chat")}
              role="tab"
              aria-selected={activeTab === "chat"}
              type="button"
            >
              Chat
            </button>
            <button
              className={`tab ${activeTab === "terminal" ? "active" : ""}`}
              onClick={() => setActiveTab("terminal")}
              role="tab"
              aria-selected={activeTab === "terminal"}
              type="button"
            >
              Terminal
            </button>
          </div>
          <div className="topbar-right">
            <span className={`badge ${activeSession?.dangerous_mode ? "" : "safe"}`}>
              {activeSession?.dangerous_mode ? "Dangerous (disabled)" : "Safe"}
            </span>
          </div>
        </header>

        {activeTab === "terminal" ? (
          <TerminalTab sessionId={activeSessionId} />
        ) : (
          <>
            <div className="messages">
              {messages.length === 0 ? (
                <div className="empty">Start a new chat on the left.</div>
              ) : null}
              {messages.map((m) => {
                const rowClass = `message-row ${m.role}`;
                const bubbleClass =
                  m.role === "user"
                    ? "message-bubble user"
                    : m.role === "assistant"
                      ? "message-bubble assistant"
                      : "message-bubble tool";

                return (
                  <div key={m.id} className={rowClass}>
                    <div className={bubbleClass}>
                      {m.content}
                      {m.role === "assistant" && m.retrievalChunks?.length ? (
                        <div className="sources">
                          Sources:
                          <ul>
                            {m.retrievalChunks.map((c: any, i: number) => (
                              <li key={i}>
                                {c.path}
                                {c.heading ? `#${c.heading}` : ""} ({(c.score ?? 0).toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            <div className="composer">
              <details className="tools">
                <summary>Tools (safe commands)</summary>
                <div className="tools-row">
                  <input
                    className="input"
                    placeholder='Run safe command (e.g., codex exec "Input")'
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onRunCommand()}
                  />
                  <button className="btn" onClick={onRunCommand} disabled={runInFlightRef.current}>
                    Run
                  </button>
                </div>
              </details>

              <div className="composer-row">
                <textarea
                  className="textarea"
                  placeholder="Message Chat Dev..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                />
                <button className="btn btn-primary" onClick={onSend} disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
              <div className="hint">Enter to send, Shift+Enter for newline.</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
