// AuthContext: stores the logged-in user and login/logout functions.
// Any page can use the "useAuth" hook to read the current user.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

// Shape of the context value.
interface AuthContextValue {
  user: User | null;
  loading: boolean; // true while we check if a token is still valid
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provider component that wraps the whole app.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is saved, ask the API who the user is.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Validate the token by fetching the user profile.
    authApi
      .getMe()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem('token')) // token invalid -> remove it
      .finally(() => setLoading(false));
  }, []);

  // Login: call the API, save the token, store the user.
  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  // Register: create account, save token, store user.
  const register = async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  // Logout: remove the token and clear the user.
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can easily access the auth state.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
