import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Project { id: string; name: string; }

export default function NewIssue() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ projectId: '', title: '', description: '', priority: 'MEDIUM' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/projects', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const ps = Array.isArray(d) ? d : [];
        setProjects(ps);
        if (ps.length === 1) setForm(f => ({ ...f, projectId: ps[0].id }));
      });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) { setError('Project and title are required.'); return; }
    setSubmitting(true);
    const res = await fetch('/api/issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      navigate(`/portal/issues/${data.id}`);
    } else {
      setError('Failed to submit issue.');
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Report an Issue</h1>
          <div className="sub">Describe the problem you're experiencing</div>
        </div>
        <Link to="/portal/issues" className="btn">Cancel</Link>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={submit}>
          {error && <div style={{ color: 'var(--danger)', marginBottom: 14, fontSize: 13 }}>{error}</div>}
          {projects.length > 1 && (
            <div className="form-field">
              <label>Project</label>
              <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}>
                <option value="">Select project…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div className="form-field">
            <label>Title</label>
            <input type="text" placeholder="Brief summary of the issue" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea placeholder="Steps to reproduce, what you expected vs what happened…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-field">
            <label>Priority</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
}
