import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Hand, Zap, Combine } from "lucide-react";
import { GameProvider, useGame, type ActionMode } from "@/contexts/GameContext";
import { RoomScene } from "@/components/game/RoomScene";
import { InventoryBar } from "@/components/game/InventoryBar";
import { GameHUD } from "@/components/game/GameHUD";
import { PauseMenu } from "@/components/game/PauseMenu";
import { InspectDialog } from "@/components/game/InspectDialog";
import { RoomTransition } from "@/components/game/RoomTransition";
import { cn } from "@/lib/utils";

const ACTIONS: { id: ActionMode; label: string; icon: typeof Search; description: string }[] = [
  { id: "examine", label: "Examine", icon: Search, description: "Look closely at objects" },
  { id: "take", label: "Take", icon: Hand, description: "Pick up items" },
  { id: "use", label: "Use", icon: Zap, description: "Use selected item" },
  { id: "combine", label: "Combine", icon: Combine, description: "Combine two items" },
];

function ActionBar() {
  const { activeAction, setActiveAction } = useGame();

  return (
    <div className="flex items-center justify-center gap-1.5 px-4 py-2 border-t border-border/30 bg-card/60 backdrop-blur-md">
      {ACTIONS.map(({ id, label, icon: Icon, description }) => (
        <motion.button
          key={id}
          onClick={() => setActiveAction(id)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          title={description}
          className={cn(
            "flex items-center gap-2 rounded-sm border px-3 sm:px-4 py-2 font-serif text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-200",
            activeAction === id
              ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_14px_rgba(224,153,30,0.2)]"
              : "border-border/30 bg-secondary/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
          data-testid={`btn-action-${id}`}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}

      <div className="ml-auto hidden lg:flex items-center gap-2 pl-3 border-l border-border/30">
        <span className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground/50">
          Active:
        </span>
        <span className="font-serif text-[10px] text-primary/70 uppercase tracking-widest">
          {ACTIONS.find(a => a.id === activeAction)?.label}
        </span>
      </div>
    </div>
  );
}

function GameLayout() {
  const { setPaused } = useGame();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaused]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col bg-background overflow-hidden"
      data-testid="game-page"
    >
      <div className="relative flex-1 min-h-0">
        <RoomScene />
        <GameHUD />
      </div>

      <ActionBar />
      <InventoryBar />

      <InspectDialog />
      <PauseMenu />
      <RoomTransition />
    </motion.div>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}
