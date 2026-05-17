import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronUp, ChevronDown } from "lucide-react";
import { usePuzzle } from "@/contexts/PuzzleContext";
import { useGame } from "@/contexts/GameContext";
import type { PuzzleDefinition } from "@/puzzles/types";

const MANOR_PUZZLES: PuzzleDefinition[] = [
  {
    id: "room-safe-keypad",
    type: "keypad",
    title: "Wall Safe",
    description: "The clock hands hold the answer.",
    config: { digits: 4, solution: "1147", hint: "The clock is frozen at 11:47." },
  },
  {
    id: "room-bookcase-symbol",
    type: "symbol-match",
    title: "Arcane Bookcase",
    description: "Match the carved symbols in order.",
    config: {
      pool: ["☽", "✦", "⚡", "⊕", "△", "◈", "♾", "⚗"],
      solution: ["☽", "⊕", "✦"],
      hint: "Moon, circle, star.",
    },
  },
  {
    id: "room-clock-sequence",
    type: "sequence-memory",
    title: "Stopped Clock",
    description: "Press the plates in the hidden sequence.",
    config: { gridSize: 3, sequence: [0, 4, 2, 6, 8], showMs: 700, hint: "Watch carefully." },
  },
];

const LAB_PUZZLES: PuzzleDefinition[] = [
  {
    id: "lab-cabinet-keypad",
    type: "keypad",
    title: "Filing Cabinet",
    description: "4-digit combination lock.",
    config: { digits: 4, solution: "4729", hint: "Numbers scratched near the dark corner: 4·7·2·9" },
  },
  {
    id: "lab-terminal-symbol",
    type: "symbol-match",
    title: "Terminal Boot Sequence",
    description: "Enter the boot symbols in order.",
    config: {
      pool: ["⚡", "◈", "△", "⊕", "☽", "♾", "⚗", "✦"],
      solution: ["⚡", "◈", "△"],
      hint: "Stencil above the monitor: ⚡ · ◈ · △",
    },
  },
  {
    id: "lab-door-keypad",
    type: "keypad",
    title: "Security Door",
    description: "Emergency override code.",
    config: { digits: 4, solution: "0372", hint: "Terminal displays: OVERRIDE — 03-72" },
  },
];

const TYPE_LABELS: Record<string, string> = {
  "keypad":          "Keypad",
  "symbol-match":    "Symbol Match",
  "sequence-memory": "Sequence Memory",
};

export function PuzzleDemoPanel() {
  const { openPuzzle, solvedIds } = usePuzzle();
  const { roomId } = useGame();
  const [open, setOpen] = useState(false);

  const puzzles = roomId === "underground-lab" ? LAB_PUZZLES : MANOR_PUZZLES;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30" data-testid="puzzle-demo-panel">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-card/80 px-3 py-1.5 font-serif text-[10px] uppercase tracking-widest text-primary/70 backdrop-blur-md transition-all hover:border-primary/50 hover:text-primary shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        data-testid="btn-toggle-puzzle-demo"
      >
        <FlaskConical className="h-3 w-3" strokeWidth={1.5} />
        Puzzles
        {open
          ? <ChevronDown className="h-3 w-3 ml-0.5" strokeWidth={2} />
          : <ChevronUp   className="h-3 w-3 ml-0.5" strokeWidth={2} />
        }
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-sm border border-border/50 bg-card/98 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden"
          >
            <div className="border-b border-border/30 px-3 py-2 flex items-center justify-between">
              <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/40">
                Puzzle Engine — Demo
              </p>
              <p className="font-serif text-[9px] text-muted-foreground/30 uppercase tracking-widest">
                {roomId === "underground-lab" ? "Lab" : "Manor"}
              </p>
            </div>

            <div className="flex flex-col py-1">
              {puzzles.map((def) => {
                const solved = solvedIds.has(def.id);
                return (
                  <motion.button
                    key={def.id}
                    onClick={() => {
                      openPuzzle(def);
                      setOpen(false);
                    }}
                    whileHover={{ backgroundColor: "rgba(224,153,30,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                    data-testid={`btn-open-puzzle-${def.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xs text-foreground/85 truncate">{def.title}</p>
                      <p className="font-serif text-[9px] text-muted-foreground/50 uppercase tracking-wider">
                        {TYPE_LABELS[def.type]}
                      </p>
                    </div>
                    <div className={`h-2 w-2 rounded-full shrink-0 ${solved ? "bg-emerald-400/70" : "bg-border/40"}`} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
