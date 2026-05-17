import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Settings, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { SettingsModal } from "@/components/shared/SettingsModal";
import { Timer } from "@/components/game/Timer";
import { cn } from "@/lib/utils";

interface NavbarProps {
  isGamePage?: boolean;
  roomName?: string;
  hintsRemaining?: number;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "My Rooms" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar({ isGamePage = false, roomName = "The Victorian Manor", hintsRemaining = 3 }: NavbarProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-16 backdrop-blur-md bg-background/80 border-b border-border"
        data-testid="navbar"
      >
        <Link href="/">
          <span
            className="font-serif text-lg tracking-widest text-primary cursor-pointer hover:text-primary/80 transition-colors"
            data-testid="nav-logo"
          >
            MYSTERY<span className="text-foreground/40 mx-1">·</span>ESCAPE
          </span>
        </Link>

        {isGamePage ? (
          <div className="hidden md:flex items-center gap-6">
            <span className="font-serif text-sm text-foreground/60 uppercase tracking-widest" data-testid="game-room-name">
              {roomName}
            </span>
            <div className="h-4 w-px bg-border" />
            <Timer initialSeconds={3600} />
            <div className="h-4 w-px bg-border" />
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid="hints-counter">
              <Lock className="h-3 w-3 text-primary/60" strokeWidth={1.5} />
              <span>{hintsRemaining} hints</span>
            </span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "font-serif text-sm uppercase tracking-widest cursor-pointer transition-colors",
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center h-9 w-9 rounded-sm border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            data-testid="btn-settings"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
          </button>
          {!isGamePage && (
            <Link href="/game">
              <button
                className="hidden sm:flex items-center rounded-sm border border-primary/40 bg-primary/10 px-4 py-2 font-serif text-xs uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                data-testid="btn-play-now"
              >
                Play Now
              </button>
            </Link>
          )}
        </div>
      </motion.nav>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
