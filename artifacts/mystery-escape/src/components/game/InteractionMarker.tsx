import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HotspotData } from "@/contexts/GameContext";

interface InteractionMarkerProps {
  hotspot: HotspotData;
  examined: boolean;
  onActivate: (h: HotspotData) => void;
}

export function InteractionMarker({ hotspot, examined, onActivate }: InteractionMarkerProps) {
  const [hovered, setHovered] = useState(false);

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
        {!examined && (
          <>
            <motion.div
              className="absolute rounded-full border border-primary/30 bg-primary/5"
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{ width: 36, height: 36 }}
            />
            <motion.div
              className="absolute rounded-full border border-primary/20 bg-primary/5"
              animate={{ scale: [1, 2.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
              style={{ width: 36, height: 36 }}
            />
          </>
        )}

        <motion.div
          animate={hovered ? { scale: 1.15 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200",
            examined
              ? "border-primary/20 bg-card/60 text-primary/30"
              : hovered
                ? "border-primary bg-primary/20 shadow-[0_0_16px_rgba(224,153,30,0.5)] text-primary"
                : "border-primary/60 bg-primary/10 shadow-[0_0_8px_rgba(224,153,30,0.25)] text-primary/80"
          )}
        >
          {examined ? (
            <Check className="h-3 w-3" strokeWidth={2} />
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
            <div className="rounded-sm border border-primary/25 bg-card/95 px-2.5 py-1 text-xs font-serif tracking-wide text-primary/90 backdrop-blur-sm shadow-lg">
              {hotspot.label}
              {examined && <span className="ml-1.5 text-primary/40 text-[10px]">(examined)</span>}
            </div>
            <div className="mx-auto mt-0.5 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-primary/25" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
