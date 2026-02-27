import React, { useEffect, useState } from 'react';

interface Customer {
  id: string;
  authUserId: string;
  companyName: string | null;
  createdAt: string;
  _count?: { projects: number };
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ authUserId: '', companyName: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch('/api/customers', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setCustomers(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authUserId) return;
    setSubmitting(true);
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    });
    setForm({ authUserId: '', companyName: '' });
    setShowForm(false);
    setSubmitting(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this customer and all their data?')) return;
    await fetch(`/api/customers/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <div className="sub">Manage customer accounts and projects</div>
        </div>
        <button className="btn primary" onClick={() => setShowForm(!showForm)}>+ New Customer</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 16, maxWidth: 500 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Create Customer</h2>
          <form onSubmit={create}>
            <div className="form-field">
              <label>Auth User ID</label>
              <input type="text" placeholder="UUID from auth service" value={form.authUserId} onChange={e => setForm(f => ({ ...f, authUserId: e.target.value }))} required />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Find the user ID in auth.wegener.no/admin, then grant portal access there too.</div>
            </div>
            <div className="form-field">
              <label>Company Name</label>
              <input type="text" placeholder="Acme Corp" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn primary" disabled={submitting}>Create</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading…</div>
      ) : customers.length === 0 ? (
        <div className="empty">No customers yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Auth User ID</th>
                <th>Projects</th>
                <th>Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.companyName ?? <span style={{ color: 'var(--muted)' }}>No name</span>}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--muted)' }}>{c.authUserId.slice(0, 8)}…</td>
                  <td>{c._count?.projects ?? 0}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn danger" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => del(c.id)}>Delete</button>
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
