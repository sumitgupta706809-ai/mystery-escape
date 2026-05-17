import { useState } from "react";
import { ChevronDown, Lightbulb, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const HINTS = [
  "Look carefully at the objects on the desk. One of them has a hidden compartment.",
  "The sequence carved into the mantle mirrors the order of the portraits above it.",
  "The clock stopped at a particular time — that time is your combination.",
];

interface HintPanelProps {
  hintsRemaining?: number;
}

export function HintPanel({ hintsRemaining = 3 }: HintPanelProps) {
  const [open, setOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index) && hintsRemaining > 0) {
      setRevealedHints((prev) => [...prev, index]);
    }
  };

  return (
    <div className="rounded-sm border border-border overflow-hidden" data-testid="hint-panel">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
        data-testid="btn-toggle-hints"
      >
        <div className="flex items-center gap-2 text-foreground/80">
          <Lightbulb className="h-4 w-4 text-primary/60" strokeWidth={1.5} />
          <span className="font-serif text-xs uppercase tracking-widest">Hints</span>
          <span className="text-xs text-muted-foreground">({hintsRemaining} remaining)</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2">
              {HINTS.map((hint, index) => {
                const isRevealed = revealedHints.includes(index);
                const isAvailable = index === revealedHints.length;

                return (
                  <div
                    key={index}
                    className={cn(
                      "rounded-sm border p-3 transition-all duration-300",
                      isRevealed
                        ? "border-primary/20 bg-primary/5"
                        : "border-border/40 bg-secondary/20"
                    )}
                    data-testid={`hint-${index}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-serif text-xs text-primary/50 shrink-0 mt-0.5">
                        {index + 1}.
                      </span>
                      {isRevealed ? (
                        <p className="text-xs text-foreground/70 leading-relaxed">{hint}</p>
                      ) : (
                        <button
                          onClick={() => revealHint(index)}
                          disabled={!isAvailable || hintsRemaining <= revealedHints.length}
                          className={cn(
                            "flex items-center gap-1.5 text-xs transition-colors",
                            isAvailable && hintsRemaining > revealedHints.length
                              ? "text-primary/70 hover:text-primary cursor-pointer"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          )}
                          data-testid={`btn-reveal-hint-${index}`}
                        >
                          <Lock className="h-3 w-3" strokeWidth={1.5} />
                          {isAvailable ? "Reveal hint" : "Complete previous hints first"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
