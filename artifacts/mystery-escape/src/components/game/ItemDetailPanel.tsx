import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Combine, Trash2, Eye, Tag } from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import { useGame } from "@/contexts/GameContext";
import { RARITY_CONFIG } from "@/data/items";
import { cn } from "@/lib/utils";

export function ItemDetailPanel() {
  const { selectedSlot, selectedItem, selectSlot, dropItem, useItem, combineItems, slots } = useInventory();
  const { activeAction, setActiveAction } = useGame();

  if (selectedSlot === null || !selectedItem) return null;

  const rarity = RARITY_CONFIG[selectedItem.rarity];
  const combinableSlots = slots
    .map((item, idx) => ({ item, idx }))
    .filter(({ item, idx }) =>
      item &&
      idx !== selectedSlot &&
      (selectedItem.combinesWith.includes(item.id) || item.combinesWith.includes(selectedItem.id))
    );

  const handleUse = () => {
    setActiveAction("use");
    selectSlot(null);
  };

  const handleCombine = (otherSlot: number) => {
    combineItems(selectedSlot, otherSlot);
    selectSlot(null);
  };

  const handleDrop = () => {
    dropItem(selectedSlot);
    selectSlot(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={selectedItem.id}
        initial={{ opacity: 0, y: 16, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-80 z-40 rounded-sm border bg-card/98 shadow-[0_-12px_40px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden"
        style={{ borderColor: `hsl(var(--border))` }}
        data-testid="item-detail-panel"
      >
        <div className={cn("flex items-start gap-3 p-3 border-b border-border/40", rarity.glow)}>
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border text-2xl",
            rarity.border,
            "bg-secondary/50"
          )}>
            {selectedItem.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-serif text-sm text-foreground/95 leading-tight">{selectedItem.name}</p>
                <span className={cn("font-serif text-[9px] uppercase tracking-widest", rarity.color)}>
                  {rarity.label}
                </span>
              </div>
              <button
                onClick={() => selectSlot(null)}
                className="shrink-0 h-6 w-6 flex items-center justify-center rounded-sm border border-border/30 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                data-testid="btn-close-item-detail"
              >
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-0.5 rounded-full border border-border/30 bg-secondary/30 px-1.5 py-0.5 text-[8px] font-sans uppercase tracking-wider text-muted-foreground/60"
                >
                  <Tag className="h-2 w-2" strokeWidth={1.5} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2.5">
          <p className="font-serif text-xs text-foreground/65 leading-relaxed mb-2">
            {selectedItem.description}
          </p>
          <div className="rounded-sm border border-border/20 bg-secondary/20 px-2.5 py-2">
            <div className="flex items-start gap-1.5">
              <Eye className="h-3 w-3 text-primary/40 mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="font-serif text-[11px] text-muted-foreground/70 leading-relaxed italic">
                {selectedItem.examineText}
              </p>
            </div>
          </div>
        </div>

        {combinableSlots.length > 0 && (
          <div className="px-3 pb-2">
            <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-1.5">
              Combine with
            </p>
            <div className="flex gap-1.5">
              {combinableSlots.map(({ item, idx }) => (
                <button
                  key={idx}
                  onClick={() => handleCombine(idx)}
                  className="flex items-center gap-1.5 rounded-sm border border-border/40 bg-secondary/30 px-2 py-1.5 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  data-testid={`btn-combine-${item!.id}`}
                >
                  <span className="text-base leading-none">{item!.icon}</span>
                  <span className="font-serif text-[10px] text-muted-foreground/80">{item!.shortName}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1.5 border-t border-border/30 px-3 py-2.5">
          <button
            onClick={handleUse}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-primary/40 bg-primary/10 py-2 font-serif text-[10px] uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            data-testid="btn-use-item"
          >
            <Zap className="h-3 w-3" strokeWidth={1.5} />
            Use
          </button>
          {combinableSlots.length > 0 && (
            <button
              onClick={() => handleCombine(combinableSlots[0].idx)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-border/40 bg-secondary/20 py-2 font-serif text-[10px] uppercase tracking-widest text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
              data-testid="btn-combine-first"
            >
              <Combine className="h-3 w-3" strokeWidth={1.5} />
              Combine
            </button>
          )}
          <button
            onClick={handleDrop}
            className="flex items-center justify-center gap-1 rounded-sm border border-border/30 bg-transparent px-2.5 py-2 text-muted-foreground/40 transition-all hover:border-destructive/30 hover:text-destructive"
            data-testid="btn-drop-item"
            title="Drop item"
          >
            <Trash2 className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
