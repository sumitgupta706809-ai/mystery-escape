import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type ItemDefinition, createItemInstance, STARTING_ITEMS } from "@/data/items";

export const TOTAL_SLOTS = 10;
const STORAGE_KEY = "mystery-escape-inventory-v1";

export interface UseFeedback {
  type: "success" | "error";
  message: string;
}

interface UseResult {
  success: boolean;
  message: string;
}

interface CombineResult {
  success: boolean;
  message: string;
  resultItemId?: string;
}

interface InventoryContextValue {
  slots: (ItemDefinition | null)[];
  selectedSlot: number | null;
  selectedItem: ItemDefinition | null;
  dragSlot: number | null;
  setDragSlot: (i: number | null) => void;
  selectSlot: (i: number | null) => void;
  addItem: (itemId: string) => boolean;
  removeItem: (slotIndex: number) => void;
  swapSlots: (from: number, to: number) => void;
  useItem: (slotIndex: number, targetId: string) => UseResult;
  combineItems: (slotA: number, slotB: number) => CombineResult;
  dropItem: (slotIndex: number) => void;
  lastPickup: ItemDefinition | null;
  clearLastPickup: () => void;
  feedback: UseFeedback | null;
  clearFeedback: () => void;
  useLog: string[];
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function loadSlots(): (ItemDefinition | null)[] {
  const empty = Array<ItemDefinition | null>(TOTAL_SLOTS).fill(null);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const ids: (string | null)[] = JSON.parse(raw);
      if (Array.isArray(ids) && ids.length === TOTAL_SLOTS) {
        return ids.map((id) => (id ? createItemInstance(id) : null));
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  STARTING_ITEMS.forEach((id, i) => {
    if (i < TOTAL_SLOTS) empty[i] = createItemInstance(id);
  });
  return empty;
}

function saveSlots(slots: (ItemDefinition | null)[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots.map((s) => s?.id ?? null)));
  } catch { /* storage full or unavailable */ }
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<(ItemDefinition | null)[]>(loadSlots);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dragSlot, setDragSlot] = useState<number | null>(null);
  const [lastPickup, setLastPickup] = useState<ItemDefinition | null>(null);
  const [feedback, setFeedback] = useState<UseFeedback | null>(null);
  const [useLog, setUseLog] = useState<string[]>([]);

  const selectedItem = selectedSlot !== null ? slots[selectedSlot] : null;

  useEffect(() => {
    saveSlots(slots);
  }, [slots]);

  const log = useCallback((msg: string) => {
    setUseLog((prev) => [msg, ...prev].slice(0, 20));
  }, []);

  const selectSlot = useCallback((i: number | null) => {
    setSelectedSlot((prev) => (prev === i ? null : i));
  }, []);

  const addItem = useCallback((itemId: string): boolean => {
    const def = createItemInstance(itemId);
    if (!def) return false;
    let added = false;
    setSlots((prev) => {
      const next = [...prev];
      const emptyIdx = next.findIndex((s) => s === null);
      if (emptyIdx === -1) return prev;
      next[emptyIdx] = def;
      added = true;
      return next;
    });
    if (added) {
      setLastPickup(def);
      log(`Picked up: ${def.name}`);
    }
    return added;
  }, [log]);

  const removeItem = useCallback((slotIndex: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setSelectedSlot((prev) => (prev === slotIndex ? null : prev));
  }, []);

  const swapSlots = useCallback((from: number, to: number) => {
    if (from === to) return;
    setSlots((prev) => {
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setSelectedSlot((prev) => {
      if (prev === from) return to;
      if (prev === to) return from;
      return prev;
    });
  }, []);

  const useItem = useCallback((slotIndex: number, targetId: string): UseResult => {
    const item = slots[slotIndex];
    if (!item) return { success: false, message: "No item in that slot." };

    if (!item.usableOn.includes(targetId)) {
      const msg = `The ${item.name} doesn't seem to work here.`;
      setFeedback({ type: "error", message: msg });
      return { success: false, message: msg };
    }

    const msg = item.useEffect ?? "You use the item.";
    setFeedback({ type: "success", message: msg });
    log(`Used ${item.name} on ${targetId}`);

    if (item.consumeOnUse) {
      setSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = null;
        return next;
      });
      setSelectedSlot((prev) => (prev === slotIndex ? null : prev));
    }

    return { success: true, message: msg };
  }, [slots, log]);

  const combineItems = useCallback((slotA: number, slotB: number): CombineResult => {
    const itemA = slots[slotA];
    const itemB = slots[slotB];
    if (!itemA || !itemB) return { success: false, message: "No items to combine." };
    if (slotA === slotB) return { success: false, message: "Can't combine an item with itself." };

    const canCombine = itemA.combinesWith.includes(itemB.id) || itemB.combinesWith.includes(itemA.id);
    if (!canCombine) {
      const msg = `The ${itemA.name} and ${itemB.name} don't combine.`;
      setFeedback({ type: "error", message: msg });
      return { success: false, message: msg };
    }

    const msg = `You combine the ${itemA.name} and ${itemB.name}.`;
    setFeedback({ type: "success", message: msg });
    log(`Combined ${itemA.name} + ${itemB.name}`);
    return { success: true, message: msg };
  }, [slots, log]);

  const dropItem = useCallback((slotIndex: number) => {
    const item = slots[slotIndex];
    if (!item) return;
    log(`Dropped: ${item.name}`);
    removeItem(slotIndex);
  }, [slots, removeItem, log]);

  const clearLastPickup = useCallback(() => setLastPickup(null), []);
  const clearFeedback = useCallback(() => setFeedback(null), []);

  return (
    <InventoryContext.Provider value={{
      slots, selectedSlot, selectedItem, dragSlot, setDragSlot,
      selectSlot, addItem, removeItem, swapSlots,
      useItem, combineItems, dropItem,
      lastPickup, clearLastPickup,
      feedback, clearFeedback,
      useLog,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
