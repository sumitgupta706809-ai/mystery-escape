import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractionMarker } from "@/components/game/InteractionMarker";
import { useGame, type HotspotData } from "@/contexts/GameContext";
import { useInventory } from "@/contexts/InventoryContext";
import { usePuzzle } from "@/contexts/PuzzleContext";
import { useStory } from "@/contexts/StoryContext";
import type { PuzzleDefinition } from "@/puzzles/types";

const LAB_HOTSPOTS: HotspotData[] = [
  { id: "lab-emergency-locker", label: "Emergency Locker",  x: 12, y: 58, description: "A red emergency locker bolted to the wall. The latch is broken off." },
  { id: "lab-dark-corner",      label: "Dark Corner",       x: 30, y: 48, description: "A pitch-black corner of the lab. Something could be hidden there." },
  { id: "lab-filing-cabinet",   label: "Filing Cabinet",    x: 46, y: 65, description: "A heavy steel filing cabinet secured with a 4-digit combination lock.", puzzleId: "lab-cabinet-keypad" },
  { id: "lab-specimen-shelf",   label: "Specimen Shelf",    x: 62, y: 32, description: "Metal shelving holding broken equipment and labelled sample jars." },
  { id: "lab-broken-terminal",  label: "Broken Terminal",   x: 76, y: 55, description: "A cracked computer terminal — the screen is dark but the power LED blinks.", puzzleId: "lab-terminal-symbol" },
  { id: "lab-security-door",    label: "Security Door",     x: 91, y: 68, description: "A heavy steel security door with an electronic keypad. The exit.", puzzleId: "lab-door-keypad" },
];

const LAB_PUZZLES: Record<string, PuzzleDefinition> = {
  "lab-cabinet-keypad": {
    id: "lab-cabinet-keypad",
    type: "keypad",
    title: "Filing Cabinet",
    description: "A 4-digit combination lock secures the cabinet. Someone hid a code nearby.",
    config: { digits: 4, solution: "4729", hint: "Numbers scratched into the concrete near the dark corner: 4 · 7 · 2 · 9" },
  },
  "lab-terminal-symbol": {
    id: "lab-terminal-symbol",
    type: "symbol-match",
    title: "Terminal Boot Sequence",
    description: "The terminal requires its boot sequence entered in the correct order.",
    config: {
      pool: ["⚡", "◈", "△", "⊕", "☽", "♾", "⚗", "✦"],
      solution: ["⚡", "◈", "△"],
      hint: "A stencil above the monitor reads: ⚡ · ◈ · △ — power, signal, transmit.",
    },
  },
  "lab-door-keypad": {
    id: "lab-door-keypad",
    type: "keypad",
    title: "Security Door",
    description: "The exit requires a 4-digit override code. The restored terminal should have it.",
    config: { digits: 4, solution: "0372", hint: "The terminal scrolls: EMERGENCY OVERRIDE — 03-72" },
  },
};

function FlickerLights() {
  const [level, setLevel] = useState(1);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const flicker = () => {
      const rand = Math.random();
      if (rand < 0.12) {
        setLevel(0.08);
        timeout = setTimeout(() => {
          setLevel(0.85);
          timeout = setTimeout(() => {
            setLevel(0.15);
            timeout = setTimeout(() => {
              setLevel(0.92);
              timeout = setTimeout(() => {
                setLevel(0.05);
                timeout = setTimeout(() => {
                  setLevel(1);
                  timeout = setTimeout(flicker, 4000 + Math.random() * 6000);
                }, 60);
              }, 80);
            }, 50);
          }, 90);
        }, 110);
      } else {
        setLevel(0.88 + Math.random() * 0.12);
        timeout = setTimeout(flicker, 300 + Math.random() * 900);
      }
    };
    timeout = setTimeout(flicker, 2000 + Math.random() * 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      animate={{ opacity: level }}
      transition={{ duration: 0.04 }}
      className="absolute inset-0 pointer-events-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_45%_at_50%_5%,rgba(160,230,255,0.055)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_25%_at_76%_55%,rgba(34,197,94,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
      <div className="absolute left-[5%] top-[3%] w-[18%] h-[3px] bg-cyan-200/15 rounded-full blur-sm" />
      <div className="absolute left-[40%] top-[3%] w-[22%] h-[3px] bg-cyan-200/15 rounded-full blur-sm" />
      <div className="absolute right-[8%] top-[3%] w-[15%] h-[3px] bg-cyan-200/15 rounded-full blur-sm" />
    </motion.div>
  );
}

