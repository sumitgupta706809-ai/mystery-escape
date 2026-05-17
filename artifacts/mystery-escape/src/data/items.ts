export type ItemRarity = "common" | "uncommon" | "rare" | "legendary";
export type ItemTag = "tool" | "key" | "document" | "light" | "consumable" | "electronic" | "mechanical";

export interface ItemDefinition {
  id: string;
  icon: string;
  name: string;
  shortName: string;
  description: string;
  examineText: string;
  rarity: ItemRarity;
  tags: ItemTag[];
  usableOn: string[];
  combinesWith: string[];
  useEffect?: string;
  stackable?: boolean;
  maxStack?: number;
}

export const RARITY_CONFIG: Record<ItemRarity, { label: string; color: string; glow: string; border: string }> = {
  common:    { label: "Common",    color: "text-muted-foreground",   glow: "",                                        border: "border-border/50" },
  uncommon:  { label: "Uncommon",  color: "text-emerald-400/80",     glow: "shadow-[0_0_10px_rgba(52,211,153,0.15)]", border: "border-emerald-700/40" },
  rare:      { label: "Rare",      color: "text-primary/90",         glow: "shadow-[0_0_12px_rgba(224,153,30,0.2)]",  border: "border-primary/40" },
  legendary: { label: "Legendary", color: "text-violet-400/90",      glow: "shadow-[0_0_16px_rgba(167,139,250,0.25)]",border: "border-violet-600/40" },
};

export const ITEM_REGISTRY: Record<string, ItemDefinition> = {
  "brass-key": {
    id: "brass-key",
    icon: "🗝️",
    name: "Brass Key",
    shortName: "Key",
    description: "A tarnished brass key with an ornate bow. It looks like it might fit a small lockbox.",
    examineText: "The key is old, its teeth worn smooth from years of use. An engraved letter 'H' is barely visible on the bow — Hargrove, perhaps.",
    rarity: "uncommon",
    tags: ["key"],
    usableOn: ["lockbox", "drawer-lock"],
    combinesWith: [],
    useEffect: "You insert the key into the lock. It turns with a satisfying click.",
  },
  "old-letter": {
    id: "old-letter",
    icon: "📜",
    name: "Old Letter",
    shortName: "Letter",
    description: "A water-stained letter in hurried script. A sequence of numbers is circled at the bottom.",
    examineText: "The ink is smeared but legible: '...the combination is hidden in plain sight. Look to the clock. IV — VIII — XI.' The numbers 4, 8, 11 are circled.",
    rarity: "common",
    tags: ["document"],
    usableOn: ["safe", "combination-lock"],
    combinesWith: [],
    useEffect: "You read the numbers aloud: four, eight, eleven.",
  },
  "candle": {
    id: "candle",
    icon: "🕯️",
    name: "Candle Stub",
    shortName: "Candle",
    description: "A half-burned candle, still faintly warm. Someone was here very recently.",
    examineText: "The wax pooled recently — it's still soft. A symbol has been scratched into the candleholder's base. An eye inside a triangle.",
    rarity: "common",
    tags: ["light", "consumable"],
    usableOn: ["dark-alcove", "fireplace"],
    combinesWith: ["matches"],
    useEffect: "The flame flickers to life, casting dancing shadows across the walls.",
  },
  "flashlight": {
    id: "flashlight",
    icon: "🔦",
    name: "Maglite Flashlight",
    shortName: "Flashlight",
    description: "A heavy-duty flashlight with fresh batteries. The beam cuts through darkness cleanly.",
    examineText: "A solid aluminum flashlight — the kind that doubles as a club. The beam is strong and focused. There's a serial number etched on the barrel: ML-2847.",
    rarity: "uncommon",
    tags: ["light", "tool"],
    usableOn: ["dark-passage", "dark-alcove", "hidden-panel"],
    combinesWith: [],
    useEffect: "The beam slices through the darkness, revealing what was hidden.",
  },
  "keycard": {
    id: "keycard",
    icon: "💳",
    name: "Security Keycard",
    shortName: "Keycard",
    description: "A magnetic keycard with a faded logo. 'LEVEL 2 — AUTHORIZED PERSONNEL ONLY.'",
    examineText: "The card is scratched but functional. The magnetic strip is intact. The logo shows a stylized compass rose — the emblem of the Hargrove Research Institute. Access Level 2.",
    rarity: "rare",
    tags: ["key", "electronic"],
    usableOn: ["card-reader", "security-door", "server-room"],
    combinesWith: [],
    useEffect: "The reader beeps twice. A green light. The door clicks open.",
  },
  "screwdriver": {
    id: "screwdriver",
    icon: "🔧",
    name: "Flathead Screwdriver",
    shortName: "Screwdriver",
    description: "A worn flathead screwdriver. Useful for prying open things not meant to be opened.",
    examineText: "The tip is slightly bent — this tool has been used hard. The handle is wrapped in electrical tape. Someone wanted a better grip for leverage.",
    rarity: "common",
    tags: ["tool", "mechanical"],
    usableOn: ["vent-panel", "loose-screw", "pried-crate", "junction-box"],
    combinesWith: ["wire"],
    useEffect: "You apply leverage. The screws give way with a reluctant groan.",
  },
  "matches": {
    id: "matches",
    icon: "🔥",
    name: "Box of Matches",
    shortName: "Matches",
    description: "A small matchbox with a few matches remaining. Strike anywhere.",
    examineText: "Three matches left. The box is damp but the matches themselves seem dry. Use them wisely.",
    rarity: "common",
    tags: ["consumable"],
    usableOn: ["fireplace", "candle"],
    combinesWith: ["candle"],
    useEffect: "You strike the match. It flares to life with a warm, sulfurous smell.",
  },
  "wire": {
    id: "wire",
    icon: "🪛",
    name: "Copper Wire",
    shortName: "Wire",
    description: "A coil of copper wire stripped from somewhere. Conductive.",
    examineText: "About two feet of 14-gauge copper wire, stripped clean at both ends. Could be used to bridge a connection.",
    rarity: "common",
    tags: ["mechanical", "electronic"],
    usableOn: ["junction-box", "broken-circuit"],
    combinesWith: ["screwdriver"],
    useEffect: "You carefully bridge the connection with the wire.",
  },
};

export function getItem(id: string): ItemDefinition | undefined {
  return ITEM_REGISTRY[id];
}

export function createItemInstance(id: string): ItemDefinition | null {
  const def = ITEM_REGISTRY[id];
  if (!def) return null;
  return { ...def };
}

export const STARTING_ITEMS = ["brass-key", "old-letter", "candle", "flashlight", "keycard", "screwdriver"];
