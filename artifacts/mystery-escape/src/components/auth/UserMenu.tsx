import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Save, RotateCcw, ChevronDown, Trophy, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  onOpenAuth: () => void;
  onSave?: () => void;
  onNewGame?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export function UserMenu({ onOpenAuth, onSave, onNewGame, isSaving, lastSaved }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-1.5 rounded-sm border border-border/40 bg-card/70 px-3 py-1.5 font-serif text-xs text-muted-foreground backdrop-blur-md transition-all hover:border-primary/30 hover:text-primary"
      >
        <User className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-sm border px-3 py-1.5 backdrop-blur-md transition-all",
          open
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border/40 bg-card/70 text-muted-foreground hover:border-primary/30 hover:text-foreground"
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <User className="h-3 w-3 text-primary/70" strokeWidth={1.5} />
        </div>
        <span className="font-serif text-[10px] uppercase tracking-widest max-w-[80px] truncate">
          {user.username}
        </span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open ? "rotate-180" : "")} strokeWidth={2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1.5 w-52 rounded-sm border border-border/50 bg-card/99 shadow-[0_8px_32px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden z-50"
          >
            <div className="border-b border-border/30 px-3 py-2.5">
              <p className="font-serif text-xs text-foreground/80">{user.username}</p>
              {lastSaved && (
                <p className="font-serif text-[9px] text-muted-foreground/40 mt-0.5">
                  Saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="py-1">
              {onSave && (
                <button
                  onClick={() => { onSave(); setOpen(false); }}
                  disabled={isSaving}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-serif text-xs text-foreground/70 hover:bg-primary/5 hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {isSaving
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/60" strokeWidth={1.5} />
                    : <Save className="h-3.5 w-3.5 text-primary/60" strokeWidth={1.5} />
                  }
                  {isSaving ? "Saving..." : "Save Progress"}
                </button>
              )}
              {onNewGame && (
                <button
                  onClick={() => { onNewGame(); setOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-serif text-xs text-foreground/70 hover:bg-primary/5 hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
                  New Game
                </button>
              )}
              <div className="h-px bg-border/30 my-1" />
              <button
                onClick={async () => { await logout(); setOpen(false); }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left font-serif text-xs text-muted-foreground/60 hover:bg-destructive/5 hover:text-destructive transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
