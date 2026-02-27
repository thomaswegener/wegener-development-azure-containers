import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ customers: 0, projects: 0, openIssues: 0, submittedFeatures: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/customers', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/projects', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/issues?status=OPEN', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/features?status=SUBMITTED', { credentials: 'include' }).then(r => r.json())
    ]).then(([c, p, i, f]) => {
      setStats({
        customers: Array.isArray(c) ? c.length : 0,
        projects: Array.isArray(p) ? p.length : 0,
        openIssues: Array.isArray(i) ? i.length : 0,
        submittedFeatures: Array.isArray(f) ? f.length : 0
      });
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-num">{stats.customers}</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.projects}</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-num" style={{ color: stats.openIssues > 0 ? 'var(--warning)' : 'var(--primary)' }}>{stats.openIssues}</div>
          <div className="stat-label">Open Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{stats.submittedFeatures}</div>
          <div className="stat-label">New Feature Requests</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        <Link to="/portal/admin/customers" className="card" style={{ textAlign: 'center', padding: 24, display: 'block' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>👥</div>
          <div style={{ fontWeight: 700 }}>Manage Customers</div>
        </Link>
        <Link to="/portal/admin/issues" className="card" style={{ textAlign: 'center', padding: 24, display: 'block' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🐛</div>
          <div style={{ fontWeight: 700 }}>All Issues</div>
        </Link>
        <Link to="/portal/admin/features" className="card" style={{ textAlign: 'center', padding: 24, display: 'block' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⭐</div>
          <div style={{ fontWeight: 700 }}>Feature Requests</div>
        </Link>
        <Link to="/portal/admin/roadmap" className="card" style={{ textAlign: 'center', padding: 24, display: 'block' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🗺️</div>
          <div style={{ fontWeight: 700 }}>Roadmap Editor</div>
        </Link>
      </div>
    </div>
  );
}
