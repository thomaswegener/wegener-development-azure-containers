import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    if (!canUseStorage()) return;
    const storedToken = window.localStorage.getItem('authToken');
    const storedUser = window.localStorage.getItem('authUser');
    setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        window.localStorage.removeItem('authUser');
        setUser(null);
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady || !canUseStorage()) return;
    if (!token) {
      localStorage.removeItem('authToken');
      return;
    }
    localStorage.setItem('authToken', token);
  }, [token, storageReady]);

  useEffect(() => {
    if (!storageReady || !canUseStorage()) return;
    if (!user) {
      localStorage.removeItem('authUser');
      return;
    }
    localStorage.setItem('authUser', JSON.stringify(user));
  }, [user, storageReady]);

  const login = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
