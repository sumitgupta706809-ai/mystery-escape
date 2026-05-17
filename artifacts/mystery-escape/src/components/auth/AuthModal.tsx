import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, LogIn, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Tab = "login" | "register";

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const { login, register, error, clearError, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError ?? error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    if (!username.trim() || !password.trim()) {
      setLocalError("Please fill in all fields");
      return;
    }
    try {
      if (tab === "login") {
        await login(username.trim(), password);
      } else {
        if (username.length < 2) { setLocalError("Username must be at least 2 characters"); return; }
        if (password.length < 6) { setLocalError("Password must be at least 6 characters"); return; }
        await register(username.trim(), password);
      }
      onSuccess?.();
      onClose();
    } catch {}
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setLocalError(null);
    clearError();
  };

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
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[100] mx-auto max-w-sm"
          >
            <div className="rounded-sm border border-primary/30 bg-card/99 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40">
                <div>
                  <p className="font-serif text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
                    Hargrove Research Institute
                  </p>
                  <h2 className="font-serif text-lg text-foreground/95">
                    {tab === "login" ? "Sign In" : "Create Account"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-sm border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border/40">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className={cn(
                      "flex-1 py-2.5 font-serif text-[11px] uppercase tracking-widest transition-all",
                      tab === t
                        ? "text-primary border-b-2 border-primary/60 bg-primary/5"
                        : "text-muted-foreground/50 hover:text-muted-foreground"
                    )}
                  >
                    {t === "login" ? "Sign In" : "Register"}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
                <div className="space-y-1.5">
                  <label className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      placeholder={tab === "register" ? "2–24 chars, letters/numbers" : "Your username"}
                      className="w-full rounded-sm border border-border/50 bg-secondary/30 pl-9 pr-3 py-2 font-serif text-sm text-foreground/85 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                      placeholder={tab === "register" ? "Min. 6 characters" : "Your password"}
                      className="w-full rounded-sm border border-border/50 bg-secondary/30 pl-9 pr-3 py-2 font-serif text-sm text-foreground/85 placeholder:text-muted-foreground/30 focus:border-primary/50 focus:outline-none focus:ring-0 transition-colors"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {displayError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-3 py-2"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-destructive/70 shrink-0 mt-0.5" strokeWidth={1.5} />
                      <p className="font-serif text-xs text-destructive/80">{displayError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-sm border border-primary/50 bg-primary/15 py-2.5 font-serif text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  ) : tab === "login" ? (
                    <><LogIn className="h-3.5 w-3.5" strokeWidth={1.5} /> Sign In</>
                  ) : (
                    <><UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} /> Create Account</>
                  )}
                </button>
              </form>

              <div className="px-5 pb-4">
                <p className="font-serif text-[10px] text-center text-muted-foreground/35">
                  {tab === "login"
                    ? "Progress saves automatically when signed in."
                    : "Your escape progress will be saved to your account."}
                </p>
              </div>

              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
