import { useEffect, useMemo, useRef, useState } from "react";
import { startSafeJob, streamSafeJob } from "./api";

type Props = {
  sessionId: string | null;
};

export default function TerminalTab({ sessionId }: Props) {
  const [command, setCommand] = useState("");
  const [cwd, setCwd] = useState(".");
  const [running, setRunning] = useState(false);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const output = useMemo(() => buffer.join(""), [buffer]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [buffer.length]);

  async function run() {
    if (!sessionId) {
      setBuffer((b) => [...b, "No active session.\n"]);
      return;
    }
    const cmd = command.trim();
    if (!cmd || running) return;

    setRunning(true);
    setCommand("");
    setHistory((h) => (h[0] === cmd ? h : [cmd, ...h]).slice(0, 20));
    setBuffer((b) => [...b, `> ${cmd}\n`]);

    try {
      const { token } = await startSafeJob(sessionId, cmd, cwd);
      await streamSafeJob(token, {
        onStdout: (text) => setBuffer((b) => [...b, text]),
        onStderr: (text) => setBuffer((b) => [...b, text]),
        onDone: (exitCode) =>
          setBuffer((b) => [...b, `\n(exit ${exitCode})\n`]),
        onError: (message) =>
          setBuffer((b) => [...b, `\n(error) ${message}\n`]),
      });
    } catch (e: any) {
      setBuffer((b) => [...b, `\n(error) ${e?.message || "run failed"}\n`]);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-title">Terminal (safe runner)</div>
        <div className="terminal-actions">
          <input
            className="input"
            style={{ width: 200 }}
            value={cwd}
            onChange={(e) => setCwd(e.target.value)}
            placeholder="cwd (relative)"
          />
          <button
            className="btn"
            onClick={() => setBuffer([])}
            disabled={running || buffer.length === 0}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="terminal-body">
        <pre className="terminal-output">{output}</pre>
        <div ref={endRef} />
      </div>

      <div className="terminal-footer">
        <div className="terminal-run">
          <input
            className="input"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder='e.g. rg "TODO" -n .'
            onKeyDown={(e) => e.key === "Enter" && run()}
            disabled={running}
          />
          <button className="btn btn-primary" onClick={run} disabled={running}>
            {running ? "Running..." : "Run"}
          </button>
        </div>

        {history.length ? (
          <div className="terminal-history">
            <div className="hint">History</div>
            <div className="terminal-history-list">
              {history.map((h) => (
                <button
                  key={h}
                  className="terminal-history-item"
                  onClick={() => setCommand(h)}
                  disabled={running}
                  title={h}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

