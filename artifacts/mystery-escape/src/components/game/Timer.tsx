import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialSeconds?: number;
  className?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Timer({ initialSeconds = 3600, className }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const isLow = seconds <= 60;

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <motion.div
      animate={isLow ? { opacity: [1, 0.6, 1] } : { opacity: 1 }}
      transition={isLow ? { repeat: Infinity, duration: 1 } : {}}
      className={cn(
        "font-mono text-sm tabular-nums tracking-widest transition-colors",
        isLow ? "text-destructive" : "text-foreground/70",
        isLow && "drop-shadow-[0_0_8px_rgba(220,38,38,0.6)]",
        className
      )}
      data-testid="game-timer"
    >
      {formatTime(seconds)}
    </motion.div>
  );
}
