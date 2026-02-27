import React, { useEffect, useState } from 'react';

interface RoadmapEntry {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  targetQuarter: string | null;
  project?: { name: string } | null;
}

const dotClass = (status: string) => {
  if (status === 'done' || status === 'completed') return 'dot-done';
  if (status === 'in_progress') return 'dot-in_progress';
  if (status === 'declined') return 'dot-declined';
  return 'dot-planned';
};

export default function Roadmap() {
  const [entries, setEntries] = useState<RoadmapEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/roadmap', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setEntries(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  // Group by quarter
  const byQuarter: Record<string, RoadmapEntry[]> = {};
  for (const e of entries) {
    const key = e.targetQuarter ?? 'Unscheduled';
    if (!byQuarter[key]) byQuarter[key] = [];
    byQuarter[key].push(e);
  }
  const quarters = Object.keys(byQuarter).sort((a, b) => {
    if (a === 'Unscheduled') return 1;
    if (b === 'Unscheduled') return -1;
    return a.localeCompare(b);
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Roadmap</h1>
          <div className="sub">Quarterly timeline of upcoming and completed work</div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty">No roadmap entries yet.</div>
      ) : (
        quarters.map(q => (
          <div key={q} className="roadmap-quarter">
            <div className="roadmap-quarter-title">{q}</div>
            {byQuarter[q].map(e => (
              <div key={e.id} className="roadmap-entry">
                <div className={`roadmap-dot ${dotClass(e.status)}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{e.title}</div>
                  {e.description && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{e.description}</div>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    {e.category && <span className="badge badge-planned" style={{ fontSize: 10 }}>{e.category}</span>}
                    {e.project && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{e.project.name}</span>}
                  </div>
                </div>
                <span className={`badge badge-${e.status.toLowerCase().replace(' ', '_')}`} style={{ fontSize: 11 }}>
                  {e.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
