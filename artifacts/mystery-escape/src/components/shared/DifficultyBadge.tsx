import { Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} data-testid="difficulty-badge">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skull
          key={i}
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            i < difficulty ? "text-primary" : "text-muted-foreground/30"
          )}
          strokeWidth={1.5}
          data-testid={`skull-${i < difficulty ? "filled" : "empty"}`}
        />
      ))}
    </div>
  );
}
