import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Search, Hand, Zap, Combine } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { RoomScene } from "@/components/game/RoomScene";
import { InventorySlot } from "@/components/game/InventorySlot";
import { HintPanel } from "@/components/game/HintPanel";

const INVENTORY_ITEMS = [
  { icon: "🗝️", name: "Brass Key" },
  { icon: "📜", name: "Old Letter" },
  { icon: "🕯️", name: "Candle" },
];
const TOTAL_SLOTS = 9;

const ACTIONS = [
  { id: "examine", label: "Examine", icon: Search },
  { id: "take", label: "Take", icon: Hand },
  { id: "use", label: "Use", icon: Zap },
  { id: "combine", label: "Combine", icon: Combine },
];

export default function Game() {
  const [activeAction, setActiveAction] = useState("examine");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
      data-testid="game-page"
    >
      <Navbar isGamePage roomName="The Victorian Manor" hintsRemaining={3} />

      <main className="pt-16 h-screen flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            <div className="flex-1 min-h-0">
              <RoomScene />
            </div>

            <div className="rounded-sm border border-border bg-card/50 p-3">
              <p className="font-serif text-xs text-muted-foreground leading-relaxed" data-testid="room-description">
                You stand in the dimly lit study of Hargrove Manor. The air smells of aged leather 
                and extinguished candles. Rain hammers against the tall windows. Somewhere in this 
                room lies the key to your escape — if you dare to search for it.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {ACTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveAction(id)}
                  className={`flex flex-col items-center gap-1.5 rounded-sm border py-3 transition-all duration-200 ${
                    activeAction === id
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(224,153,30,0.15)]"
                      : "border-border bg-secondary/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                  data-testid={`btn-action-${id}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="font-serif text-[10px] uppercase tracking-widest">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-72 flex flex-col gap-3 p-4 border-t lg:border-t-0 lg:border-l border-border bg-card/20 overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground">
                  Inventory
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                  <div key={i} className="flex justify-center">
                    <InventorySlot
                      item={i < INVENTORY_ITEMS.length ? INVENTORY_ITEMS[i] : undefined}
                      index={i}
                      selected={selectedItem === i}
                      onClick={() => setSelectedItem(selectedItem === i ? null : i)}
                    />
                  </div>
                ))}
              </div>

              {selectedItem !== null && selectedItem < INVENTORY_ITEMS.length && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 rounded-sm border border-primary/20 bg-primary/5 p-3"
                  data-testid="selected-item-info"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{INVENTORY_ITEMS[selectedItem].icon}</span>
                    <span className="font-serif text-sm text-primary/80">
                      {INVENTORY_ITEMS[selectedItem].name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedItem === 0 && "A tarnished brass key with an ornate bow. It looks like it might fit a small lockbox."}
                    {selectedItem === 1 && "A water-stained letter written in hurried script. Most of it is illegible, but a sequence of numbers is circled."}
                    {selectedItem === 2 && "A half-burned candle. Still warm — someone was here recently."}
                  </p>
                </motion.div>
              )}
            </div>

            <HintPanel hintsRemaining={3} />

            <div className="mt-auto pt-2">
              <Link href="/">
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-sm border border-border/40 bg-transparent py-2.5 text-xs text-muted-foreground transition-all hover:border-destructive/40 hover:text-destructive"
                  data-testid="btn-quit-game"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span className="font-serif uppercase tracking-widest">Quit Room</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
