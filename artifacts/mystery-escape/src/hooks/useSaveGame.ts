import { useCallback, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const AUTOSAVE_INTERVAL_MS = 30_000;

interface SavePayload {
  roomId: string;
  secondsElapsed: number;
  hintsUsed: number;
  solvedPuzzleIds: string[];
  inventoryItemIds: string[];
}

interface LoadedState {
  roomId: string;
  secondsElapsed: number;
  hintsUsed: number;
  solvedPuzzleIds: string[];
  inventoryItemIds: string[];
}

export function useSaveGame(getPayload: () => SavePayload) {
  const { user } = useAuth();
  const payloadRef = useRef(getPayload);
  payloadRef.current = getPayload;
  const saveInFlight = useRef(false);

  const save = useCallback(async (): Promise<void> => {
    if (!user || saveInFlight.current) return;
    saveInFlight.current = true;
    try {
      await api.save.push(payloadRef.current());
    } catch (e) {
      console.warn("Auto-save failed:", e);
    } finally {
      saveInFlight.current = false;
    }
  }, [user]);

  // Auto-save on interval
  useEffect(() => {
    if (!user) return;
    const id = setInterval(save, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, save]);

  // Save on page unload
  useEffect(() => {
    if (!user) return;
    const handler = () => {
      const payload = payloadRef.current();
      const token = localStorage.getItem("mystery-escape:token");
      if (!token) return;
      const BASE = (import.meta as any).env?.BASE_URL?.replace(/\/$/, "") ?? "";
      navigator.sendBeacon(
        `${BASE}/api/save`,
        new Blob(
          [JSON.stringify(payload)],
          { type: "application/json" }
        )
      );
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [user]);

  const load = useCallback(async (): Promise<LoadedState | null> => {
    if (!user) return null;
    try {
      const data = await api.save.load();
      return data;
    } catch {
      return null;
    }
  }, [user]);

  const resetSave = useCallback(async (): Promise<void> => {
    if (!user) return;
    await api.save.reset().catch(() => {});
  }, [user]);

  return { save, load, resetSave };
}
