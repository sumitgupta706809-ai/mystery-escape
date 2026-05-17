import { motion, AnimatePresence } from "framer-motion";
import { Play, Settings, LogOut, Home } from "lucide-react";
import { Link } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { SettingsModal } from "@/components/shared/SettingsModal";
import { useState } from "react";

export function PauseMenu() {
  const { paused, setPaused } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {paused && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              data-testid="pause-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              data-testid="pause-menu"
            >
              <div className="w-72 rounded-sm border border-border bg-card shadow-[0_0_80px_rgba(0,0,0,0.9)]">
                <div className="border-b border-border/50 px-6 py-5 text-center">
                  <div className="mb-1 font-serif text-[10px] uppercase tracking-widest text-muted-foreground">
                    Paused
                  </div>
                  <h2 className="font-serif text-2xl text-foreground">The Victorian Manor</h2>
                </div>

                <div className="p-4 space-y-2">
                  <PauseButton
                    icon={<Play className="h-4 w-4" strokeWidth={1.5} />}
                    label="Resume"
                    onClick={() => setPaused(false)}
                    primary
                    testId="btn-resume"
                  />
                  <PauseButton
                    icon={<Settings className="h-4 w-4" strokeWidth={1.5} />}
                    label="Settings"
                    onClick={() => setSettingsOpen(true)}
                    testId="btn-pause-settings"
                  />
                  <div className="pt-1 border-t border-border/30">
                    <Link href="/">
                      <PauseButton
                        icon={<Home className="h-4 w-4" strokeWidth={1.5} />}
                        label="Exit to Main Menu"
                        onClick={() => {}}
                        danger
                        testId="btn-exit-to-menu"
                      />
                    </Link>
                  </div>
                </div>

                <div className="px-6 pb-4 text-center">
                  <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest">
                    Press ESC to resume
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

function PauseButton({
  icon,
  label,
  onClick,
  primary,
  danger,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-sm border px-4 py-3 font-serif text-sm uppercase tracking-widest transition-all
        ${primary
          ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          : danger
            ? "border-destructive/20 bg-transparent text-muted-foreground hover:border-destructive/40 hover:text-destructive"
            : "border-border/40 bg-secondary/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
        }`}
      data-testid={testId}
    >
      {icon}
      {label}
    </button>
  );
}
