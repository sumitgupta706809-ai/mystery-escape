import { motion } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { RoomCard } from "@/components/shared/RoomCard";

const ROOMS = [
  { id: "1", name: "The Victorian Manor", difficulty: 2, time: "45 min", players: "1-4" },
  { id: "2", name: "The Cursed Laboratory", difficulty: 4, time: "60 min", players: "2-4" },
  { id: "3", name: "The Captain's Cabin", difficulty: 3, time: "50 min", players: "1-3" },
  { id: "4", name: "The Forgotten Crypt", difficulty: 5, time: "90 min", players: "2-5" },
];

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <section className="flex flex-col items-center justify-center py-10 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 relative"
          >
            <div className="absolute -inset-x-8 -inset-y-8 bg-primary/5 blur-3xl rounded-full" />
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-foreground drop-shadow-sm">
              MYSTERY <span className="text-primary block mt-2">ESCAPE</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 max-w-2xl text-base sm:text-lg text-muted-foreground font-light tracking-wide px-4"
          >
            Step into the darkness. Solve the puzzles. Escape the room. 
            An atmospheric point-and-click experience awaits those brave enough to enter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link href="/game">
              <button
                className="group relative overflow-hidden rounded-sm border border-primary/50 bg-primary/10 px-8 py-4 font-serif text-xl text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(224,153,30,0.4)]"
                data-testid="btn-begin-escape"
              >
                <span className="relative z-10 uppercase tracking-widest">Begin Your Escape</span>
                <div className="absolute inset-0 -translate-x-full bg-primary/20 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </Link>
          </motion.div>
        </section>

        <section className="py-16">
          <div className="mb-12 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-border" />
            <h2 className="font-serif text-2xl uppercase tracking-widest text-foreground/80">
              Featured Rooms
            </h2>
            <div className="h-[1px] w-12 bg-border" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {ROOMS.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <RoomCard {...room} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
