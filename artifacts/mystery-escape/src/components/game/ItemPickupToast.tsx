import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import { RARITY_CONFIG } from "@/data/items";

export function ItemPickupToast() {
  const { lastPickup, clearLastPickup } = useInventory();

  useEffect(() => {
    if (!lastPickup) return;
    const t = setTimeout(clearLastPickup, 2800);
    return () => clearTimeout(t);
  }, [lastPickup, clearLastPickup]);

  const rarity = lastPickup ? RARITY_CONFIG[lastPickup.rarity] : null;

  return (
    <AnimatePresence>
      {lastPickup && rarity && (
        <motion.div
          key={lastPickup.id + Date.now()}
          initial={{ opacity: 0, y: 20, x: "-50%", scale: 0.88 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -16, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="fixed bottom-28 left-1/2 z-[70] pointer-events-none"
          data-testid="item-pickup-toast"
        >
          <div className={`flex items-center gap-2.5 rounded-sm border px-3 py-2 backdrop-blur-md bg-card/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${rarity.border}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-border/30 bg-secondary/50 text-lg">
              {lastPickup.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Plus className="h-3 w-3 text-emerald-400/80" strokeWidth={2.5} />
                <span className="font-serif text-xs text-foreground/90">{lastPickup.name}</span>
              </div>
              <span className={`font-serif text-[9px] uppercase tracking-widest ${rarity.color}`}>
                {rarity.label}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
