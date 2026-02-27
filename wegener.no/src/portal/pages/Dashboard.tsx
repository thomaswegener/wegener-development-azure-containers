import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Project {
  id: string;
  name: string;
  status: string;
  tier: string | null;
  websiteUrl: string | null;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

const statusBadge = (s: string) => (
  <span className={`badge badge-${s.toLowerCase()}`}>{s.replace('_', ' ')}</span>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/issues?status=OPEN', { credentials: 'include' }).then(r => r.json())
    ]).then(([p, i]) => {
      setProjects(Array.isArray(p) ? p : []);
      setIssues(Array.isArray(i) ? i.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}</h1>
          <div className="sub">{user?.customer?.companyName ?? 'Your dashboard'}</div>
        </div>
        <Link to="/portal/issues/new" className="btn primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Report Issue
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{projects.length}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{issues.length}</div>
          <div className="stat-label">Open Issues</div>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Your Projects</h2>
          {projects.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                {p.tier && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.tier}</div>}
              </div>
              {statusBadge(p.status)}
              {p.websiteUrl && (
                <a href={p.websiteUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)' }}>
                  Visit →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700 }}>Recent Open Issues</h2>
            <Link to="/portal/issues" style={{ fontSize: 13, color: 'var(--primary)' }}>View all →</Link>
          </div>
          {issues.map(issue => (
            <div key={issue.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <Link to={`/portal/issues/${issue.id}`} style={{ fontWeight: 500 }}>{issue.title}</Link>
              </div>
              {statusBadge(issue.priority)}
            </div>
          ))}
        </div>
      )}

      {issues.length === 0 && projects.length === 0 && (
        <div className="card">
          <div className="empty">No data yet. Your projects and issues will appear here.</div>
        </div>
      )}
    </div>
  );
}
