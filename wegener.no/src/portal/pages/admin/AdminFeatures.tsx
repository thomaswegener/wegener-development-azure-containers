import React, { useEffect, useState } from 'react';

interface Feature {
  id: string;
  title: string;
  status: string;
  priority: string;
  votes: number;
  githubIssueNumber: number | null;
  githubIssueUrl: string | null;
  createdAt: string;
  project: { name: string; customer?: { companyName: string | null } };
}

export default function AdminFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    fetch('/api/features', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setFeatures(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/features/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    load();
  };

  const createGithub = async (id: string) => {
    await fetch(`/api/features/${id}/github`, { method: 'POST', credentials: 'include' });
    load();
  };

  const filtered = features.filter(f => !filter || f.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>All Feature Requests</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['', 'SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'DONE', 'DECLINED'].map(s => (
          <button key={s} className="btn" style={{ padding: '6px 14px', fontSize: 12, background: filter === s ? 'var(--primary)' : undefined, color: filter === s ? '#fff' : undefined, borderColor: filter === s ? 'transparent' : undefined }} onClick={() => setFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading…</div> : filtered.length === 0 ? (
        <div className="empty">No feature requests found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Votes</th>
                <th>GitHub</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{f.project.name}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{f.project.customer?.companyName ?? '—'}</td>
                  <td>
                    <select
                      value={f.status}
                      onChange={e => updateStatus(f.id, e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
                    >
                      {['SUBMITTED','UNDER_REVIEW','PLANNED','IN_PROGRESS','DONE','DECLINED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><span className={`badge badge-${f.priority.toLowerCase()}`}>{f.priority}</span></td>
                  <td style={{ fontWeight: 600 }}>{f.votes}</td>
                  <td>
                    {f.githubIssueNumber
                      ? <a href={f.githubIssueUrl!} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)' }}>#{f.githubIssueNumber}</a>
                      : <button className="btn" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => createGithub(f.id)}>Create</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
