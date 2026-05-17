import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Delete } from "lucide-react";
import type { PuzzleProps, KeypadConfig } from "@/puzzles/types";
import { cn } from "@/lib/utils";

const MAX_ATTEMPTS = 5;

interface Props extends PuzzleProps {
  config: KeypadConfig;
  alreadySolved?: boolean;
}

export function KeypadPuzzle({ config, onSolve, onFail, alreadySolved }: Props) {
  const { digits, solution, hint } = config;
  const [entry, setEntry] = useState("");
  const [shake, setShake] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(alreadySolved ?? false);

  const press = useCallback((d: string) => {
    if (locked) return;
    setEntry((prev) => (prev.length < digits ? prev + d : prev));
  }, [digits, locked]);

  const backspace = useCallback(() => {
    if (locked) return;
    setEntry((prev) => prev.slice(0, -1));
  }, [locked]);

  const submit = useCallback(() => {
    if (locked || entry.length < digits) return;

    if (entry === solution) {
      setLocked(true);
      setTimeout(onSolve, 400);
      return;
    }

    const next = attempts + 1;
    setAttempts(next);
    setShake(true);
    setWrongFlash(true);
    setTimeout(() => setShake(false), 600);
    setTimeout(() => setWrongFlash(false), 500);
    setTimeout(() => setEntry(""), 400);

    if (next >= MAX_ATTEMPTS) {
      setTimeout(onFail, 600);
    }
  }, [entry, solution, digits, attempts, locked, onSolve, onFail]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") press(e.key);
      if (e.key === "Backspace") backspace();
      if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [press, backspace, submit]);

  const displayDigits = Array.from({ length: digits }).map((_, i) => entry[i] ?? null);

  return (
    <div className="flex flex-col items-center gap-5 px-1" data-testid="keypad-puzzle">
      {hint && (
        <p className="font-serif text-[11px] text-muted-foreground/60 text-center italic leading-relaxed max-w-xs">
          {hint}
        </p>
      )}

      {/* Display */}
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        className="flex gap-2 sm:gap-3"
      >
        {displayDigits.map((d, i) => (
          <motion.div
            key={i}
            animate={{
              borderColor: wrongFlash
                ? "rgba(239,68,68,0.8)"
                : d !== null
                ? "rgba(224,153,30,0.6)"
                : "rgba(255,255,255,0.08)",
              backgroundColor: wrongFlash
                ? "rgba(239,68,68,0.08)"
                : d !== null
                ? "rgba(224,153,30,0.06)"
                : "transparent",
            }}
            className={cn(
              "flex h-12 w-10 sm:h-14 sm:w-11 items-center justify-center rounded-sm border-2 font-mono text-xl sm:text-2xl font-bold text-foreground transition-colors",
              locked && d !== null && "border-emerald-500/60 text-emerald-400"
            )}
          >
            {d !== null ? (locked ? d : "•") : ""}
          </motion.div>
        ))}
      </motion.div>

      {/* Attempts remaining */}
      <AnimatePresence>
        {attempts > 0 && !locked && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-serif text-[10px] uppercase tracking-widest text-destructive/60 -mt-2"
          >
            {MAX_ATTEMPTS - attempts} attempt{MAX_ATTEMPTS - attempts !== 1 ? "s" : ""} remaining
          </motion.p>
        )}
      </AnimatePresence>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-2">
        {["1","2","3","4","5","6","7","8","9"].map((d) => (
          <motion.button
            key={d}
            onClick={() => press(d)}
            whileHover={{ scale: 1.08, backgroundColor: "rgba(224,153,30,0.12)" }}
            whileTap={{ scale: 0.9 }}
            disabled={locked}
            className="flex items-center justify-center rounded-sm border border-border/40 bg-secondary/20 font-mono text-lg text-foreground/80 transition-colors disabled:opacity-40 touch-manipulation"
            style={{ width: 52, height: 52 }}
            data-testid={`key-${d}`}
          >
            {d}
          </motion.button>
        ))}

        {/* Backspace */}
        <motion.button
          onClick={backspace}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          disabled={locked}
          className="flex items-center justify-center rounded-sm border border-border/30 bg-secondary/10 text-muted-foreground/60 transition-colors disabled:opacity-40 touch-manipulation"
          style={{ width: 52, height: 52 }}
          data-testid="key-backspace"
        >
          <Delete className="h-4 w-4" strokeWidth={1.5} />
        </motion.button>

        {/* 0 */}
        <motion.button
          onClick={() => press("0")}
          whileHover={{ scale: 1.08, backgroundColor: "rgba(224,153,30,0.12)" }}
          whileTap={{ scale: 0.9 }}
          disabled={locked}
          className="flex items-center justify-center rounded-sm border border-border/40 bg-secondary/20 font-mono text-lg text-foreground/80 transition-colors disabled:opacity-40 touch-manipulation"
          style={{ width: 52, height: 52 }}
          data-testid="key-0"
        >
          0
        </motion.button>

        {/* Submit */}
        <motion.button
          onClick={submit}
          whileHover={entry.length === digits && !locked ? { scale: 1.04 } : {}}
          whileTap={entry.length === digits && !locked ? { scale: 0.96 } : {}}
          disabled={entry.length < digits || locked}
          className={cn(
            "flex items-center justify-center rounded-sm border font-serif text-[10px] uppercase tracking-widest transition-all touch-manipulation",
            entry.length === digits && !locked
              ? "border-primary/50 bg-primary/15 text-primary hover:bg-primary hover:text-primary-foreground"
              : "border-border/20 bg-transparent text-muted-foreground/30"
          )}
          style={{ width: 52, height: 52 }}
          data-testid="key-submit"
        >
          ↵
        </motion.button>
      </div>
    </div>
  );
}
