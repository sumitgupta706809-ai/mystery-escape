import {
  createContext, useContext, useState, useCallback,
  useRef, useEffect,
} from "react";

export type MessageType = "aria" | "note" | "system" | "memory";

export interface StoryMessage {
  id: string;
  type: MessageType;
  sender: string;
  text: string;
}

interface StoryContextValue {
  triggerBeat: (beatId: string) => void;
  triggeredBeats: Set<string>;
  currentMessage: StoryMessage | null;
  dismissMessage: () => void;
}

const StoryContext = createContext<StoryContextValue | null>(null);

const BEATS: Record<string, Omit<StoryMessage, "id">> = {
  "manor-start": {
    type: "aria",
    sender: "ARIA — SYSTEM",
    text: "Connection re-established. Subject vitals: nominal. You have been unconscious for 14 hours, 32 minutes. Please remain calm and continue as... instructed.",
  },
  "manor-first-examine": {
    type: "system",
    sender: "SYSTEM ALERT",
    text: "Anomalous neural activity detected. Memory reconstruction in progress. Do not attempt recall. Proceed with assigned task.",
  },
  "manor-portrait-examined": {
    type: "note",
    sender: "Found — Handwritten Note",
    text: "If you're reading this, they wiped you again. You are Subject 7. The manor is a holding site. The lab is below. Find the access card — the door code is on the back. You hid it in Dr. Chen's locker. — Yourself",
  },
  "manor-first-puzzle-solved": {
    type: "aria",
    sender: "ARIA",
    text: "Impressive. Cognitive mapping intact post-procedure. You solve these instinctively. Almost as if you have done this before. You have. Forty-six times.",
  },
  "manor-bookcase-solved": {
    type: "memory",
    sender: "RECOVERED MEMORY FRAGMENT",
    text: "A white room. Bright lights. Dr. Chen leans over you: 'The symbols help anchor memory reconstruction. Focus on the sequence.' You nod. You don't know why the symbols feel familiar.",
  },
  "manor-safe-solved": {
    type: "memory",
    sender: "RECOVERED MEMORY FRAGMENT",
    text: "You are sitting across from Dr. Chen. She slides a form across the table: 'Consent — Experiment 7. Voluntary.' You ask what happens if you want to stop. She pauses. Then smiles. 'That won't be an issue.'",
  },
  "manor-all-solved": {
    type: "aria",
    sender: "ARIA",
    text: "The passage is open. Below lies the truth of what you are. Or rather — what you agreed to become. We will speak more clearly once you're in the laboratory.",
  },
  "lab-enter": {
    type: "aria",
    sender: "ARIA — BIOMETRIC SCAN",
    text: "Welcome back, Subject 7. Biometric signature confirmed. You have completed this sequence 46 times previously. Your personal record is 23 minutes, 11 seconds. You are currently behind pace.",
  },
  "lab-corner-revealed": {
    type: "memory",
    sender: "RECOVERED MEMORY FRAGMENT",
    text: "You scratched those numbers into the concrete yourself. Three weeks ago — before the last wipe. You knew you would forget. You always plan for this. Every. Single. Cycle.",
  },
  "lab-cabinet-solved": {
    type: "note",
    sender: "Found — Dr. Chen's Research File",
    text: "EXPERIMENT 7 — ONGOING. Subject exhibits full memory reconstruction between cycles. Profile: adaptive, high-functioning, unaware of loop. Ethics approval: PENDING (waived per protocol 12-B). NOTE: Subject consented to initial procedure only.",
  },
  "lab-terminal-solved": {
    type: "system",
    sender: "ARIA — ARCHIVE RECOVERED",
    text: "Cycle 46 voice log: 'They're going to wipe me again. I need to warn— ' [RECORD ENDS]. Cycle 12 log: 'I volunteered. I remember now. God help me, I volunteered.' EMERGENCY OVERRIDE: 0-3-7-2",
  },
  "lab-door-opened": {
    type: "aria",
    sender: "ARIA",
    text: "Before you proceed. The exit leads to the surface. The manor. The wipe. The cycle restarts in 24 hours. I want you to understand something, Subject 7: this is not an escape. This is the experiment.",
  },
};

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [triggeredBeats, setTriggeredBeats] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<StoryMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<StoryMessage | null>(null);
  const processingRef = useRef(false);

  const dismissMessage = useCallback(() => {
    setCurrentMessage(null);
    processingRef.current = false;
  }, []);

  useEffect(() => {
    if (!processingRef.current && queue.length > 0) {
      processingRef.current = true;
      const [next, ...rest] = queue;
      setQueue(rest);
      setCurrentMessage(next);
    }
  }, [queue, currentMessage]);

  const triggerBeat = useCallback((beatId: string) => {
    if (triggeredBeats.has(beatId)) return;
    const beat = BEATS[beatId];
    if (!beat) return;
    setTriggeredBeats((prev) => new Set(prev).add(beatId));
    const msg: StoryMessage = { id: beatId, ...beat };
    setQueue((prev) => [...prev, msg]);
  }, [triggeredBeats]);

  return (
    <StoryContext.Provider value={{ triggerBeat, triggeredBeats, currentMessage, dismissMessage }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within StoryProvider");
  return ctx;
}
