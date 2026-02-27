import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  githubIssueNumber: number | null;
  githubIssueUrl: string | null;
  createdAt: string;
  project: { name: string; customer?: { companyName: string | null } };
}

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => {
    fetch('/api/issues', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setIssues(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/issues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    load();
  };

  const createGithub = async (id: string) => {
    await fetch(`/api/issues/${id}/github`, { method: 'POST', credentials: 'include' });
    load();
  };

  const filtered = issues.filter(i => !filter || i.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>All Issues</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(s => (
          <button key={s} className="btn" style={{ padding: '6px 14px', fontSize: 12, background: filter === s ? 'var(--primary)' : undefined, color: filter === s ? '#fff' : undefined, borderColor: filter === s ? 'transparent' : undefined }} onClick={() => setFilter(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">Loading…</div> : filtered.length === 0 ? (
        <div className="empty">No issues found.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Priority</th>
                <th>GitHub</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id}>
                  <td>
                    <Link to={`/portal/issues/${i.id}`} style={{ fontWeight: 500, color: 'var(--primary)' }}>{i.title}</Link>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{i.project.name}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{i.project.customer?.companyName ?? '—'}</td>
                  <td>
                    <select
                      value={i.status}
                      onChange={e => updateStatus(i.id, e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
                    >
                      {['OPEN','IN_PROGRESS','RESOLVED','CLOSED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><span className={`badge badge-${i.priority.toLowerCase()}`}>{i.priority}</span></td>
                  <td>
                    {i.githubIssueNumber
                      ? <a href={i.githubIssueUrl!} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)' }}>#{i.githubIssueNumber}</a>
                      : <button className="btn" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => createGithub(i.id)}>Create</button>
                    }
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(i.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
