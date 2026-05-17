import { createContext, useContext, useState, useCallback, useRef } from "react";
import { type ItemDefinition, createItemInstance, STARTING_ITEMS, getItem } from "@/data/items";

export const TOTAL_SLOTS = 10;

export interface InventorySlotData {
  slotIndex: number;
  item: ItemDefinition | null;
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
  useLog: string[];
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function buildInitialSlots(): (ItemDefinition | null)[] {
  const slots: (ItemDefinition | null)[] = Array(TOTAL_SLOTS).fill(null);
  STARTING_ITEMS.forEach((id, i) => {
    if (i < TOTAL_SLOTS) slots[i] = createItemInstance(id);
  });
  return slots;
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [slots, setSlots] = useState<(ItemDefinition | null)[]>(buildInitialSlots);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dragSlot, setDragSlot] = useState<number | null>(null);
  const [lastPickup, setLastPickup] = useState<ItemDefinition | null>(null);
  const [useLog, setUseLog] = useState<string[]>([]);

  const selectedItem = selectedSlot !== null ? slots[selectedSlot] : null;

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
      return { success: false, message: `The ${item.name} doesn't seem to work on that.` };
    }
    log(`Used ${item.name} on ${targetId}: ${item.useEffect ?? "Nothing happened."}`);
    return { success: true, message: item.useEffect ?? "You use the item." };
  }, [slots, log]);

  const combineItems = useCallback((slotA: number, slotB: number): CombineResult => {
    const itemA = slots[slotA];
    const itemB = slots[slotB];
    if (!itemA || !itemB) return { success: false, message: "No items to combine." };
    if (slotA === slotB) return { success: false, message: "Can't combine an item with itself." };

    const canCombine = itemA.combinesWith.includes(itemB.id) || itemB.combinesWith.includes(itemA.id);
    if (!canCombine) {
      return { success: false, message: `The ${itemA.name} and ${itemB.name} don't combine.` };
    }

    log(`Combined ${itemA.name} + ${itemB.name} → Lit Candle`);
    return { success: true, message: `You combine the ${itemA.name} and ${itemB.name} together.`, resultItemId: "lit-candle" };
  }, [slots, log]);

  const dropItem = useCallback((slotIndex: number) => {
    const item = slots[slotIndex];
    if (!item) return;
    log(`Dropped: ${item.name}`);
    removeItem(slotIndex);
  }, [slots, removeItem, log]);

  const clearLastPickup = useCallback(() => {
    setLastPickup(null);
  }, []);

  return (
    <InventoryContext.Provider value={{
      slots, selectedSlot, selectedItem, dragSlot, setDragSlot,
      selectSlot, addItem, removeItem, swapSlots,
      useItem, combineItems, dropItem,
      lastPickup, clearLastPickup, useLog,
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
