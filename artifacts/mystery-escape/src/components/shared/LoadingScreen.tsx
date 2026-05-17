import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      data-testid="loading-screen"
    >
      <div className="relative mb-8 flex flex-col items-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.7, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <Flame className="h-16 w-16 text-primary" strokeWidth={1} />
        </motion.div>
        
        <div className="absolute top-1/2 -z-10 h-32 w-32 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <h2 className="font-serif text-2xl tracking-widest text-primary/80 mb-6">
        Entering the Manor...
      </h2>

      <div className="h-1 w-64 overflow-hidden rounded-full bg-secondary">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
