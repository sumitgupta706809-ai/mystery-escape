export type RoomId = "victorian-manor" | "underground-lab";

export interface ObjectiveDef {
  id: string;
  text: string;
}

export interface RoomMeta {
  id: RoomId;
  name: string;
  puzzleIds: string[];
  objectives: ObjectiveDef[];
  nextRoom?: RoomId;
  nextRoomLabel?: string;
}

export const ROOM_META: Record<RoomId, RoomMeta> = {
  "victorian-manor": {
    id: "victorian-manor",
    name: "The Victorian Manor",
    puzzleIds: ["room-safe-keypad", "room-bookcase-symbol", "room-clock-sequence"],
    objectives: [
      { id: "search-desk",       text: "Search the antique desk" },
      { id: "examine-portrait",  text: "Examine the faded portrait" },
      { id: "check-clock",       text: "Inspect the stopped clock" },
      { id: "find-hidden",       text: "Unlock the wall safe" },
    ],
    nextRoom: "underground-lab",
    nextRoomLabel: "Enter Underground Laboratory",
  },
  "underground-lab": {
    id: "underground-lab",
    name: "Underground Laboratory",
    puzzleIds: ["lab-cabinet-keypad", "lab-terminal-symbol", "lab-door-keypad"],
    objectives: [
      { id: "find-equipment",   text: "Locate emergency equipment" },
      { id: "reveal-code",      text: "Reveal the hidden access code" },
      { id: "open-cabinet",     text: "Unlock the filing cabinet" },
      { id: "restore-terminal", text: "Restore the broken terminal" },
      { id: "unlock-door",      text: "Unlock the security door and escape" },
    ],
  },
};
