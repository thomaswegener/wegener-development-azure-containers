import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  githubIssueNumber: number | null;
  githubIssueUrl: string | null;
  createdAt: string;
  project: { name: string };
  comments: Array<{
    id: string;
    content: string;
    authorUserId: string;
    visibility: string;
    createdAt: string;
  }>;
}

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch(`/api/issues/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setIssue)
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const addComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await fetch(`/api/issues/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: comment })
    });
    setComment('');
    setSubmitting(false);
    load();
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (!issue) return <div className="empty">Issue not found.</div>;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/portal/issues" style={{ fontSize: 13, color: 'var(--primary)' }}>← Back to Issues</Link>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{issue.title}</h1>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{issue.project.name} · {new Date(issue.createdAt).toLocaleDateString()}</div>
          </div>
          <span className={`badge badge-${issue.status.toLowerCase()}`}>{issue.status.replace('_', ' ')}</span>
          <span className={`badge badge-${issue.priority.toLowerCase()}`}>{issue.priority}</span>
        </div>
        {issue.description && (
          <p style={{ lineHeight: 1.7, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{issue.description}</p>
        )}
        {issue.githubIssueUrl && (
          <div style={{ marginTop: 12 }}>
            <a href={issue.githubIssueUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--primary)' }}>
              GitHub #{issue.githubIssueNumber} →
            </a>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Discussion</h2>
        {issue.comments.map(c => (
          <div key={c.id} className={`comment ${c.visibility === 'INTERNAL' ? 'comment-internal' : ''}`}>
            <div className="comment-meta">
              {c.visibility === 'INTERNAL' && <span style={{ color: 'var(--warning)', marginRight: 6 }}>Internal note ·</span>}
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div className="comment-content">{c.content}</div>
          </div>
        ))}
        {issue.comments.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>No comments yet.</div>}

        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 9, fontFamily: 'inherit', fontSize: 14, marginBottom: 10, resize: 'vertical' }}
          />
          <button className="btn primary" onClick={addComment} disabled={submitting}>
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
