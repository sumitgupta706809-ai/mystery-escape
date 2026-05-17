import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, MousePointer } from "lucide-react";

interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
}

const HOTSPOTS: Hotspot[] = [
  { id: "desk", label: "Antique Desk", x: 25, y: 65 },
  { id: "painting", label: "Faded Portrait", x: 60, y: 35 },
  { id: "clock", label: "Stopped Clock", x: 80, y: 55 },
  { id: "bookcase", label: "Dusty Bookcase", x: 15, y: 45 },
];

export function RoomScene() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);

  const handleHotspotClick = (id: string) => {
    setClickedHotspot(id);
    setTimeout(() => setClickedHotspot(null), 1500);
  };

  return (
    <div
      className="relative w-full h-full min-h-[320px] rounded-sm overflow-hidden border border-border bg-secondary/20"
      data-testid="room-scene"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-stone-950/60 to-zinc-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(180,120,40,0.08)_0%,transparent_70%)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3 opacity-30">
          <div className="font-serif text-6xl text-primary/40 select-none">⊕</div>
          <p className="font-serif text-xs uppercase tracking-widest text-muted-foreground">
            Victorian Manor · East Wing
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card/60 to-transparent" />

      {HOTSPOTS.map((spot) => (
        <motion.button
          key={spot.id}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
          onHoverStart={() => setHoveredHotspot(spot.id)}
          onHoverEnd={() => setHoveredHotspot(null)}
          onClick={() => handleHotspotClick(spot.id)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          data-testid={`hotspot-${spot.id}`}
        >
          <motion.div
            animate={{
              scale: hoveredHotspot === spot.id ? [1, 1.3, 1] : 1,
            }}
            transition={{ repeat: hoveredHotspot === spot.id ? Infinity : 0, duration: 1.5 }}
            className="h-5 w-5 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center shadow-[0_0_8px_rgba(224,153,30,0.3)]"
          >
            <MousePointer className="h-2.5 w-2.5 text-primary/80" strokeWidth={2} />
          </motion.div>

          {hoveredHotspot === spot.id && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-sm border border-primary/20 bg-card/90 px-2 py-1 text-xs text-primary/80 backdrop-blur-sm pointer-events-none font-serif tracking-wide"
            >
              {spot.label}
            </motion.div>
          )}
        </motion.button>
      ))}

      {clickedHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-4 right-4 rounded-sm border border-primary/20 bg-card/90 p-3 backdrop-blur-sm"
          data-testid="hotspot-description"
        >
          <div className="flex items-start gap-2">
            <Eye className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" strokeWidth={1.5} />
            <p className="text-xs text-foreground/70 leading-relaxed font-serif">
              {clickedHotspot === "desk" && "An ornate mahogany desk covered in scattered papers and a brass inkwell. Something seems out of place..."}
              {clickedHotspot === "painting" && "A faded portrait of a stern-faced Victorian gentleman. His eyes seem to follow you across the room."}
              {clickedHotspot === "clock" && "A grandfather clock frozen at 11:47. The pendulum hangs motionless, as if time itself holds its breath."}
              {clickedHotspot === "bookcase" && "Rows of leather-bound volumes coated in dust. One book protrudes slightly from the shelf..."}
            </p>
          </div>
        </motion.div>
      )}

      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-sm border border-border/40 bg-card/60 px-2 py-1 backdrop-blur-sm">
        <Eye className="h-3 w-3 text-primary/50" strokeWidth={1.5} />
        <span className="text-[10px] font-serif uppercase tracking-widest text-muted-foreground">
          {HOTSPOTS.length} objects
        </span>
      </div>
    </div>
  );
}
