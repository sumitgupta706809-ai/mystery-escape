import { Router } from "express";
import { db, leaderboardTable } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { z } from "zod";

const router = Router();

const submitSchema = z.object({
  roomId:    z.string(),
  seconds:   z.number().int().min(1),
  hintsUsed: z.number().int().min(0).default(0),
});

// POST /api/leaderboard  — submit a completed run
router.post("/leaderboard", requireAuth, async (req, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data" });
    return;
  }

  const userId   = (req as any).userId as string;
  const username = (req as any).username as string;
  const { roomId, seconds, hintsUsed } = parsed.data;

  try {
    const [entry] = await db.insert(leaderboardTable)
      .values({ userId, username, roomId, seconds, hintsUsed })
      .returning();
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ error: "Submit failed" });
  }
});

// GET /api/leaderboard?room=victorian-manor&limit=10
router.get("/leaderboard", async (req, res) => {
  const room  = typeof req.query.room  === "string" ? req.query.room  : null;
  const limit = Math.min(Number(req.query.limit ?? 10), 50);

  if (!Number.isInteger(limit) || limit < 1) {
    res.status(400).json({ error: "Invalid limit" });
    return;
  }

  try {
    let query = db.select({
      id:          leaderboardTable.id,
      username:    leaderboardTable.username,
      roomId:      leaderboardTable.roomId,
      seconds:     leaderboardTable.seconds,
      hintsUsed:   leaderboardTable.hintsUsed,
      completedAt: leaderboardTable.completedAt,
    }).from(leaderboardTable);

    if (room) {
      const ALLOWED_ROOMS = ["victorian-manor", "underground-lab"];
      if (!ALLOWED_ROOMS.includes(room)) {
        res.status(400).json({ error: "Invalid room" });
        return;
      }
      const rows = await db.select({
        id:          leaderboardTable.id,
        username:    leaderboardTable.username,
        roomId:      leaderboardTable.roomId,
        seconds:     leaderboardTable.seconds,
        hintsUsed:   leaderboardTable.hintsUsed,
        completedAt: leaderboardTable.completedAt,
      })
      .from(leaderboardTable)
      .where(eq(leaderboardTable.roomId, room))
      .orderBy(asc(leaderboardTable.seconds))
      .limit(limit);
      res.json(rows);
      return;
    }

    const rows = await query.orderBy(asc(leaderboardTable.seconds)).limit(limit);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;
