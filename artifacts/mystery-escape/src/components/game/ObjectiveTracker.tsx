import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, ChevronDown, Check } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

export function ObjectiveTracker() {
  const [open, setOpen] = useState(false);
  const { objectives } = useGame();
  const completedCount = objectives.filter((o) => o.completed).length;

  return (
    <div className="relative" data-testid="objective-tracker">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-sm border px-3 py-2 backdrop-blur-md transition-all",
          open
            ? "border-primary/40 bg-card/90 text-primary"
            : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
        )}
        data-testid="btn-toggle-objectives"
      >
        <ScrollText className="h-4 w-4" strokeWidth={1.5} />
        <span className="font-serif text-xs uppercase tracking-widest hidden sm:inline">Objectives</span>
        <span className="font-mono text-[10px] text-primary/70">
          {completedCount}/{objectives.length}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-3 w-3" strokeWidth={2} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 rounded-sm border border-border bg-card/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden z-30"
            data-testid="objectives-panel"
          >
            <div className="border-b border-border/50 px-3 py-2">
              <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground">
                Room Objectives
              </p>
            </div>
            <div className="p-2 space-y-1">
              {objectives.map((obj, i) => (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-start gap-2.5 rounded-sm px-2.5 py-2 transition-colors",
                    obj.completed ? "bg-primary/5" : "bg-transparent"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                    obj.completed
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border/50 text-transparent"
                  )}>
                    {obj.completed && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                  </div>
                  <span className={cn(
                    "font-serif text-xs leading-relaxed",
                    obj.completed ? "line-through text-muted-foreground/50" : "text-foreground/80"
                  )}>
                    {obj.text}
                  </span>
                </motion.div>
              ))}
            </div>
            {completedCount === objectives.length && (
              <div className="border-t border-primary/20 bg-primary/5 px-3 py-2 text-center">
                <p className="font-serif text-xs text-primary/80 uppercase tracking-widest">
                  All objectives complete!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
