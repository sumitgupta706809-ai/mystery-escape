// ─── Puzzle result states ────────────────────────────────────────────────────
export type PuzzlePhase = "idle" | "active" | "success" | "failure";

// ─── Per-type configs ─────────────────────────────────────────────────────────
export interface KeypadConfig {
  digits: number;         // how many digits in the code
  solution: string;       // e.g. "4811"
  hint?: string;          // optional inline hint
}

export interface SymbolMatchConfig {
  pool: string[];          // all symbols available to choose from
  solution: string[];      // ordered answer, e.g. ["☽","✦","⚡"]
  hint?: string;
}

export interface SequenceMemoryConfig {
  gridSize: number;        // square: 3 = 3×3, 4 = 4×4
  sequence: number[];      // tile indices (0-based) in correct order
  showMs: number;          // ms each tile illuminates during demo
  hint?: string;
}

// ─── Discriminated union of all puzzle definitions ───────────────────────────
export type PuzzleDefinition =
  | { id: string; type: "keypad";          title: string; description: string; config: KeypadConfig }
  | { id: string; type: "symbol-match";    title: string; description: string; config: SymbolMatchConfig }
  | { id: string; type: "sequence-memory"; title: string; description: string; config: SequenceMemoryConfig };

// ─── Shared props injected into every puzzle component ───────────────────────
export interface PuzzleProps {
  onSolve: () => void;
  onFail: () => void;
}