function LabGeometry() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-slate-950/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] border-t border-cyan-900/20" />
      <div className="absolute border border-cyan-900/25 bg-slate-900/30 rounded-sm"
        style={{ left: "3%", top: "35%", width: "16%", height: "55%" }} />
      <div className="absolute border-t border-cyan-900/15" style={{ left: "3%", top: "52%", width: "16%", height: "1px" }} />
      <div className="absolute border-t border-cyan-900/15" style={{ left: "3%", top: "69%", width: "16%", height: "1px" }} />
      <div className="absolute w-[3px] bg-cyan-800/20 rounded-full" style={{ left: "10.5%", top: "42%", height: "12%" }} />
      <div className="absolute w-[3px] bg-cyan-800/20 rounded-full" style={{ left: "10.5%", top: "59%", height: "12%" }} />
      <div className="absolute border border-cyan-900/20 bg-slate-900/20 rounded-sm"
        style={{ left: "30%", top: "62%", width: "28%", height: "28%" }} />
      <div className="absolute border-l border-cyan-900/10" style={{ left: "44%", top: "62%", width: "1px", height: "28%" }} />
      <div className="absolute border border-emerald-900/30 bg-slate-900/40 rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.05)]"
        style={{ right: "10%", top: "32%", width: "18%", height: "50%" }} />
      <div className="absolute border border-emerald-800/20 bg-emerald-950/30 rounded-sm"
        style={{ right: "11.5%", top: "36%", width: "15%", height: "22%" }} />
      <div className="absolute animate-pulse" style={{ right: "18%", top: "60%", width: "4%", height: "3px" }}>
        <div className="w-full h-full bg-emerald-400/50 rounded-full blur-[1px]" />
      </div>
      <div className="absolute border border-red-900/30 bg-slate-950/60 rounded-sm"
        style={{ right: "2%", top: "28%", width: "9%", height: "65%" }} />
      <div className="absolute border border-red-900/20" style={{ right: "3.5%", top: "30%", width: "6%", height: "60%" }} />
      <div className="absolute rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
        style={{ right: "5.5%", top: "47%", width: "6px", height: "6px" }} />
      <div className="absolute inset-x-0 top-0 h-[8%] bg-gradient-to-b from-slate-950 to-transparent" />
      <div className="absolute border-b border-cyan-900/15 top-[8%] inset-x-0 h-[1px]" />
      <div className="absolute h-[6%] border-r border-cyan-900/15" style={{ left: "25%", top: "0", width: "1px" }} />
      <div className="absolute h-[6%] border-r border-cyan-900/15" style={{ left: "55%", top: "0", width: "1px" }} />
      <div className="absolute h-[6%] border-r border-cyan-900/15" style={{ left: "80%", top: "0", width: "1px" }} />
      <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-slate-950/60 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-slate-950/60 to-transparent" />
      <div className="absolute bottom-[6%] left-[18%] right-[18%] h-[3px] bg-gradient-to-r from-transparent via-yellow-600/15 to-transparent" />
    </div>
  );
}

