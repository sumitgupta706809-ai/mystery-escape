import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { usePuzzle } from "@/contexts/PuzzleContext";
import { useGame } from "@/contexts/GameContext";
import { ROOM_META } from "@/rooms/index";
import { cn } from "@/lib/utils";

const BURST_COUNT = 20;

function StarRating({ count, total }: { count: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 16, delay: 0.3 + i * 0.12 }}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-all",
              i < count
                ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(224,153,30,0.7)]"
                : "text-border/30"
            )}
            strokeWidth={1.5}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function VictoryScreen() {
  const { solvedIds } = usePuzzle();
  const { roomId, switchRoom, triggerRoomTransition } = useGame();
  const [visible, setVisible] = useState(false);
  const [wasVisible, setWasVisible] = useState(false);

  const meta = ROOM_META[roomId as keyof typeof ROOM_META];
  const allSolved = meta ? meta.puzzleIds.every((id) => solvedIds.has(id)) : false;
  const isFinalRoom = !meta?.nextRoom;

  useEffect(() => {
    if (allSolved && !wasVisible) {
      const t = setTimeout(() => {
        setVisible(true);
        setWasVisible(true);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [allSolved, wasVisible]);

  const handleNext = () => {
    if (!meta?.nextRoom) return;
    setVisible(false);
    setTimeout(() => {
      setWasVisible(false);
      triggerRoomTransition(() => switchRoom(meta.nextRoom!));
    }, 400);
  };

  const handleRestart = () => {
    setVisible(false);
    setTimeout(() => {
      setWasVisible(false);
      switchRoom(roomId as keyof typeof ROOM_META);
    }, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="victory-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-[6px]"
          />

          {/* Panel */}
          <motion.div
            key="victory-panel"
            initial={{ opacity: 0, scale: 0.82, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.05 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[80] mx-auto max-w-sm"
          >
            {/* Outer glow */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute -inset-2 rounded-sm bg-primary/20 blur-xl pointer-events-none"
            />

            <div className="relative rounded-sm border border-primary/30 bg-card/99 overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.98)]">

              {/* Top glow line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/70 to-transparent origin-left"
              />

              {/* Header */}
              <div className="px-6 pt-8 pb-4 text-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.1 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_30px_rgba(224,153,30,0.25)]"
                >
                  <Trophy className="h-8 w-8 text-primary" strokeWidth={1.5} />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1"
                >
                  {isFinalRoom ? "Escaped" : "Room Cleared"}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="font-serif text-2xl text-foreground/95"
                >
                  {isFinalRoom ? "You Escaped!" : "Well Done"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="font-serif text-xs text-muted-foreground/60 mt-1"
                >
                  {isFinalRoom
                    ? "The laboratory is behind you. Freedom awaits."
                    : `All ${meta.puzzleIds.length} puzzles solved in ${meta.name}`}
                </motion.p>
              </div>

              {/* Stars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center pb-4"
              >
                <StarRating count={3} total={3} />
              </motion.div>

              {/* Solved puzzle list */}
              <div className="mx-6 mb-5 rounded-sm border border-border/30 bg-secondary/20 divide-y divide-border/20">
                {meta.puzzleIds.map((id, i) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-2.5 px-3 py-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, delay: 0.45 + i * 0.08 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-400/15 shrink-0"
                    >
                      <span className="text-[9px] text-emerald-400">✓</span>
                    </motion.div>
                    <span className="font-serif text-xs text-foreground/70">
                      {PUZZLE_NAMES[id] ?? id}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex gap-2.5 px-6 pb-6"
              >
                {!isFinalRoom && (
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-primary/50 bg-primary/15 px-4 py-2.5 font-serif text-xs uppercase tracking-widest text-primary shadow-[0_0_16px_rgba(224,153,30,0.2)] transition-all hover:bg-primary hover:text-primary-foreground"
                    data-testid="btn-victory-next"
                  >
                    {meta.nextRoomLabel ?? "Next Room"}
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </motion.button>
                )}
                {isFinalRoom && (
                  <motion.button
                    onClick={handleRestart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-primary/50 bg-primary/15 px-4 py-2.5 font-serif text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    data-testid="btn-victory-restart"
                  >
                    Play Again
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                  </motion.button>
                )}
                <motion.button
                  onClick={handleRestart}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center rounded-sm border border-border/40 bg-secondary/30 px-3 py-2.5 text-muted-foreground/60 transition-all hover:text-muted-foreground"
                  title="Replay room"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                </motion.button>
              </motion.div>

              {/* Particle burst */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: BURST_COUNT }).map((_, i) => {
                  const angle = (i / BURST_COUNT) * Math.PI * 2;
                  const dist = 80 + (i % 4) * 25;
                  const size = i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: "50%", y: "40%" }}
                      animate={{
                        opacity: [0, 0.9, 0],
                        scale: [0, 1, 0.3],
                        x: `calc(50% + ${Math.cos(angle) * dist}px)`,
                        y: `calc(40% + ${Math.sin(angle) * dist}px)`,
                      }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.025, ease: "easeOut" }}
                      className={cn(
                        "absolute rounded-full",
                        i % 4 === 0 ? "bg-primary/90" :
                        i % 4 === 1 ? "bg-amber-300/70" :
                        i % 4 === 2 ? "bg-yellow-400/60" :
                                      "bg-primary/50"
                      )}
                      style={{ width: size * 4, height: size * 4 }}
                    />
                  );
                })}
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const PUZZLE_NAMES: Record<string, string> = {
  "room-safe-keypad":       "Wall Safe — Code Entry",
  "room-bookcase-symbol":   "Arcane Bookcase — Symbol Cipher",
  "room-clock-sequence":    "Stopped Clock — Memory Sequence",
  "lab-cabinet-keypad":     "Filing Cabinet — Access Code",
  "lab-terminal-symbol":    "Broken Terminal — Boot Sequence",
  "lab-door-keypad":        "Security Door — Exit Code",
};
