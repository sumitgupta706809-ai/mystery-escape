import { motion, AnimatePresence } from "framer-motion";
import { InteractionMarker } from "@/components/game/InteractionMarker";
import { AtmosphericOverlay } from "@/components/game/AtmosphericOverlay";
import { useGame, type HotspotData } from "@/contexts/GameContext";

const HOTSPOTS: HotspotData[] = [
  {
    id: "desk",
    label: "Antique Desk",
    x: 22,
    y: 68,
    description: "An ornate mahogany desk covered in scattered papers.",
  },
  {
    id: "painting",
    label: "Faded Portrait",
    x: 58,
    y: 30,
    description: "A faded oil portrait of a stern-faced Victorian gentleman.",
    canTake: true,
  },
  {
    id: "clock",
    label: "Stopped Clock",
    x: 82,
    y: 52,
    description: "A grandfather clock frozen at 11:47.",
  },
  {
    id: "bookcase",
    label: "Dusty Bookcase",
    x: 12,
    y: 44,
    description: "Rows of leather-bound volumes coated in dust.",
  },
  {
    id: "fireplace",
    label: "Cold Hearth",
    x: 50,
    y: 72,
    description: "A cold hearth with long-dead embers.",
    canTake: true,
  },
  {
    id: "safe",
    label: "Wall Safe",
    x: 73,
    y: 38,
    description: "A wall safe hidden behind a loose panel.",
  },
];

export function RoomScene() {
  const { openInspect, examinedIds, activeAction, triggerRoomTransition } = useGame();

  const handleActivate = (hotspot: HotspotData) => {
    openInspect(hotspot);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-zinc-950 select-none"
      data-testid="room-scene"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/25 via-stone-950/50 to-zinc-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_48%_38%,rgba(160,100,30,0.12)_0%,transparent_75%)]" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full relative">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-950/70 to-transparent" />

          <div
            className="absolute border border-amber-900/20 bg-amber-950/10 rounded-sm"
            style={{ left: "8%", top: "35%", width: "18%", height: "55%" }}
          />
          <div
            className="absolute border border-amber-900/10 bg-amber-950/5"
            style={{ left: "14%", top: "28%", width: "4%", height: "40%" }}
          />

          <div
            className="absolute border border-amber-900/15 bg-amber-950/8"
            style={{ left: "30%", top: "48%", width: "25%", height: "45%" }}
          />

          <div
            className="absolute border border-amber-900/20 bg-amber-950/10 rounded-t-full"
            style={{ left: "42%", top: "55%", width: "16%", height: "38%" }}
          />

          <div
            className="absolute border border-amber-900/15 bg-amber-950/8"
            style={{ right: "12%", top: "28%", width: "14%", height: "62%" }}
          />

          <div
            className="absolute"
            style={{ left: "50%", top: "25%", width: "12%", height: "28%" }}
          >
            <div className="w-full h-full border border-amber-900/20 bg-amber-950/10 rounded-sm" />
            <div className="absolute inset-2 border border-amber-900/10 rounded-sm opacity-50" />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-4 border-t border-amber-900/15 bg-stone-950/50" />
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-stone-950/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-stone-950/60 to-transparent" />
        </div>
      </div>

      <AtmosphericOverlay />

      <div className="absolute inset-0 z-20">
        {HOTSPOTS.map((spot) => (
          <InteractionMarker
            key={spot.id}
            hotspot={spot}
            examined={examinedIds.has(spot.id)}
            onActivate={handleActivate}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => triggerRoomTransition(() => {})}
          className="flex items-center gap-1.5 rounded-sm border border-border/40 bg-card/70 px-3 py-1.5 font-serif text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-md transition-all hover:border-primary/30 hover:text-primary"
          data-testid="btn-next-room"
        >
          Next Room →
        </motion.button>
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <AnimatePresence>
          {activeAction !== "examine" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="rounded-sm border border-primary/25 bg-card/80 px-2.5 py-1 backdrop-blur-sm"
            >
              <p className="font-serif text-[10px] uppercase tracking-widest text-primary/70">
                {activeAction} mode active — click an object
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <div className="rounded-sm border border-border/30 bg-card/50 px-2.5 py-1 backdrop-blur-sm">
          <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/60">
            {HOTSPOTS.length} objects · {HOTSPOTS.filter(h => examinedIds.has(h.id)).length} examined
          </p>
        </div>
      </div>
    </div>
  );
}
