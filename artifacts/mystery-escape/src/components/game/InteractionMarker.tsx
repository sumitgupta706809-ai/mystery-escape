import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HotspotData } from "@/contexts/GameContext";

interface InteractionMarkerProps {
  hotspot: HotspotData;
  examined: boolean;
  puzzleSolved?: boolean;
  onActivate: (h: HotspotData) => void;
}

export function InteractionMarker({ hotspot, examined, puzzleSolved, onActivate }: InteractionMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const isSolved = puzzleSolved === true;
  const isDone = isSolved || (examined && !hotspot.puzzleId);

  return (
    <motion.button
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onActivate(hotspot)}
      whileTap={{ scale: 0.85 }}
      data-testid={`marker-${hotspot.id}`}
    >
      <div className="relative flex items-center justify-center">
        {!isDone && (
          <>
            <motion.div
              className={cn(
                "absolute rounded-full border",
                hotspot.puzzleId
                  ? "border-amber-400/40 bg-amber-400/5"
                  : "border-primary/30 bg-primary/5"
              )}
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{ width: 36, height: 36 }}
            />
            <motion.div
              className={cn(
                "absolute rounded-full border",
                hotspot.puzzleId
                  ? "border-amber-400/20 bg-amber-400/5"
                  : "border-primary/20 bg-primary/5"
              )}
              animate={{ scale: [1, 2.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
              style={{ width: 36, height: 36 }}
            />
          </>
        )}

        {isSolved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute rounded-full border border-emerald-500/30 bg-emerald-400/10"
            style={{ width: 40, height: 40 }}
          />
        )}

        <motion.div
          animate={hovered ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200",
            isSolved
              ? "border-emerald-500/50 bg-emerald-400/15 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
              : isDone
              ? "border-primary/20 bg-card/60 text-primary/30"
              : hovered
                ? hotspot.puzzleId
                  ? "border-amber-400 bg-amber-400/20 shadow-[0_0_16px_rgba(251,191,36,0.5)] text-amber-400"
                  : "border-primary bg-primary/20 shadow-[0_0_16px_rgba(224,153,30,0.5)] text-primary"
                : hotspot.puzzleId
                  ? "border-amber-400/60 bg-amber-400/10 shadow-[0_0_8px_rgba(251,191,36,0.25)] text-amber-400/80"
                  : "border-primary/60 bg-primary/10 shadow-[0_0_8px_rgba(224,153,30,0.25)] text-primary/80"
          )}
        >
          {isSolved ? (
            <Unlock className="h-3 w-3" strokeWidth={2} />
          ) : isDone ? (
            <Check className="h-3 w-3" strokeWidth={2} />
          ) : hotspot.puzzleId ? (
            <span className="text-[10px] font-serif font-bold select-none">⚿</span>
          ) : (
            <span className="text-[10px] font-serif font-bold select-none">?</span>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap"
          >
            <div className={cn(
              "rounded-sm border px-2.5 py-1 text-xs font-serif tracking-wide backdrop-blur-sm shadow-lg",
              isSolved
                ? "border-emerald-500/30 bg-card/95 text-emerald-400/90"
                : hotspot.puzzleId
                  ? "border-amber-400/30 bg-card/95 text-amber-400/90"
                  : "border-primary/25 bg-card/95 text-primary/90"
            )}>
              {hotspot.label}
              {isSolved && <span className="ml-1.5 text-emerald-400/60 text-[10px]">(solved)</span>}
              {!isSolved && examined && <span className="ml-1.5 text-primary/40 text-[10px]">(examined)</span>}
            </div>
            <div className={cn(
              "mx-auto mt-0.5 h-0 w-0 border-x-4 border-t-4 border-x-transparent",
              isSolved ? "border-t-emerald-500/30" : hotspot.puzzleId ? "border-t-amber-400/30" : "border-t-primary/25"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
