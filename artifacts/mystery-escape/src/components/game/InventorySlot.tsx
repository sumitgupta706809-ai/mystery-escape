import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInventory } from "@/contexts/InventoryContext";
import { RARITY_CONFIG, type ItemDefinition } from "@/data/items";
import { cn } from "@/lib/utils";

interface InventorySlotProps {
  slotIndex: number;
  item: ItemDefinition | null;
  isSelected: boolean;
  isDragSource: boolean;
  isDragTarget: boolean;
  onDragTargetEnter: (i: number) => void;
  onDragTargetLeave: () => void;
  onDrop: (to: number) => void;
}

export function InventorySlot({
  slotIndex,
  item,
  isSelected,
  isDragSource,
  isDragTarget,
  onDragTargetEnter,
  onDragTargetLeave,
  onDrop,
}: InventorySlotProps) {
  const { selectSlot, setDragSlot } = useInventory();
  const rarity = item ? RARITY_CONFIG[item.rarity] : null;
  const isDragging = useRef(false);

  const handleDragStart = () => {
    if (!item) return;
    isDragging.current = true;
    setDragSlot(slotIndex);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    setDragSlot(null);
  };

  const handleClick = () => {
    if (isDragging.current) return;
    selectSlot(item ? slotIndex : null);
  };

  return (
    <motion.div
      className="relative"
      style={{ width: 54, height: 54 }}
      data-slot-index={slotIndex}
      onMouseEnter={() => onDragTargetEnter(slotIndex)}
      onMouseLeave={onDragTargetLeave}
    >
      {/* Drop target highlight */}
      <div
        className={cn(
          "absolute inset-0 rounded-sm border-2 border-dashed transition-all duration-150 pointer-events-none z-20",
          isDragTarget
            ? "border-primary/60 bg-primary/10 scale-105"
            : "border-transparent"
        )}
      />

      {/* Slot base */}
      <motion.button
        onClick={handleClick}
        whileHover={item ? { scale: 1.06 } : {}}
        whileTap={item ? { scale: 0.92 } : {}}
        className={cn(
          "absolute inset-0 rounded-sm border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 overflow-hidden",
          item
            ? isSelected
              ? cn("bg-primary/15", rarity?.border ?? "border-primary/50", rarity?.glow ?? "")
              : cn("bg-secondary/30 hover:bg-secondary/50", rarity?.border ?? "border-border/50")
            : "border-dashed border-border/20 bg-transparent",
          isDragSource && "opacity-40 scale-95"
        )}
        data-testid={`inv-slot-${slotIndex}`}
        title={item?.name}
      >
        {item ? (
          <>
            <span className="text-xl leading-none select-none">{item.icon}</span>
            <span className="text-[7px] text-muted-foreground/70 truncate w-full text-center px-1 leading-none font-sans">
              {item.shortName}
            </span>
            {isSelected && (
              <motion.div
                layoutId="inv-selected-dot"
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(224,153,30,0.8)]"
                transition={{ type: "spring", stiffness: 500 }}
              />
            )}
            {item.rarity !== "common" && (
              <div className={cn(
                "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full opacity-60",
                item.rarity === "uncommon" && "bg-emerald-400",
                item.rarity === "rare" && "bg-primary",
                item.rarity === "legendary" && "bg-violet-400",
              )} />
            )}
          </>
        ) : (
          <div className="h-3 w-3 rounded-full border border-border/15" />
        )}
      </motion.button>

      {/* Draggable ghost — only mounted when item exists */}
      {item && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.15}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.18, zIndex: 100, opacity: 0.9, cursor: "grabbing" }}
          className={cn(
            "absolute inset-0 rounded-sm flex items-center justify-center cursor-grab z-10",
            "bg-transparent"
          )}
          style={{ touchAction: "none" }}
          data-testid={`inv-drag-${slotIndex}`}
        >
          <span className="text-xl select-none pointer-events-none">{item.icon}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
