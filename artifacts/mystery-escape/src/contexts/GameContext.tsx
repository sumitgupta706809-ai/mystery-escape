import { createContext, useContext, useState, useCallback } from "react";

export type ActionMode = "examine" | "take" | "use" | "combine";

export interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  description: string;
}

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
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  inventory: InventoryItem[];
  addItem: (item: InventoryItem) => void;
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
  isTransitioning: boolean;
  triggerRoomTransition: (cb: () => void) => void;
  currentRoom: string;
}

const GameContext = createContext<GameContextValue | null>(null);

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "brass-key", icon: "🗝️", name: "Brass Key", description: "A tarnished brass key with an ornate bow. It looks like it might fit a small lockbox." },
  { id: "old-letter", icon: "📜", name: "Old Letter", description: "A water-stained letter written in hurried script. Most of it is illegible, but a sequence of numbers is circled at the bottom." },
  { id: "candle", icon: "🕯️", name: "Candle Stub", description: "A half-burned candle, still faintly warm. Someone was in this room recently." },
];

const INITIAL_OBJECTIVES: Objective[] = [
  { id: "search-desk", text: "Search the antique desk", completed: false },
  { id: "examine-portrait", text: "Examine the faded portrait", completed: false },
  { id: "check-clock", text: "Inspect the stopped clock", completed: false },
  { id: "find-hidden", text: "Find the hidden passage", completed: false },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [activeAction, setActiveAction] = useState<ActionMode>("examine");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [paused, setPaused] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [objectives, setObjectives] = useState<Objective[]>(INITIAL_OBJECTIVES);
  const [inspectTarget, setInspectTarget] = useState<HotspotData | null>(null);
  const [examinedIds, setExaminedIds] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentRoom] = useState("The Victorian Manor");

  const addItem = useCallback((item: InventoryItem) => {
    setInventory((prev) => [...prev, item]);
  }, []);

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
      selectedItemId, setSelectedItemId,
      inventory, addItem,
      paused, setPaused,
      hintsRemaining, useHint,
      objectives, completeObjective,
      inspectTarget, openInspect, closeInspect,
      examinedIds, markExamined,
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
