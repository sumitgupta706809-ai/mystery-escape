import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

export function RoomTransition() {
  const { isTransitioning } = useGame();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
          data-testid="room-transition"
        >
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, originX: 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-card"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="relative z-10 text-center space-y-3"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="font-serif text-4xl text-primary/40 select-none"
            >
              ✦
            </motion.div>
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Entering next room...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
