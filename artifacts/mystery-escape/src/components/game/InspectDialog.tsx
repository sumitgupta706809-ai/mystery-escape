import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Hand, Zap, CheckCheck } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useInventory } from "@/contexts/InventoryContext";

interface HotspotDetail {
  flavor: string;
  canTake?: boolean;
  itemId?: string;
  itemPreviewIcon?: string;
  itemPreviewName?: string;
}

const HOTSPOT_DETAILS: Record<string, HotspotDetail> = {
  desk: {
    flavor: "An ornate mahogany desk covered in scattered papers and a brass inkwell. A secret drawer sits slightly ajar beneath the main surface. The papers appear to be correspondence — letters referencing a combination.",
    canTake: false,
  },
  painting: {
    flavor: "A faded oil portrait of a stern-faced Victorian gentleman in a dark coat. His eyes are unsettling — painted in such a way they seem to follow you. Behind the frame, a small folded note is tucked.",
    canTake: true,
    itemId: "painting-note",
    itemPreviewIcon: "📋",
    itemPreviewName: "Folded Note",
  },
  clock: {
    flavor: "A grandfather clock frozen at 11:47. The pendulum hangs completely motionless, as if time itself holds its breath in this room. The numerals on the face are Roman — IV, VIII, XI. The number 11:47 feels important.",
    canTake: false,
  },
  bookcase: {
    flavor: "Rows of leather-bound volumes coated in a thin layer of dust. One book — 'The Mysteries of Hargrove Hall' — protrudes noticeably from the shelf. It seems to be a lever of some kind.",
    canTake: false,
  },
  fireplace: {
    flavor: "A cold hearth with long-dead embers. A brass poker leans against the stonework. Among the ashes, something metallic catches your eye — it seems to have survived the fire.",
    canTake: true,
    itemId: "fireplace-ring",
    itemPreviewIcon: "⭕",
    itemPreviewName: "Iron Ring",
  },
  safe: {
    flavor: "A wall safe hidden behind a loose panel, now exposed. Its combination dial bears faint scratches suggesting it has been opened recently. It requires a 3-digit combination to open.",
    canTake: false,
  },
};

export function InspectDialog() {
  const {
    inspectTarget, closeInspect, markExamined, completeObjective,
    activeAction, takenIds, markTaken,
  } = useGame();
  const { addItem } = useInventory();

  const handleClose = () => {
    if (inspectTarget) {
      markExamined(inspectTarget.id);
      if (inspectTarget.id === "desk")     completeObjective("search-desk");
      if (inspectTarget.id === "painting") completeObjective("examine-portrait");
      if (inspectTarget.id === "clock")    completeObjective("check-clock");
    }
    closeInspect();
  };

  const handleTake = () => {
    if (!inspectTarget) return;
    const details = HOTSPOT_DETAILS[inspectTarget.id];
    if (details?.canTake && details.itemId && !takenIds.has(inspectTarget.id)) {
      const added = addItem(details.itemId);
      if (added) markTaken(inspectTarget.id);
    }
    handleClose();
  };

  const details = inspectTarget ? HOTSPOT_DETAILS[inspectTarget.id] : null;
  const alreadyTaken = inspectTarget ? takenIds.has(inspectTarget.id) : false;
  const canTakeNow = details?.canTake && !alreadyTaken;

  return (
    <AnimatePresence>
      {inspectTarget && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
            data-testid="inspect-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-x-4 bottom-32 z-50 mx-auto max-w-lg md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px]"
            data-testid="inspect-dialog"
          >
            <div className="rounded-sm border border-primary/25 bg-card/98 shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">

              <div className="flex items-start justify-between gap-3 border-b border-border/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/20 bg-primary/5">
                    <Eye className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-serif uppercase tracking-widest text-muted-foreground">
                      {activeAction === "examine" ? "Examining" : activeAction === "take" ? "Taking" : "Inspecting"}
                    </p>
                    <h3 className="font-serif text-base text-foreground">{inspectTarget.label}</h3>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-sm border border-border/40 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  data-testid="btn-close-inspect"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>

              <div className="px-5 py-4">
                <p className="font-serif text-sm text-foreground/75 leading-relaxed">
                  {details?.flavor ?? inspectTarget.description}
                </p>

                {details?.canTake && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-sm border border-border/30 bg-secondary/20 px-3 py-2">
                    <span className="text-lg leading-none">{details.itemPreviewIcon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xs text-foreground/80">{details.itemPreviewName}</p>
                      <p className="font-serif text-[10px] text-muted-foreground/60">
                        {alreadyTaken ? "Already taken" : "Can be picked up"}
                      </p>
                    </div>
                    {alreadyTaken && (
                      <CheckCheck className="h-4 w-4 text-emerald-400/60 shrink-0" strokeWidth={1.5} />
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-border/40 px-5 py-3">
                {canTakeNow && (
                  <button
                    onClick={handleTake}
                    className="flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 font-serif text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                    data-testid="btn-take-item"
                  >
                    <Hand className="h-3 w-3" strokeWidth={1.5} />
                    Take {details?.itemPreviewName}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex items-center gap-1.5 rounded-sm border border-border/40 bg-secondary/30 px-3 py-2 font-serif text-xs uppercase tracking-widest text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                  data-testid="btn-examine-done"
                >
                  <Zap className="h-3 w-3" strokeWidth={1.5} />
                  Done
                </button>
                <button
                  onClick={handleClose}
                  className="ml-auto rounded-sm border border-border/30 px-3 py-2 font-serif text-xs text-muted-foreground/60 transition-all hover:text-muted-foreground"
                  data-testid="btn-back-inspect"
                >
                  Step Back
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
