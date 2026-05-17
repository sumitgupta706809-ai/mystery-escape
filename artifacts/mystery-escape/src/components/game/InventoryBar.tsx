import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { useInventory, TOTAL_SLOTS } from "@/contexts/InventoryContext";
import { InventorySlot } from "@/components/game/InventorySlot";
import { ItemDetailPanel } from "@/components/game/ItemDetailPanel";
import { ItemPickupToast } from "@/components/game/ItemPickupToast";

export function InventoryBar() {
  const { slots, selectedSlot, dragSlot, swapSlots } = useInventory();
  const [dragTarget, setDragTarget] = useState<number | null>(null);

  const handleDragTargetEnter = useCallback((i: number) => {
    if (dragSlot !== null && dragSlot !== i) setDragTarget(i);
  }, [dragSlot]);

  const handleDragTargetLeave = useCallback(() => {
    setDragTarget(null);
  }, []);

  const handleDrop = useCallback((to: number) => {
    if (dragSlot !== null && dragSlot !== to) {
      swapSlots(dragSlot, to);
    }
    setDragTarget(null);
  }, [dragSlot, swapSlots]);

  const filledCount = slots.filter(Boolean).length;

  return (
    <div className="relative" data-testid="inventory-bar">
      <ItemPickupToast />

      <AnimatePresence>
        {selectedSlot !== null && (
          <ItemDetailPanel />
        )}
      </AnimatePresence>

      <div className="flex items-center h-[72px] px-3 gap-2 border-t border-border/50 bg-card/85 backdrop-blur-md">
        {/* Label */}
        <div className="flex shrink-0 flex-col items-center gap-0.5 pr-2.5 border-r border-border/30">
          <Package className="h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
          <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">
            {filledCount}/{TOTAL_SLOTS}
          </span>
        </div>

        {/* Slots */}
        <div
          className="flex flex-1 items-center gap-1.5 overflow-x-auto overflow-y-visible py-1"
          style={{ scrollbarWidth: "none" }}
          onMouseLeave={() => setDragTarget(null)}
        >
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
            <InventorySlot
              key={i}
              slotIndex={i}
              item={slots[i]}
              isSelected={selectedSlot === i}
              isDragSource={dragSlot === i}
              isDragTarget={dragTarget === i && dragSlot !== null && dragSlot !== i}
              onDragTargetEnter={handleDragTargetEnter}
              onDragTargetLeave={handleDragTargetLeave}
              onDrop={handleDrop}
            />
          ))}
        </div>

        {/* Slot fill indicator */}
        <div className="shrink-0 pl-2.5 border-l border-border/30 flex flex-col items-center justify-center gap-1">
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i < filledCount
                  ? "rgba(224,153,30,0.5)"
                  : "rgba(255,255,255,0.06)",
                scale: i < filledCount ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              className="h-1 w-1 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
