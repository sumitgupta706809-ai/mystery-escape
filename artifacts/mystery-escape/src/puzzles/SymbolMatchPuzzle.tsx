import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { PuzzleProps, SymbolMatchConfig } from "@/puzzles/types";
import { cn } from "@/lib/utils";

const MAX_ATTEMPTS = 4;

interface Props extends PuzzleProps {
  config: SymbolMatchConfig;
}

export function SymbolMatchPuzzle({ config, onSolve, onFail }: Props) {
  const { pool, solution, hint } = config;
  const slots = solution.length;

  const [entry, setEntry] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [wrongSlots, setWrongSlots] = useState<boolean[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const pick = useCallback((symbol: string) => {
    if (locked || entry.length >= slots) return;
    const next = [...entry, symbol];
    setEntry(next);

    if (next.length === slots) {
      const correct = next.every((s, i) => s === solution[i]);
      if (correct) {
        setLocked(true);
        setTimeout(onSolve, 500);
        return;
      }

      const wrongs = next.map((s, i) => s !== solution[i]);
      setWrongSlots(wrongs);
      setShake(true);
      setTimeout(() => setShake(false), 550);
      setTimeout(() => {
        setEntry([]);
        setWrongSlots([]);
      }, 700);

      const next2 = attempts + 1;
      setAttempts(next2);
      if (next2 >= MAX_ATTEMPTS) {
        setTimeout(onFail, 700);
      }
    }
  }, [entry, slots, solution, attempts, locked, onSolve, onFail]);

  const clear = useCallback(() => {
    if (locked) return;
    setEntry([]);
    setWrongSlots([]);
  }, [locked]);

  return (
    <div className="flex flex-col items-center gap-6 px-2" data-testid="symbol-match-puzzle">
      {hint && (
        <p className="font-serif text-[11px] text-muted-foreground/60 text-center italic leading-relaxed max-w-xs">
          {hint}
        </p>
      )}

      {/* Entry slots */}
      <motion.div
        className="flex gap-2 items-center"
        animate={shake ? { x: [-7, 7, -5, 5, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
      >
        {Array.from({ length: slots }).map((_, i) => {
          const symbol = entry[i];
          const isWrong = wrongSlots[i];
          const isFilled = symbol !== undefined;

          return (
            <motion.div
              key={i}
              animate={{
                borderColor: locked && isFilled
                  ? "rgba(52,211,153,0.6)"
                  : isWrong
                  ? "rgba(239,68,68,0.7)"
                  : isFilled
                  ? "rgba(224,153,30,0.5)"
                  : "rgba(255,255,255,0.08)",
                backgroundColor: locked && isFilled
                  ? "rgba(52,211,153,0.06)"
                  : isWrong
                  ? "rgba(239,68,68,0.08)"
                  : isFilled
                  ? "rgba(224,153,30,0.06)"
                  : "transparent",
                scale: isFilled ? 1 : 0.95,
              }}
              className="flex h-14 w-14 items-center justify-center rounded-sm border-2 text-2xl select-none"
            >
              <AnimatePresence mode="wait">
                {symbol && (
                  <motion.span
                    key={symbol + i}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {symbol}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {entry.length > 0 && !locked && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clear}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-sm border border-border/30 text-muted-foreground/40 hover:border-destructive/30 hover:text-destructive transition-colors"
            data-testid="symbol-clear"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.button>
        )}
      </motion.div>

      {/* Attempt indicator */}
      {attempts > 0 && !locked && (
        <p className="font-serif text-[10px] uppercase tracking-widest text-destructive/60">
          {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining
        </p>
      )}

      {/* Symbol pool */}
      <div className="flex flex-col items-center gap-3 w-full">
        <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/40">
          Select symbols in order
        </p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(pool.length, 5)}, 1fr)` }}
        >
          {pool.map((sym, i) => (
            <motion.button
              key={i}
              onClick={() => pick(sym)}
              whileHover={!locked ? { scale: 1.12, backgroundColor: "rgba(224,153,30,0.1)" } : {}}
              whileTap={!locked ? { scale: 0.88 } : {}}
              disabled={locked || entry.length >= slots}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-sm border text-xl select-none transition-all",
                !locked && entry.length < slots
                  ? "border-border/40 bg-secondary/20 hover:border-primary/40 cursor-pointer"
                  : "border-border/20 bg-transparent opacity-50 cursor-default"
              )}
              data-testid={`symbol-${i}`}
            >
              {sym}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
