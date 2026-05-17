import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { PuzzleProps, SequenceMemoryConfig } from "@/puzzles/types";
import { cn } from "@/lib/utils";

type Phase = "waiting" | "demo" | "input" | "success" | "failure";

interface Props extends PuzzleProps {
  config: SequenceMemoryConfig;
}

export function SequenceMemoryPuzzle({ config, onSolve, onFail }: Props) {
  const { gridSize, sequence, showMs, hint } = config;
  const total = gridSize * gridSize;

  const [phase, setPhase] = useState<Phase>("waiting");
  const [demoIndex, setDemoIndex] = useState(-1);
  const [lit, setLit] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [flash, setFlash] = useState<{ tile: number; type: "correct" | "wrong" } | null>(null);
  const [countdown, setCountdown] = useState(3);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Countdown before demo
  useEffect(() => {
    if (phase !== "waiting") return;
    if (countdown <= 0) {
      setPhase("demo");
      setDemoIndex(0);
      return;
    }
    const t = setTimeout(() => {
      if (isMounted.current) setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Animate demo sequence
  useEffect(() => {
    if (phase !== "demo") return;
    if (demoIndex >= sequence.length) {
      // Demo done — switch to input after a short pause
      const t = setTimeout(() => {
        if (isMounted.current) {
          setLit(null);
          setPhase("input");
          setPlayerInput([]);
        }
      }, showMs + 200);
      return () => clearTimeout(t);
    }

    const tile = sequence[demoIndex];
    setLit(tile);
    const t = setTimeout(() => {
      if (!isMounted.current) return;
      setLit(null);
      setTimeout(() => {
        if (isMounted.current) setDemoIndex((i) => i + 1);
      }, 120);
    }, showMs);
    return () => clearTimeout(t);
  }, [phase, demoIndex, sequence, showMs]);

  const tapTile = useCallback((tileIndex: number) => {
    if (phase !== "input") return;
    const step = playerInput.length;
    const expected = sequence[step];

    if (tileIndex === expected) {
      setFlash({ tile: tileIndex, type: "correct" });
      setTimeout(() => {
        if (isMounted.current) setFlash(null);
      }, 300);

      const next = [...playerInput, tileIndex];
      setPlayerInput(next);

      if (next.length === sequence.length) {
        setPhase("success");
        setTimeout(onSolve, 500);
      }
    } else {
      setFlash({ tile: tileIndex, type: "wrong" });
      setPhase("failure");
      setTimeout(() => {
        if (isMounted.current) {
          setFlash(null);
          onFail();
        }
      }, 600);
    }
  }, [phase, playerInput, sequence, onSolve, onFail]);

  const replay = useCallback(() => {
    setPhase("waiting");
    setCountdown(3);
    setDemoIndex(-1);
    setLit(null);
    setPlayerInput([]);
    setFlash(null);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 px-2" data-testid="sequence-memory-puzzle">
      {hint && (
        <p className="font-serif text-[11px] text-muted-foreground/60 text-center italic leading-relaxed max-w-xs">
          {hint}
        </p>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between w-full max-w-xs">
        <div className="flex items-center gap-2">
          <span className={cn(
            "inline-block h-2 w-2 rounded-full",
            phase === "demo"    && "bg-amber-400 animate-pulse",
            phase === "input"   && "bg-emerald-400 animate-pulse",
            phase === "waiting" && "bg-muted-foreground/30",
            phase === "success" && "bg-emerald-400",
            phase === "failure" && "bg-destructive",
          )} />
          <span className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/60">
            {phase === "waiting" && `Watch in ${countdown}…`}
            {phase === "demo"    && "Memorise the sequence"}
            {phase === "input"   && `Repeat — ${playerInput.length}/${sequence.length}`}
            {phase === "success" && "Correct!"}
            {phase === "failure" && "Wrong tile"}
          </span>
        </div>

        {/* Progress pips during input */}
        {phase === "input" && (
          <div className="flex gap-1">
            {sequence.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-200",
                  i < playerInput.length ? "bg-emerald-400/80" : "bg-border/30"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const isDemoLit = lit === i;
          const isFlashCorrect = flash?.tile === i && flash.type === "correct";
          const isFlashWrong   = flash?.tile === i && flash.type === "wrong";
          const isNextTarget   = phase === "input" && sequence[playerInput.length] === i;
          const isInputPhase   = phase === "input";

          return (
            <motion.button
              key={i}
              onClick={() => tapTile(i)}
              disabled={phase !== "input"}
              animate={{
                backgroundColor:
                  isDemoLit      ? "rgba(224,153,30,0.35)" :
                  isFlashCorrect ? "rgba(52,211,153,0.4)"  :
                  isFlashWrong   ? "rgba(239,68,68,0.4)"   :
                  "rgba(255,255,255,0.03)",
                borderColor:
                  isDemoLit      ? "rgba(224,153,30,0.7)" :
                  isFlashCorrect ? "rgba(52,211,153,0.7)" :
                  isFlashWrong   ? "rgba(239,68,68,0.7)"  :
                  isNextTarget   ? "rgba(224,153,30,0.25)":
                  "rgba(255,255,255,0.07)",
                scale: isDemoLit || isFlashCorrect || isFlashWrong ? 1.06 : 1,
                boxShadow:
                  isDemoLit      ? "0 0 16px rgba(224,153,30,0.4)" :
                  isFlashCorrect ? "0 0 14px rgba(52,211,153,0.4)" :
                  isFlashWrong   ? "0 0 14px rgba(239,68,68,0.4)"  :
                  "none",
              }}
              transition={{ duration: 0.12 }}
              whileHover={isInputPhase ? { scale: 1.05, borderColor: "rgba(224,153,30,0.35)" } : {}}
              whileTap={isInputPhase ? { scale: 0.93 } : {}}
              className={cn(
                "rounded-sm border transition-colors",
                isInputPhase ? "cursor-pointer" : "cursor-default"
              )}
              style={{ width: 56, height: 56 }}
              data-testid={`seq-tile-${i}`}
            />
          );
        })}
      </div>

      {/* Replay button after failure */}
      {phase === "failure" && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={replay}
          className="rounded-sm border border-border/40 bg-secondary/20 px-4 py-2 font-serif text-xs uppercase tracking-widest text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
          data-testid="seq-replay"
        >
          Watch Again
        </motion.button>
      )}
    </div>
  );
}
