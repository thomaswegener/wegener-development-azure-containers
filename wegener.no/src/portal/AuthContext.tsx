import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PortalUser {
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: string;
  portalRole: string;
  customerId: string | null;
  customer: { id: string; companyName: string | null } | null;
}

interface AuthContextValue {
  user: PortalUser | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refetch: () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/session', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    window.location.href = '/portal/login';
  };

  useEffect(() => { fetch_(); }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetch_, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
