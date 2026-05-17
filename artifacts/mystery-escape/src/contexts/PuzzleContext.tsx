import { createContext, useContext, useState, useCallback } from "react";
import type { PuzzleDefinition } from "@/puzzles/types";

interface PuzzleContextValue {
  activePuzzle: PuzzleDefinition | null;
  openPuzzle: (def: PuzzleDefinition) => void;
  closePuzzle: () => void;
  solvedIds: Set<string>;
  markSolved: (id: string) => void;
}

const PuzzleContext = createContext<PuzzleContextValue | null>(null);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [activePuzzle, setActivePuzzle] = useState<PuzzleDefinition | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const openPuzzle = useCallback((def: PuzzleDefinition) => {
    setActivePuzzle(def);
  }, []);

  const closePuzzle = useCallback(() => {
    setActivePuzzle(null);
  }, []);

  const markSolved = useCallback((id: string) => {
    setSolvedIds((prev) => new Set(prev).add(id));
  }, []);

  return (
    <PuzzleContext.Provider value={{ activePuzzle, openPuzzle, closePuzzle, solvedIds, markSolved }}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const ctx = useContext(PuzzleContext);
  if (!ctx) throw new Error("usePuzzle must be used within PuzzleProvider");
  return ctx;
}
