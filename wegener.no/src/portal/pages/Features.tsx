import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Feature {
  id: string;
  title: string;
  status: string;
  priority: string;
  votes: number;
  createdAt: string;
  project?: { name: string };
}

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/features', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setFeatures(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = features.filter(f => !filter || f.status === filter);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Feature Requests</h1>
          <div className="sub">Submit and track feature ideas</div>
        </div>
        <Link to="/portal/features/new" className="btn primary">+ Request Feature</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', 'SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'DONE', 'DECLINED'].map(s => (
          <button
            key={s}
            className="btn"
            style={{ padding: '6px 14px', fontSize: 12, background: filter === s ? 'var(--primary)' : undefined, color: filter === s ? '#fff' : undefined, borderColor: filter === s ? 'transparent' : undefined }}
            onClick={() => setFilter(s)}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No feature requests found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Votes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.title}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{f.project?.name ?? '—'}</td>
                  <td><span className={`badge badge-${f.status.toLowerCase()}`}>{f.status.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${f.priority.toLowerCase()}`}>{f.priority}</span></td>
                  <td style={{ fontWeight: 600 }}>{f.votes}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
