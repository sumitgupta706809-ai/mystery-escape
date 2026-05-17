import { useRef } from "react";
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
}: InventorySlotProps) {
  const { selectSlot, setDragSlot } = useInventory();
  const rarity = item ? RARITY_CONFIG[item.rarity] : null;

  // Track whether the current gesture is a drag (moved > threshold) or a click
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    setDragSlot(slotIndex);
  };

  const handleDragEnd = () => {
    setDragSlot(null);
    // Brief delay so click handler can check isDraggingRef before it resets
    setTimeout(() => { isDraggingRef.current = false; }, 50);
  };

  const handleClick = () => {
    if (isDraggingRef.current) return;
    if (item) selectSlot(slotIndex);
  };

  return (
    <div
      className="relative shrink-0"
      style={{ width: 54, height: 54 }}
      data-slot-index={slotIndex}
      onMouseEnter={() => onDragTargetEnter(slotIndex)}
      onMouseLeave={onDragTargetLeave}
    >
      {/* Drop-target ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-sm border-2 border-dashed transition-all duration-150 pointer-events-none z-20",
          isDragTarget ? "border-primary/60 bg-primary/10" : "border-transparent"
        )}
      />

      {/* Unified draggable + clickable tile */}
      <motion.div
        drag={!!item}
        dragMomentum={false}
        dragElastic={0.12}
        dragSnapToOrigin
        onPointerDown={handlePointerDown}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        whileHover={item ? { scale: 1.06 } : {}}
        whileTap={item && !isDraggingRef.current ? { scale: 0.92 } : {}}
        whileDrag={{ scale: 1.18, zIndex: 100, opacity: 0.88, cursor: "grabbing" }}
        animate={isDragSource ? { opacity: 0.35, scale: 0.9 } : { opacity: 1, scale: 1 }}
        className={cn(
          "absolute inset-0 rounded-sm border flex flex-col items-center justify-center gap-0.5",
          "transition-colors duration-200 overflow-hidden",
          item
            ? isSelected
              ? cn("bg-primary/15", rarity?.border ?? "border-primary/50", rarity?.glow ?? "")
              : cn("bg-secondary/30 hover:bg-secondary/50 cursor-grab", rarity?.border ?? "border-border/50")
            : "border-dashed border-border/20 bg-transparent cursor-default",
          isDragSource && "pointer-events-none"
        )}
        style={{ touchAction: "none" }}
        data-testid={`inv-slot-${slotIndex}`}
        title={item?.name}
      >
        {item ? (
          <>
            <span className="text-xl leading-none select-none">{item.icon}</span>
            <span className="text-[7px] text-muted-foreground/70 truncate w-full text-center px-1 leading-none font-sans">
              {item.shortName}
            </span>

            {/* Selected indicator dot */}
            {isSelected && (
              <motion.div
                layoutId="inv-selected-dot"
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_rgba(224,153,30,0.8)]"
                transition={{ type: "spring", stiffness: 500 }}
              />
            )}

            {/* Rarity underline */}
            {item.rarity !== "common" && (
              <div className={cn(
                "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full opacity-70",
                item.rarity === "uncommon" && "bg-emerald-400",
                item.rarity === "rare"     && "bg-primary",
                item.rarity === "legendary"&& "bg-violet-400",
              )} />
            )}
          </>
        ) : (
          <div className="h-3 w-3 rounded-full border border-border/15" />
        )}
      </motion.div>
    </div>
  );
}
