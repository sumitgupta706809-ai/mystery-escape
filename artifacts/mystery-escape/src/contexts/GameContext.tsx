import { createContext, useContext, useState, useCallback } from "react";

export type ActionMode = "examine" | "take" | "use" | "combine";

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

export interface HotspotData {
  id: string;
  label: string;
  x: number;
  y: number;
  description: string;
  canTake?: boolean;
  examined?: boolean;
  itemId?: string;
}

interface GameContextValue {
  activeAction: ActionMode;
  setActiveAction: (a: ActionMode) => void;
  paused: boolean;
  setPaused: (v: boolean) => void;
  hintsRemaining: number;
  useHint: () => void;
  objectives: Objective[];
  completeObjective: (id: string) => void;
  inspectTarget: HotspotData | null;
  openInspect: (h: HotspotData) => void;
  closeInspect: () => void;
  examinedIds: Set<string>;
  markExamined: (id: string) => void;
  takenIds: Set<string>;
  markTaken: (id: string) => void;
  isTransitioning: boolean;
  triggerRoomTransition: (cb: () => void) => void;
  currentRoom: string;
}

const GameContext = createContext<GameContextValue | null>(null);

const INITIAL_OBJECTIVES: Objective[] = [
  { id: "search-desk",     text: "Search the antique desk",    completed: false },
  { id: "examine-portrait",text: "Examine the faded portrait", completed: false },
  { id: "check-clock",     text: "Inspect the stopped clock",  completed: false },
  { id: "find-hidden",     text: "Find the hidden passage",    completed: false },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [activeAction, setActiveAction] = useState<ActionMode>("examine");
  const [paused, setPaused] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [objectives, setObjectives] = useState<Objective[]>(INITIAL_OBJECTIVES);
  const [inspectTarget, setInspectTarget] = useState<HotspotData | null>(null);
  const [examinedIds, setExaminedIds] = useState<Set<string>>(new Set());
  const [takenIds, setTakenIds] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentRoom] = useState("The Victorian Manor");

  const useHint = useCallback(() => {
    setHintsRemaining((h) => Math.max(0, h - 1));
  }, []);

  const completeObjective = useCallback((id: string) => {
    setObjectives((prev) => prev.map((o) => o.id === id ? { ...o, completed: true } : o));
  }, []);

  const openInspect = useCallback((h: HotspotData) => {
    setInspectTarget(h);
  }, []);

  const closeInspect = useCallback(() => {
    setInspectTarget(null);
  }, []);

  const markExamined = useCallback((id: string) => {
    setExaminedIds((prev) => new Set(prev).add(id));
  }, []);

  const markTaken = useCallback((id: string) => {
    setTakenIds((prev) => new Set(prev).add(id));
  }, []);

  const triggerRoomTransition = useCallback((cb: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      cb();
      setTimeout(() => setIsTransitioning(false), 600);
    }, 700);
  }, []);

  return (
    <GameContext.Provider value={{
      activeAction, setActiveAction,
      paused, setPaused,
      hintsRemaining, useHint,
      objectives, completeObjective,
      inspectTarget, openInspect, closeInspect,
      examinedIds, markExamined,
      takenIds, markTaken,
      isTransitioning, triggerRoomTransition,
      currentRoom,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
