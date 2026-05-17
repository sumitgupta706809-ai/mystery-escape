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

export function PuzzleModal() {
  const { activePuzzle, closePuzzle, markSolved, solvedIds } = usePuzzle();
  const [outcome, setOutcome] = useState<Outcome>("idle");

  const handleSolve = useCallback(() => {
    setOutcome("success");
    if (activePuzzle) markSolved(activePuzzle.id);
    setTimeout(() => {
      setOutcome("idle");
      closePuzzle();
    }, 1800);
  }, [activePuzzle, markSolved, closePuzzle]);

  const handleFail = useCallback(() => {
    setOutcome("failure");
    setTimeout(() => setOutcome("idle"), 1600);
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
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[3px]"
            data-testid="puzzle-backdrop"
          />

          {/* Modal card */}
          <motion.div
            key="puzzle-card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[60] mx-auto w-full max-w-sm"
            data-testid="puzzle-modal"
          >
            <div className="relative rounded-sm border border-primary/20 bg-card/99 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden">

              {/* Ambient top glow line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-border/40 px-5 py-4">
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
              <div className="relative px-5 py-6">
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
                {alreadySolved && activePuzzle.type === "keypad" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/50 backdrop-blur-[1px] rounded-sm">
                    <Lock className="h-6 w-6 text-emerald-400/70" strokeWidth={1.5} />
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
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/90 backdrop-blur-[2px] rounded-sm"
                      data-testid="puzzle-success-overlay"
                    >
                      <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.05 }}
                      >
                        <CheckCircle2 className="h-14 w-14 text-emerald-400" strokeWidth={1} />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                      >
                        <p className="font-serif text-lg text-emerald-400/90">Solved</p>
                        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-0.5">
                          Puzzle complete
                        </p>
                      </motion.div>
                      {/* Particle ring */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.2, 1.4],
                            x: Math.cos((i / 8) * Math.PI * 2) * 50,
                            y: Math.sin((i / 8) * Math.PI * 2) * 50,
                          }}
                          transition={{ duration: 0.7, delay: 0.1 + i * 0.04 }}
                          className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400/70"
                        />
                      ))}
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
                      <motion.div
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <XCircle className="h-14 w-14 text-destructive/80" strokeWidth={1} />
                      </motion.div>
                      <div className="text-center">
                        <p className="font-serif text-base text-destructive/80">Failed</p>
                        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/50 mt-0.5">
                          Try again
                        </p>
                      </div>
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
