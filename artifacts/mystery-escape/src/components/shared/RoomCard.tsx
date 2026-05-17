import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { DifficultyBadge } from "@/components/shared/DifficultyBadge";
import { cn } from "@/lib/utils";

const ROOM_GRADIENTS = [
  "from-amber-950/60 via-stone-900/80 to-zinc-950",
  "from-red-950/60 via-stone-900/80 to-zinc-950",
  "from-blue-950/60 via-stone-900/80 to-zinc-950",
  "from-purple-950/60 via-stone-900/80 to-zinc-950",
];

interface RoomCardProps {
  id: string;
  name: string;
  difficulty: number;
  time: string;
  players: string;
  index?: number;
}

export function RoomCard({ id, name, difficulty, time, players, index = 0 }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-sm border border-border bg-card cursor-pointer hover:border-primary/50 hover:shadow-[0_0_24px_rgba(224,153,30,0.12)] transition-all duration-300"
      data-testid={`room-card-${id}`}
    >
      <div className={cn("h-40 w-full bg-gradient-to-b", ROOM_GRADIENTS[index % ROOM_GRADIENTS.length])}>
        <div className="flex h-full items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
            <div className="font-serif text-5xl text-primary/20 select-none group-hover:text-primary/30 transition-colors duration-500">
              {name.charAt(0)}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-serif text-base text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>

        <DifficultyBadge difficulty={difficulty} className="mb-3" />

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1" data-testid={`room-time-${id}`}>
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {time}
          </span>
          <span className="flex items-center gap-1" data-testid={`room-players-${id}`}>
            <Users className="h-3 w-3" strokeWidth={1.5} />
            {players} players
          </span>
        </div>

        <Link href="/game">
          <button
            className="w-full rounded-sm border border-primary/30 bg-primary/5 py-2 font-serif text-xs uppercase tracking-widest text-primary/80 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
            data-testid={`btn-play-${id}`}
          >
            Enter Room
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