export function LabScene() {
  const { openInspect, examinedIds, markExamined, activeAction, completeObjective } = useGame();
  const { selectedSlot, selectedItem, useItem } = useInventory();
  const { openPuzzle, solvedIds } = usePuzzle();
  const { triggerBeat } = useStory();
  const [cornerRevealed, setCornerRevealed] = useState(false);
  const solvedCountRef = useRef(0);

  // Lab enter beat
  useEffect(() => {
    const t = setTimeout(() => triggerBeat("lab-enter"), 1800);
    return () => clearTimeout(t);
  }, [triggerBeat]);

  // Puzzle-solve beats
  useEffect(() => {
    const nowSolved = ["lab-cabinet-keypad", "lab-terminal-symbol", "lab-door-keypad"]
      .filter(id => solvedIds.has(id)).length;

    if (nowSolved > solvedCountRef.current) {
      if (solvedIds.has("lab-cabinet-keypad")) triggerBeat("lab-cabinet-solved");
      if (solvedIds.has("lab-terminal-symbol")) triggerBeat("lab-terminal-solved");
      solvedCountRef.current = nowSolved;
    }

    if (solvedIds.has("lab-cabinet-keypad")) completeObjective("open-cabinet");
    if (solvedIds.has("lab-terminal-symbol")) completeObjective("restore-terminal");
    if (solvedIds.has("lab-door-keypad"))    completeObjective("unlock-door");
  }, [solvedIds, completeObjective, triggerBeat]);

  const handleActivate = useCallback((hotspot: HotspotData) => {
    if (activeAction === "use") {
      if (!selectedItem || selectedSlot === null) {
        openInspect(hotspot);
        return;
      }
      if (hotspot.id === "lab-dark-corner" && selectedItem.id === "flashlight") {
        setCornerRevealed(true);
        markExamined("lab-dark-corner");
        completeObjective("reveal-code");
        useItem(selectedSlot, "lab-dark-corner");
        setTimeout(() => triggerBeat("lab-corner-revealed"), 900);
        openInspect({
          ...hotspot,
          label: "Dark Corner — Revealed",
          description: "The flashlight cuts through the dark. Numbers scratched deep into the concrete: 4 · 7 · 2 · 9",
        });
        return;
      }
      useItem(selectedSlot, hotspot.id);
      return;
    }

    markExamined(hotspot.id);

    if (hotspot.id === "lab-emergency-locker") {
      completeObjective("find-equipment");
    }
    if (hotspot.id === "lab-dark-corner" && cornerRevealed) {
      openInspect({
        ...hotspot,
        label: "Dark Corner — Revealed",
        description: "Numbers scratched into the concrete: 4 · 7 · 2 · 9 — the cabinet combination.",
      });
      return;
    }

    if (hotspot.puzzleId) {
      const def = LAB_PUZZLES[hotspot.puzzleId];
      if (def) {
        if (hotspot.id === "lab-security-door") {
          triggerBeat("lab-door-opened");
        }
        openPuzzle(def);
        return;
      }
    }

    openInspect(hotspot);
  }, [
    activeAction, selectedItem, selectedSlot, cornerRevealed,
    openInspect, openPuzzle, markExamined, useItem, completeObjective, triggerBeat,
  ]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-slate-950 select-none"
      data-testid="lab-scene"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-950/70 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_76%_55%,rgba(34,197,94,0.04)_0%,transparent_70%)]" />

      <LabGeometry />
      <FlickerLights />

      <div className="absolute inset-0 opacity-[0.025] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22><rect width=%222%22 height=%222%22 fill=%22white%22/><rect x=%222%22 y=%222%22 width=%222%22 height=%222%22 fill=%22white%22/></svg>')] pointer-events-none" />

      <div className="absolute inset-0 z-20">
        {LAB_HOTSPOTS.map((spot) => (
          <InteractionMarker
            key={spot.id}
            hotspot={
              spot.id === "lab-dark-corner" && cornerRevealed
                ? { ...spot, label: "Dark Corner — Code Visible" }
                : spot
            }
            examined={examinedIds.has(spot.id)}
            puzzleSolved={spot.puzzleId ? solvedIds.has(spot.puzzleId) : undefined}
            onActivate={handleActivate}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 z-20">
        <AnimatePresence>
          {activeAction !== "examine" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="rounded-sm border border-cyan-500/25 bg-card/80 px-2.5 py-1.5 backdrop-blur-sm"
            >
              <p className="font-serif text-[10px] uppercase tracking-widest text-cyan-400/70">
                {activeAction === "use" && selectedItem
                  ? `Using: ${selectedItem.shortName} — click an object`
                  : activeAction === "use"
                  ? "Select an item, then click an object"
                  : `${activeAction} mode — click an object`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {solvedIds.has("lab-terminal-symbol") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute pointer-events-none"
          style={{ right: "10%", top: "32%", width: "18%", height: "50%" }}
        >
          <div className="w-full h-full rounded-sm border border-emerald-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)]" />
        </motion.div>
      )}

      <div className="absolute top-4 right-4 z-20">
        <div className="rounded-sm border border-cyan-900/40 bg-card/50 px-2.5 py-1 backdrop-blur-sm">
          <p className="font-serif text-[10px] uppercase tracking-widest text-cyan-400/50">
            {LAB_HOTSPOTS.length} objects · {LAB_HOTSPOTS.filter(h => examinedIds.has(h.id)).length} examined
          </p>
        </div>
      </div>
    </div>
  );
}
