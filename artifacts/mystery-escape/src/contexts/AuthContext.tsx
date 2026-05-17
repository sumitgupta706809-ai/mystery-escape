import {
  createContext, useContext, useState, useCallback,
  useEffect, type ReactNode,
} from "react";
import { api, type AuthResponse } from "@/lib/api";

interface AuthUser {
  userId: string;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "mystery-escape:token";

function storeAuth(res: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, res.token);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { setIsLoading(false); return; }
    api.auth.me()
      .then((me) => setUser(me))
      .catch(() => {
        clearAuth();
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.auth.login(username, password);
      storeAuth(res);
      setToken(res.token);
      setUser({ userId: res.userId, username: res.username });
    } catch (e: any) {
      setError(e.message ?? "Login failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.auth.register(username, password);
      storeAuth(res);
      setToken(res.token);
      setUser({ userId: res.userId, username: res.username });
    } catch (e: any) {
      setError(e.message ?? "Registration failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await api.auth.logout(); } catch {}
    clearAuth();
    setToken(null);
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
