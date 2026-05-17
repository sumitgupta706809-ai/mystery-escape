import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, XCircle, Lock } from "lucide-react";
import { usePuzzle } from "@/contexts/PuzzleContext";
import { KeypadPuzzle } from "@/puzzles/KeypadPuzzle";
import { SymbolMatchPuzzle } from "@/puzzles/SymbolMatchPuzzle";
import { SequenceMemoryPuzzle } from "@/puzzles/SequenceMemoryPuzzle";
import { cn } from "@/lib/utils";

type Outcome = "idle" | "success" | "failure";

const PUZZLE_LABELS: Record<string, string> = {
  "keypad":          "Code Entry",
  "symbol-match":    "Symbol Cipher",
  "sequence-memory": "Memory Sequence",
};

const SUCCESS_PARTICLES = Array.from({ length: 12 });

export function PuzzleModal() {
  const { activePuzzle, closePuzzle, markSolved, solvedIds } = usePuzzle();
  const [outcome, setOutcome] = useState<Outcome>("idle");

  const handleSolve = useCallback(() => {
    setOutcome("success");
    if (activePuzzle) markSolved(activePuzzle.id);
    setTimeout(() => {
      setOutcome("idle");
      closePuzzle();
    }, 2000);
  }, [activePuzzle, markSolved, closePuzzle]);

  const handleFail = useCallback(() => {
    setOutcome("failure");
    setTimeout(() => setOutcome("idle"), 1800);
  }, []);

  const handleClose = useCallback(() => {
    if (outcome !== "success") {
      setOutcome("idle");
      closePuzzle();
    }
  }, [outcome, closePuzzle]);

  const alreadySolved = activePuzzle ? solvedIds.has(activePuzzle.id) : false;

  return (
    <AnimatePresence>
      {activePuzzle && (
        <>
          {/* Backdrop */}
          <motion.div
            key="puzzle-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[4px]"
            data-testid="puzzle-backdrop"
          />

          {/* Modal card */}
          <motion.div
            key="puzzle-card"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-3 sm:inset-x-auto top-1/2 -translate-y-1/2 z-[60] mx-auto w-full sm:max-w-sm"
            data-testid="puzzle-modal"
          >
            {/* Outer glow ring on entrance */}
            <motion.div
              initial={{ opacity: 0.6, scale: 1.04 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute -inset-1 rounded-sm bg-primary/10 blur-md pointer-events-none"
            />

            <div className="relative rounded-sm border border-primary/20 bg-card/99 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden">

              {/* Ambient top glow line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-border/40 px-4 sm:px-5 py-4">
                <div>
                  <p className="font-serif text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-0.5">
                    {PUZZLE_LABELS[activePuzzle.type] ?? "Puzzle"}
                    {alreadySolved && (
                      <span className="ml-2 text-emerald-400/70">· Solved</span>
                    )}
                  </p>
                  <h2 className="font-serif text-base text-foreground/95 leading-tight">
                    {activePuzzle.title}
                  </h2>
                  <p className="font-serif text-[11px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                    {activePuzzle.description}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="shrink-0 flex h-7 w-7 items-center justify-center rounded-sm border border-border/40 text-muted-foreground/40 hover:text-muted-foreground transition-colors mt-0.5"
                  data-testid="btn-close-puzzle"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>

              {/* Puzzle body */}
              <div className="relative px-4 sm:px-5 py-5 sm:py-6">
                {activePuzzle.type === "keypad" && (
                  <KeypadPuzzle
                    config={activePuzzle.config}
                    onSolve={handleSolve}
                    onFail={handleFail}
                    alreadySolved={alreadySolved}
                  />
                )}
                {activePuzzle.type === "symbol-match" && (
                  <SymbolMatchPuzzle
                    config={activePuzzle.config}
                    onSolve={handleSolve}
                    onFail={handleFail}
                  />
                )}
                {activePuzzle.type === "sequence-memory" && (
                  <SequenceMemoryPuzzle
                    config={activePuzzle.config}
                    onSolve={handleSolve}
                    onFail={handleFail}
                  />
                )}

                {/* Already-solved overlay */}
                {alreadySolved && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/60 backdrop-blur-[2px] rounded-sm">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Lock className="h-8 w-8 text-emerald-400/70" strokeWidth={1.5} />
                    </motion.div>
                    <p className="font-serif text-xs text-emerald-400/80 uppercase tracking-widest">Already Unlocked</p>
                  </div>
                )}

                {/* Success overlay */}
                <AnimatePresence>
                  {outcome === "success" && (
                    <motion.div
                      key="success-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.3 } }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/90 backdrop-blur-[2px] rounded-sm overflow-hidden"
                      data-testid="puzzle-success-overlay"
                    >
                      {/* Sweep glow */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0.8 }}
                        animate={{ scaleX: 1, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent"
                      />

                      <motion.div
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.05 }}
                      >
                        <CheckCircle2 className="h-14 w-14 text-emerald-400" strokeWidth={1} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="text-center"
                      >
                        <p className="font-serif text-lg text-emerald-400/90">Solved</p>
                        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-0.5">
                          Puzzle complete
                        </p>
                      </motion.div>

                      {/* Particle burst */}
                      {SUCCESS_PARTICLES.map((_, i) => {
                        const angle = (i / SUCCESS_PARTICLES.length) * Math.PI * 2;
                        const dist = 48 + (i % 3) * 14;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.1, 1, 0.4],
                              x: Math.cos(angle) * dist,
                              y: Math.sin(angle) * dist,
                            }}
                            transition={{
                              duration: 0.65,
                              delay: 0.08 + i * 0.03,
                              ease: "easeOut",
                            }}
                            className={cn(
                              "absolute rounded-full",
                              i % 3 === 0 ? "h-2 w-2 bg-emerald-400/80" :
                              i % 3 === 1 ? "h-1.5 w-1.5 bg-emerald-300/60" :
                                            "h-1 w-1 bg-emerald-500/70"
                            )}
                          />
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Failure overlay */}
                <AnimatePresence>
                  {outcome === "failure" && (
                    <motion.div
                      key="failure-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/90 backdrop-blur-[2px] rounded-sm"
                      data-testid="puzzle-failure-overlay"
                    >
                      {/* Red flash */}
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-destructive/15 rounded-sm"
                      />

                      <motion.div
                        initial={{ scale: 0.4, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 14 }}
                      >
                        <XCircle className="h-14 w-14 text-destructive/80" strokeWidth={1} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center"
                      >
                        <p className="font-serif text-base text-destructive/80">Incorrect</p>
                        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-0.5">
                          Try again
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom ambient line */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
