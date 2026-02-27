import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  project?: { name: string };
}

export default function Issues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/issues', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setIssues(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = issues.filter(i =>
    !filter || i.status === filter
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Issues</h1>
          <div className="sub">Track bugs and problems</div>
        </div>
        <Link to="/portal/issues/new" className="btn primary">+ Report Issue</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
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
        <div className="empty">No issues found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td><Link to={`/portal/issues/${i.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>{i.title}</Link></td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{i.project?.name ?? '—'}</td>
                  <td><span className={`badge badge-${i.status.toLowerCase()}`}>{i.status.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${i.priority.toLowerCase()}`}>{i.priority}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(i.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
