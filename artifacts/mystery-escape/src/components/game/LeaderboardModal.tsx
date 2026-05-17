import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Clock, Lightbulb, Loader2, Medal } from "lucide-react";
import { api, type LeaderboardEntry } from "@/lib/api";
import { cn } from "@/lib/utils";

interface LeaderboardModalProps {
  open: boolean;
  onClose: () => void;
  defaultRoom?: string;
}

const ROOMS = [
  { id: "victorian-manor",  label: "Victorian Manor" },
  { id: "underground-lab",  label: "Underground Lab" },
];

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const MEDAL_COLORS = [
  "text-yellow-400",
  "text-slate-300",
  "text-amber-600",
];

export function LeaderboardModal({ open, onClose, defaultRoom = "victorian-manor" }: LeaderboardModalProps) {
  const [room, setRoom] = useState(defaultRoom);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    setError(null);
    api.leaderboard.fetch(room, 15)
      .then(setEntries)
      .catch(() => setError("Could not load leaderboard"))
      .finally(() => setIsLoading(false));
  }, [open, room]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-[4px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[100] mx-auto max-w-md"
          >
            <div className="rounded-sm border border-primary/30 bg-card/99 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden max-h-[80vh] flex flex-col">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/20 bg-primary/5">
                    <Trophy className="h-4 w-4 text-primary/70" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-serif text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">Rankings</p>
                    <h2 className="font-serif text-base text-foreground/95">Leaderboard</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-sm border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>

              {/* Room tabs */}
              <div className="flex border-b border-border/40 shrink-0">
                {ROOMS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRoom(r.id)}
                    className={cn(
                      "flex-1 py-2.5 font-serif text-[10px] uppercase tracking-widest transition-all",
                      room === r.id
                        ? "text-primary border-b-2 border-primary/60 bg-primary/5"
                        : "text-muted-foreground/50 hover:text-muted-foreground"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Entries */}
              <div className="overflow-y-auto flex-1 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary/40" strokeWidth={1.5} />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="font-serif text-sm text-muted-foreground/50">{error}</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <Trophy className="h-8 w-8 text-muted-foreground/20" strokeWidth={1} />
                    <p className="font-serif text-sm text-muted-foreground/40">No entries yet</p>
                    <p className="font-serif text-xs text-muted-foreground/25">Complete a room to appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {entries.map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/3 transition-colors"
                      >
                        <div className="w-7 shrink-0 text-center">
                          {i < 3 ? (
                            <Medal className={cn("h-4 w-4 mx-auto", MEDAL_COLORS[i])} strokeWidth={1.5} />
                          ) : (
                            <span className="font-mono text-xs text-muted-foreground/40">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-sm text-foreground/80 truncate">{entry.username}</p>
                          <p className="font-serif text-[9px] text-muted-foreground/40 uppercase tracking-wide">
                            {new Date(entry.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 text-muted-foreground/50">
                            <Lightbulb className="h-3 w-3" strokeWidth={1.5} />
                            <span className="font-mono text-[10px]">{entry.hintsUsed}</span>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 font-mono text-sm",
                            i === 0 ? "text-primary" : "text-foreground/60"
                          )}>
                            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                            {formatTime(entry.seconds)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
