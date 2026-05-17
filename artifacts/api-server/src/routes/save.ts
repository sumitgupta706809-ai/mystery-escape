import { Router } from "express";
import { db, gameSavesTable, puzzleStatesTable, inventorySnapshotsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth } from "../lib/auth";
import { z } from "zod";

const router = Router();

const saveSchema = z.object({
  roomId:         z.string(),
  secondsElapsed: z.number().int().min(0),
  hintsUsed:      z.number().int().min(0),
  solvedPuzzleIds: z.array(z.string()),
  inventoryItemIds: z.array(z.string()),
});

// POST /api/save  — upsert full game state
router.post("/save", requireAuth, async (req, res) => {
  const parsed = saveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid save data" });
    return;
  }

  const userId = (req as any).userId as string;
  const { roomId, secondsElapsed, hintsUsed, solvedPuzzleIds, inventoryItemIds } = parsed.data;

  try {
    // Upsert game_saves
    await db.insert(gameSavesTable)
      .values({ userId, roomId, secondsElapsed, hintsUsed, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: gameSavesTable.userId,
        set: { roomId, secondsElapsed, hintsUsed, updatedAt: new Date() },
      });

    // Upsert each solved puzzle (ignore duplicates)
    if (solvedPuzzleIds.length > 0) {
      await db.insert(puzzleStatesTable)
        .values(solvedPuzzleIds.map(puzzleId => ({ userId, puzzleId })))
        .onConflictDoNothing();
    }

    // Upsert inventory snapshot
    await db.insert(inventorySnapshotsTable)
      .values({ userId, itemIds: inventoryItemIds, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: inventorySnapshotsTable.userId,
        set: { itemIds: inventoryItemIds, updatedAt: new Date() },
      });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});

// GET /api/save  — load full game state
router.get("/save", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;

  try {
    const [gameSave] = await db.select().from(gameSavesTable)
      .where(eq(gameSavesTable.userId, userId)).limit(1);

    const puzzleRows = await db.select({ puzzleId: puzzleStatesTable.puzzleId })
      .from(puzzleStatesTable).where(eq(puzzleStatesTable.userId, userId));

    const [inv] = await db.select().from(inventorySnapshotsTable)
      .where(eq(inventorySnapshotsTable.userId, userId)).limit(1);

    res.json({
      roomId:           gameSave?.roomId ?? "victorian-manor",
      secondsElapsed:   gameSave?.secondsElapsed ?? 0,
      hintsUsed:        gameSave?.hintsUsed ?? 0,
      solvedPuzzleIds:  puzzleRows.map(r => r.puzzleId),
      inventoryItemIds: inv?.itemIds ?? [],
      updatedAt:        gameSave?.updatedAt ?? null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Load failed" });
  }
});

// DELETE /api/save  — wipe progress (new game)
router.delete("/save", requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  try {
    await db.delete(gameSavesTable).where(eq(gameSavesTable.userId, userId));
    await db.delete(puzzleStatesTable).where(eq(puzzleStatesTable.userId, userId));
    await db.delete(inventorySnapshotsTable).where(eq(inventorySnapshotsTable.userId, userId));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Reset failed" });
  }
});

export default router;
