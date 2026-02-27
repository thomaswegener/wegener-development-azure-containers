import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import NewIssue from './pages/NewIssue';
import Features from './pages/Features';
import NewFeature from './pages/NewFeature';
import Plans from './pages/Plans';
import Roadmap from './pages/Roadmap';
import AdminDashboard from './pages/admin/AdminDashboard';
import Customers from './pages/admin/Customers';
import AdminIssues from './pages/admin/AdminIssues';
import AdminFeatures from './pages/admin/AdminFeatures';
import AdminRoadmap from './pages/admin/AdminRoadmap';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const BugIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="13" r="4"/>
    <path d="M12 9V7M4 17H2M22 17h-2M4 13H2M22 13h-2M6.31 19.69L4.9 21.1M19.1 4.9l-1.41 1.41M6.31 4.31L4.9 2.9M19.1 19.1l-1.41-1.41M12 21v2M12 1v2"/>
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/>
    <line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.portalRole === 'admin';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="badge">W</div>
        <div className="name">Wegener Dev</div>
        <div className="sub">Customer Portal</div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-group">
          <div className="nav-label">Overview</div>
          <NavLink to="/portal" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <HomeIcon /> Dashboard
          </NavLink>
        </div>
        <div className="nav-group">
          <div className="nav-label">Support</div>
          <NavLink to="/portal/issues" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <BugIcon /> Issues
          </NavLink>
          <NavLink to="/portal/features" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <StarIcon /> Feature Requests
          </NavLink>
        </div>
        <div className="nav-group">
          <div className="nav-label">Planning</div>
          <NavLink to="/portal/plans" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <FileIcon /> Plans
          </NavLink>
          <NavLink to="/portal/roadmap" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <MapIcon /> Roadmap
          </NavLink>
        </div>
        {isAdmin && (
          <div className="nav-group">
            <div className="nav-label">Admin</div>
            <NavLink to="/portal/admin" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <HomeIcon /> Admin Dashboard
            </NavLink>
            <NavLink to="/portal/admin/customers" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <UsersIcon /> Customers
            </NavLink>
            <NavLink to="/portal/admin/issues" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <BugIcon /> All Issues
            </NavLink>
            <NavLink to="/portal/admin/features" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <StarIcon /> All Features
            </NavLink>
            <NavLink to="/portal/admin/roadmap" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <MapIcon /> Roadmap Editor
            </NavLink>
          </div>
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="user-name">{user?.displayName ?? user?.email}</div>
        <div className="user-info">{user?.customer?.companyName ?? (isAdmin ? 'Administrator' : user?.email)}</div>
        <button className="btn-logout" onClick={logout}>Sign out</button>
      </div>
    </aside>
  );
}

function ProtectedLayout({ adminOnly = false }: { adminOnly?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>;

  if (!user) {
    window.location.href = `https://auth.wegener.no/login?redirect=${encodeURIComponent(window.location.href)}`;
    return null;
  }

  if (adminOnly && user.portalRole !== 'admin') {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Access denied.</div>;
  }

  return (
    <div className="portal-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          {adminOnly ? (
            <>
              <Route path="/portal/admin" element={<AdminDashboard />} />
              <Route path="/portal/admin/customers" element={<Customers />} />
              <Route path="/portal/admin/issues" element={<AdminIssues />} />
              <Route path="/portal/admin/features" element={<AdminFeatures />} />
              <Route path="/portal/admin/roadmap" element={<AdminRoadmap />} />
            </>
          ) : (
            <>
              <Route path="/portal" element={<Dashboard />} />
              <Route path="/portal/issues" element={<Issues />} />
              <Route path="/portal/issues/new" element={<NewIssue />} />
              <Route path="/portal/issues/:id" element={<IssueDetail />} />
              <Route path="/portal/features" element={<Features />} />
              <Route path="/portal/features/new" element={<NewFeature />} />
              <Route path="/portal/plans" element={<Plans />} />
              <Route path="/portal/roadmap" element={<Roadmap />} />
              {/* Admin routes accessible to admins from same layout */}
              <Route path="/portal/admin" element={<AdminDashboard />} />
              <Route path="/portal/admin/customers" element={<Customers />} />
              <Route path="/portal/admin/issues" element={<AdminIssues />} />
              <Route path="/portal/admin/features" element={<AdminFeatures />} />
              <Route path="/portal/admin/roadmap" element={<AdminRoadmap />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default function PortalApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/portal/login" element={<Login />} />
          <Route path="/portal/*" element={<PortalLayout />} />
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function PortalLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>;
  }

  if (!user) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://auth.wegener.no/login?redirect=${redirectUrl}`;
    return null;
  }

  return (
    <div className="portal-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/new" element={<NewIssue />} />
          <Route path="/issues/:id" element={<IssueDetail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/new" element={<NewFeature />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/admin" element={user.portalRole === 'admin' ? <AdminDashboard /> : <Navigate to="/portal" />} />
          <Route path="/admin/customers" element={user.portalRole === 'admin' ? <Customers /> : <Navigate to="/portal" />} />
          <Route path="/admin/issues" element={user.portalRole === 'admin' ? <AdminIssues /> : <Navigate to="/portal" />} />
          <Route path="/admin/features" element={user.portalRole === 'admin' ? <AdminFeatures /> : <Navigate to="/portal" />} />
          <Route path="/admin/roadmap" element={user.portalRole === 'admin' ? <AdminRoadmap /> : <Navigate to="/portal" />} />
        </Routes>
      </div>
    </div>
  );
}
