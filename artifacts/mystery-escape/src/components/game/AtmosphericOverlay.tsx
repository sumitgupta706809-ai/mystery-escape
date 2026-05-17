import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function DustMote({ delay, duration, x, size }: { delay: number; duration: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20 pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size, bottom: "-10px" }}
      animate={{
        y: [0, -window.innerHeight - 20],
        x: [0, (Math.random() - 0.5) * 80],
        opacity: [0, 0.6, 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

const MOTES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: (i * 1.3) % 8,
  duration: 8 + (i * 0.7) % 6,
  x: (i * 17 + 5) % 95,
  size: 1 + (i % 3),
}));

export function AtmosphericOverlay() {
  const flickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    let t = 0;
    const flicker = () => {
      t += 0.015;
      const intensity = 0.03 + Math.abs(Math.sin(t * 1.3) * Math.cos(t * 0.7)) * 0.04;
      if (flickerRef.current) {
        flickerRef.current.style.opacity = String(intensity);
      }
      raf = requestAnimationFrame(flicker);
    };
    raf = requestAnimationFrame(flicker);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <div ref={flickerRef} className="absolute inset-0 bg-amber-900/30 transition-none" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/40 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/40 to-transparent" />

      {MOTES.map((m) => (
        <DustMote key={m.id} {...m} />
      ))}
    </div>
  );
}
