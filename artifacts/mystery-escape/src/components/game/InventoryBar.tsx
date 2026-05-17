import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronUp } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

const TOTAL_SLOTS = 8;

export function InventoryBar() {
  const { inventory, selectedItemId, setSelectedItemId } = useGame();
  const [expanded, setExpanded] = useState(false);

  const selectedItem = inventory.find((i) => i.id === selectedItemId) ?? null;

  return (
    <div className="relative" data-testid="inventory-bar">
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            key={selectedItem.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 rounded-sm border border-primary/25 bg-card/98 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden"
            data-testid="item-detail-popup"
          >
            <div className="flex items-start gap-3 p-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-secondary/50 text-2xl">
                {selectedItem.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm text-primary/90 mb-0.5">{selectedItem.name}</p>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {selectedItem.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedItemId(null)}
                className="text-muted-foreground/40 hover:text-muted-foreground text-xs leading-none mt-0.5 shrink-0"
                data-testid="btn-deselect-item"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center h-20 px-4 gap-2 border-t border-border/50 bg-card/80 backdrop-blur-md">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex shrink-0 flex-col items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors pr-2 border-r border-border/30"
          data-testid="btn-toggle-inventory"
        >
          <Package className="h-4 w-4" strokeWidth={1.5} />
          <span className="font-serif text-[8px] uppercase tracking-widest">
            {inventory.length}/{TOTAL_SLOTS}
          </span>
        </button>

        <div className="flex flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none">
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
            const item = inventory[i];
            const isSelected = item?.id === selectedItemId;

            return (
              <motion.button
                key={i}
                initial={item ? { scale: 0.6, opacity: 0 } : {}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.04 }}
                whileHover={item ? { scale: 1.08 } : {}}
                whileTap={item ? { scale: 0.92 } : {}}
                onClick={() => {
                  if (item) setSelectedItemId(isSelected ? null : item.id);
                }}
                className={cn(
                  "relative shrink-0 h-13 w-13 rounded-sm border transition-all duration-200",
                  "flex flex-col items-center justify-center gap-0.5",
                  item
                    ? isSelected
                      ? "border-primary bg-primary/15 shadow-[0_0_14px_rgba(224,153,30,0.3)]"
                      : "border-border/50 bg-secondary/30 hover:border-primary/40 cursor-pointer"
                    : "border-dashed border-border/20 bg-transparent cursor-default"
                )}
                style={{ width: 52, height: 52 }}
                data-testid={`inv-slot-${i}`}
                title={item?.name}
              >
                {item ? (
                  <>
                    <span className="text-xl leading-none select-none">{item.icon}</span>
                    <span className="text-[7px] text-muted-foreground/70 truncate w-full text-center px-0.5 leading-none font-sans">
                      {item.name.split(" ")[0]}
                    </span>
                    {isSelected && (
                      <motion.div
                        layoutId="inv-selected"
                        className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 400 }}
                      />
                    )}
                  </>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <div className="shrink-0 pl-2 border-l border-border/30 flex flex-col items-center gap-1">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="h-1.5 w-1.5 rounded-full bg-primary/40"
          />
          <span className="font-serif text-[8px] uppercase tracking-widest text-muted-foreground/40 writing-mode-vertical">
            INV
          </span>
        </div>
      </div>
    </div>
  );
}
