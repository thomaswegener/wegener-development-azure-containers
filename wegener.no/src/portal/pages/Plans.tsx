import React, { useEffect, useState } from 'react';

interface Plan {
  id: string;
  title: string;
  content: string;
  phase: string | null;
  order: number;
  project: { id: string; name: string };
}

// Very simple markdown renderer — headings, bold, lists, code
function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const html: string[] = [];
  for (const line of lines) {
    if (line.startsWith('## ')) html.push(`<h2>${line.slice(3)}</h2>`);
    else if (line.startsWith('### ')) html.push(`<h3>${line.slice(4)}</h3>`);
    else if (line.startsWith('# ')) html.push(`<h2>${line.slice(2)}</h2>`);
    else if (line.startsWith('- ') || line.startsWith('* ')) html.push(`<li>${line.slice(2)}</li>`);
    else if (line.trim() === '') html.push('<br/>');
    else html.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>')}</p>`);
  }
  return html.join('');
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);

  useEffect(() => {
    fetch('/api/plans', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const ps = Array.isArray(d) ? d : [];
        setPlans(ps);
        if (ps.length > 0) setSelected(ps[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Plans</h1>
          <div className="sub">Phase-by-phase project roadmaps and plans</div>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="empty">No published plans yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
          <div>
            {plans.map(p => (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                style={{
                  padding: '10px 14px', cursor: 'pointer', borderRadius: 10,
                  background: selected?.id === p.id ? 'rgba(42,147,201,0.1)' : 'transparent',
                  color: selected?.id === p.id ? 'var(--primary-dark)' : 'var(--text)',
                  marginBottom: 4, fontSize: 13
                }}
              >
                {p.phase && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>{p.phase}</div>}
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{p.project.name}</div>
              </div>
            ))}
          </div>
          <div className="card">
            {selected ? (
              <>
                <div style={{ marginBottom: 4, fontSize: 11, color: 'var(--muted)' }}>{selected.phase} · {selected.project.name}</div>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>{selected.title}</h2>
                <div
                  className="plan-content"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selected.content) }}
                />
              </>
            ) : (
              <div className="empty">Select a plan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
