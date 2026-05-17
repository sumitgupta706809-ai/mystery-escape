import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useInventory } from "@/contexts/InventoryContext";
import { cn } from "@/lib/utils";

export function UseFeedbackToast() {
  const { feedback, clearFeedback } = useInventory();

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(clearFeedback, 3200);
    return () => clearTimeout(t);
  }, [feedback, clearFeedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          key={feedback.message + feedback.type}
          initial={{ opacity: 0, y: -12, x: "-50%", scale: 0.92 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -8, x: "-50%", scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed top-16 left-1/2 z-[80] pointer-events-none max-w-xs w-full px-4"
          data-testid="use-feedback-toast"
        >
          <div className={cn(
            "flex items-start gap-2.5 rounded-sm border px-3 py-2.5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.7)]",
            feedback.type === "success"
              ? "border-emerald-700/40 bg-card/95"
              : "border-destructive/30 bg-card/95"
          )}>
            {feedback.type === "success"
              ? <CheckCircle className="h-4 w-4 text-emerald-400/80 shrink-0 mt-0.5" strokeWidth={1.5} />
              : <XCircle    className="h-4 w-4 text-destructive/70 shrink-0 mt-0.5" strokeWidth={1.5} />
            }
            <p className={cn(
              "font-serif text-xs leading-relaxed",
              feedback.type === "success" ? "text-foreground/85" : "text-foreground/75"
            )}>
              {feedback.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
