const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const API_BASE = `${BASE}/api`;

function getToken(): string | null {
  return localStorage.getItem("mystery-escape:token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as T;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}

export interface SaveData {
  roomId: string;
  secondsElapsed: number;
  hintsUsed: number;
  solvedPuzzleIds: string[];
  inventoryItemIds: string[];
  updatedAt: string | null;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  roomId: string;
  seconds: number;
  hintsUsed: number;
  completedAt: string;
}

export const api = {
  auth: {
    register: (username: string, password: string) =>
      req<AuthResponse>("POST", "/auth/register", { username, password }),
    login: (username: string, password: string) =>
      req<AuthResponse>("POST", "/auth/login", { username, password }),
    logout: () => req<{ ok: boolean }>("POST", "/auth/logout"),
    me: () => req<{ userId: string; username: string }>("GET", "/auth/me"),
  },
  save: {
    load: () => req<SaveData>("GET", "/save"),
    push: (data: Omit<SaveData, "updatedAt">) => req<{ ok: boolean }>("POST", "/save", data),
    reset: () => req<{ ok: boolean }>("DELETE", "/save"),
  },
  leaderboard: {
    submit: (roomId: string, seconds: number, hintsUsed: number) =>
      req<LeaderboardEntry>("POST", "/leaderboard", { roomId, seconds, hintsUsed }),
    fetch: (room?: string, limit = 10) =>
      req<LeaderboardEntry[]>("GET", `/leaderboard?room=${room ?? ""}&limit=${limit}`),
  },
};
