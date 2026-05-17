import { Pause, Lightbulb, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { usePuzzle } from "@/contexts/PuzzleContext";
import { ObjectiveTracker } from "@/components/game/ObjectiveTracker";
import { ROOM_META } from "@/rooms/index";
import { cn } from "@/lib/utils";

const HINTS_DATA = [
  "Look carefully at the objects on the desk — one has a hidden compartment beneath the surface.",
  "The sequence of numbers on the letter corresponds to the Roman numerals on the clock face.",
  "The book that protrudes from the shelf is not a book at all — it's a lever for a hidden passage.",
];

const LAB_HINTS_DATA = [
  "The emergency locker on the left wall may have been left open in the evacuation.",
  "UV markings glow in darkness — your flashlight beam might reveal them. Try USE mode on the dark corner.",
  "The terminal's boot sequence is stencilled above the monitor. The door code will appear once power is restored.",
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function GameHUD() {
  const { setPaused, hintsRemaining, useHint, currentRoom, roomId } = useGame();
  const { solvedIds } = usePuzzle();
  const [seconds, setSeconds] = useState(3600);
  const [hintOpen, setHintOpen] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const isLowTime = seconds <= 60;

  const roomMeta = ROOM_META[roomId as keyof typeof ROOM_META];
  const roomPuzzleCount = roomMeta?.puzzleIds.length ?? 3;
  const solvedCount = roomMeta?.puzzleIds.filter((id) => solvedIds.has(id)).length ?? 0;
  const allSolved = solvedCount === roomPuzzleCount;

  const hintsData = roomId === "underground-lab" ? LAB_HINTS_DATA : HINTS_DATA;

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  // Reset timer on room change
  useEffect(() => {
    setSeconds(3600);
    setRevealedHints([]);
    setHintOpen(false);
  }, [roomId]);

  const revealHint = (i: number) => {
    if (!revealedHints.includes(i)) {
      setRevealedHints((p) => [...p, i]);
      useHint();
    }
  };

  return (
    <div
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-3"
      data-testid="game-hud"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-border/40 bg-card/70 px-3 py-1.5 backdrop-blur-md">
          <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/60 leading-none mb-0.5">
            Room
          </p>
          <p className="font-serif text-xs text-foreground/90">{currentRoom}</p>
        </div>
        <ObjectiveTracker />
      </div>

      <div className="flex items-center justify-center">
        <motion.div
          animate={isLowTime ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={isLowTime ? { repeat: Infinity, duration: 0.9 } : {}}
          className={cn(
            "rounded-sm border px-4 py-1.5 font-mono text-lg tracking-widest backdrop-blur-md transition-all",
            isLowTime
              ? "border-destructive/50 bg-destructive/10 text-destructive shadow-[0_0_20px_rgba(220,38,38,0.25)]"
              : "border-border/40 bg-card/70 text-foreground/80"
          )}
          data-testid="hud-timer"
        >
          {formatTime(seconds)}
        </motion.div>
      </div>

      <div className="flex items-center gap-2">
        {/* Puzzle progress — room-aware */}
        <motion.div
          key={`${roomId}-${solvedCount}`}
          initial={solvedCount > 0 ? { scale: 1.2, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "hidden sm:flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 backdrop-blur-md transition-all",
            allSolved
              ? "border-emerald-500/40 bg-emerald-400/10 text-emerald-400"
              : solvedCount > 0
                ? "border-primary/30 bg-card/70 text-primary/80"
                : "border-border/30 bg-card/60 text-muted-foreground/50"
          )}
          data-testid="puzzle-progress"
        >
          <KeyRound className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span className="font-mono text-[10px]">{solvedCount}/{roomPuzzleCount}</span>
        </motion.div>

        {/* Hints */}
        <div className="relative">
          <button
            onClick={() => setHintOpen(!hintOpen)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-sm border px-3 py-1.5 backdrop-blur-md transition-all",
              hintOpen
                ? "border-primary/50 bg-primary/10 text-primary"
                : hintsRemaining > 0
                  ? "border-border/40 bg-card/70 text-muted-foreground hover:border-primary/30 hover:text-primary"
                  : "border-border/20 bg-card/50 text-muted-foreground/30 cursor-not-allowed"
            )}
            data-testid="btn-hint"
          >
            <Lightbulb className="h-4 w-4" strokeWidth={1.5} />
            <span className="font-serif text-xs hidden sm:inline uppercase tracking-widest">Hints</span>
            <span className={cn(
              "font-mono text-[10px] rounded-full h-4 w-4 flex items-center justify-center text-[9px]",
              hintsRemaining > 0 ? "bg-primary/20 text-primary" : "bg-border/20 text-muted-foreground/30"
            )}>
              {hintsRemaining}
            </span>
          </button>

          <AnimatePresence>
            {hintOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-72 rounded-sm border border-border bg-card/98 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden z-30"
                data-testid="hint-dropdown"
              >
                <div className="border-b border-border/50 px-3 py-2 flex items-center justify-between">
                  <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground">Hints Available</p>
                  <span className="font-mono text-xs text-primary/70">{hintsRemaining} remaining</span>
                </div>
                <div className="p-2 space-y-1.5">
                  {hintsData.map((hint, i) => {
                    const isRevealed = revealedHints.includes(i);
                    const canReveal = i === revealedHints.length && hintsRemaining > 0;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "rounded-sm border p-2.5 transition-all",
                          isRevealed ? "border-primary/15 bg-primary/5" : "border-border/30 bg-secondary/20"
                        )}
                        data-testid={`hint-item-${i}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-serif text-[10px] text-primary/40 shrink-0 mt-px">{i + 1}.</span>
                          {isRevealed ? (
                            <p className="text-xs text-foreground/65 leading-relaxed font-serif">{hint}</p>
                          ) : (
                            <button
                              onClick={() => canReveal && revealHint(i)}
                              disabled={!canReveal}
                              className={cn(
                                "text-xs transition-colors",
                                canReveal ? "text-primary/70 hover:text-primary cursor-pointer" : "text-muted-foreground/30 cursor-not-allowed"
                              )}
                              data-testid={`btn-reveal-hint-${i}`}
                            >
                              {canReveal ? "Tap to reveal hint" : i < revealedHints.length ? "Revealed" : "Reveal previous hint first"}
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

        <button
          onClick={() => setPaused(true)}
          className="flex h-9 w-9 items-center justify-center rounded-sm border border-border/40 bg-card/70 text-muted-foreground backdrop-blur-md transition-all hover:border-primary/30 hover:text-primary"
          data-testid="btn-pause"
        >
          <Pause className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
