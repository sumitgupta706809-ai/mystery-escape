import { createContext, useContext, useState, useCallback } from "react";
import type { PuzzleDefinition } from "@/puzzles/types";

interface PuzzleContextValue {
  activePuzzle: PuzzleDefinition | null;
  openPuzzle: (def: PuzzleDefinition) => void;
  closePuzzle: () => void;
  solvedIds: Set<string>;
  markSolved: (id: string) => void;
  solvedCount: number;
}

const STORAGE_KEY = "mystery-escape:solved-puzzles";

function loadSolvedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

const PuzzleContext = createContext<PuzzleContextValue | null>(null);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [activePuzzle, setActivePuzzle] = useState<PuzzleDefinition | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(loadSolvedIds);

  const openPuzzle = useCallback((def: PuzzleDefinition) => {
    setActivePuzzle(def);
  }, []);

  const closePuzzle = useCallback(() => {
    setActivePuzzle(null);
  }, []);

  const markSolved = useCallback((id: string) => {
    setSolvedIds((prev) => {
      const next = new Set(prev).add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return (
    <PuzzleContext.Provider value={{
      activePuzzle,
      openPuzzle,
      closePuzzle,
      solvedIds,
      markSolved,
      solvedCount: solvedIds.size,
    }}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const ctx = useContext(PuzzleContext);
  if (!ctx) throw new Error("usePuzzle must be used within PuzzleProvider");
  return ctx;
}
