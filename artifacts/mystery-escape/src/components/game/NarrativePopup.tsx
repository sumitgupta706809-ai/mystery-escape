import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, FileText, AlertTriangle, Brain } from "lucide-react";
import { useStory, type MessageType } from "@/contexts/StoryContext";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<MessageType, {
  icon: typeof Terminal;
  border: string;
  glow: string;
  senderColor: string;
  textColor: string;
  bg: string;
  label: string;
}> = {
  aria: {
    icon: Terminal,
    border: "border-emerald-500/40",
    glow: "shadow-[0_0_24px_rgba(34,197,94,0.15)]",
    senderColor: "text-emerald-400",
    textColor: "text-emerald-100/80",
    bg: "bg-emerald-950/60",
    label: "ARIA",
  },
  note: {
    icon: FileText,
    border: "border-amber-700/40",
    glow: "shadow-[0_0_20px_rgba(180,100,0,0.15)]",
    senderColor: "text-amber-400/90",
    textColor: "text-amber-100/75",
    bg: "bg-amber-950/50",
    label: "NOTE",
  },
  system: {
    icon: AlertTriangle,
    border: "border-red-500/40",
    glow: "shadow-[0_0_24px_rgba(239,68,68,0.15)]",
    senderColor: "text-red-400",
    textColor: "text-red-100/80",
    bg: "bg-red-950/50",
    label: "ALERT",
  },
  memory: {
    icon: Brain,
    border: "border-violet-500/40",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.15)]",
    senderColor: "text-violet-400",
    textColor: "text-violet-100/75",
    bg: "bg-violet-950/50",
    label: "MEMORY",
  },
};

const TYPING_SPEED = 22;
const AUTO_DISMISS_EXTRA = 3500;

export function NarrativePopup() {
  const { currentMessage, dismissMessage } = useStory();
  const [displayed, setDisplayed] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!currentMessage) {
      setDisplayed("");
      setTypingDone(false);
      return;
    }
    setDisplayed("");
    setTypingDone(false);

    const text = currentMessage.text;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [currentMessage]);

  useEffect(() => {
    if (!typingDone || !currentMessage) return;
    const readTime = Math.max(AUTO_DISMISS_EXTRA, currentMessage.text.length * 40);
    const t = setTimeout(dismissMessage, readTime);
    return () => clearTimeout(t);
  }, [typingDone, currentMessage, dismissMessage]);

  const skipToEnd = useCallback(() => {
    if (!currentMessage) return;
    setDisplayed(currentMessage.text);
    setTypingDone(true);
  }, [currentMessage]);

  if (!currentMessage) return null;

  const cfg = TYPE_CONFIG[currentMessage.type];
  const Icon = cfg.icon;
  const progress = currentMessage.text.length > 0
    ? (displayed.length / currentMessage.text.length) * 100
    : 100;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentMessage.id}
        initial={{ opacity: 0, x: 40, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 30, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        className={cn(
          "fixed right-4 bottom-40 z-[55] w-[min(320px,calc(100vw-2rem))]",
          "rounded-sm border backdrop-blur-md overflow-hidden",
          cfg.border, cfg.glow, cfg.bg
        )}
        data-testid="narrative-popup"
      >
        {/* Top accent line */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-[1.5px]",
          currentMessage.type === "aria"   ? "bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" :
          currentMessage.type === "system" ? "bg-gradient-to-r from-transparent via-red-400/60 to-transparent" :
          currentMessage.type === "memory" ? "bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" :
                                             "bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
        )} />

        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-5 w-5 items-center justify-center rounded-sm border",
              cfg.border
            )}>
              <Icon className={cn("h-3 w-3", cfg.senderColor)} strokeWidth={1.5} />
            </div>
            <div>
              <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em]", cfg.senderColor)}>
                {currentMessage.sender}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Label badge */}
            <span className={cn(
              "font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border",
              cfg.border, cfg.senderColor, "opacity-60"
            )}>
              {cfg.label}
            </span>
            <button
              onClick={dismissMessage}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
                cfg.border, "text-muted-foreground/40 hover:text-muted-foreground/80"
              )}
            >
              <X className="h-2.5 w-2.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Text body */}
        <div
          className="px-3 pb-3 cursor-pointer"
          onClick={!typingDone ? skipToEnd : undefined}
        >
          <p className={cn(
            "font-mono text-[11px] leading-relaxed",
            currentMessage.type === "note" ? "font-serif text-[12px]" : "",
            cfg.textColor
          )}>
            {displayed}
            {!typingDone && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={cn("inline-block ml-0.5 w-1.5 h-3 align-middle", cfg.senderColor.replace("text-", "bg-"))}
              />
            )}
          </p>
          {!typingDone && (
            <p className="font-mono text-[9px] text-muted-foreground/30 mt-1.5">
              Click to skip
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-black/30">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: typingDone ? "100%" : `${progress}%` }}
            transition={{ duration: typingDone ? (AUTO_DISMISS_EXTRA / 1000) : 0 }}
            className={cn(
              "h-full",
              currentMessage.type === "aria"   ? "bg-emerald-400/50" :
              currentMessage.type === "system" ? "bg-red-400/50" :
              currentMessage.type === "memory" ? "bg-violet-400/50" :
                                                 "bg-amber-400/50"
            )}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
