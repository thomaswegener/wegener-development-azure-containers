import React, { useEffect, useState } from 'react';

interface RoadmapEntry {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  targetQuarter: string | null;
  projectId: string | null;
  project?: { name: string } | null;
}

interface Project { id: string; name: string; }

export default function AdminRoadmap() {
  const [entries, setEntries] = useState<RoadmapEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', status: 'planned',
    targetQuarter: '', projectId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    Promise.all([
      fetch('/api/roadmap', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/projects', { credentials: 'include' }).then(r => r.json())
    ]).then(([r, p]) => {
      setEntries(Array.isArray(r) ? r : []);
      setProjects(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    await fetch('/api/roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...form,
        projectId: form.projectId || null,
        targetQuarter: form.targetQuarter || null,
        category: form.category || null,
        description: form.description || null
      })
    });
    setForm({ title: '', description: '', category: '', status: 'planned', targetQuarter: '', projectId: '' });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/roadmap/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this roadmap entry?')) return;
    await fetch(`/api/roadmap/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Roadmap Editor</h1>
          <div className="sub">Create and manage quarterly roadmap entries</div>
        </div>
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>+ Add Entry</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20, maxWidth: 600 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>New Roadmap Entry</h2>
          <form onSubmit={create}>
            <div className="form-field">
              <label>Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-field">
                <label>Target Quarter</label>
                <input type="text" placeholder="2026-Q2" value={form.targetQuarter} onChange={e => setForm(f => ({ ...f, targetQuarter: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div className="form-field">
                <label>Category</label>
                <input type="text" placeholder="Infrastructure, Design…" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Project (optional)</label>
                <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}>
                  <option value="">Global (visible to all)</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn primary" disabled={submitting}>Add Entry</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="loading">Loading…</div> : entries.length === 0 ? (
        <div className="empty">No roadmap entries yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Quarter</th>
                <th>Status</th>
                <th>Category</th>
                <th>Project</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{e.targetQuarter ?? 'Unscheduled'}</td>
                  <td>
                    <select
                      value={e.status}
                      onChange={ev => updateStatus(e.id, ev.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, fontFamily: 'inherit' }}
                    >
                      {['planned','in_progress','done','declined'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{e.category ?? '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{e.project?.name ?? 'Global'}</td>
                  <td>
                    <button className="btn danger" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => del(e.id)}>Delete</button>
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
