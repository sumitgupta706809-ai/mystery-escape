import { Router } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, createSession, requireAuth } from "../lib/auth";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  username: z.string().min(2).max(24).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(6).max(72),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;

  try {
    const existing = await db.select({ id: usersTable.id }).from(usersTable)
      .where(eq(usersTable.username, username)).limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }

    const [user] = await db.insert(usersTable).values({
      username,
      passwordHash: hashPassword(password),
    }).returning({ id: usersTable.id, username: usersTable.username });

    const token = await createSession(user.id);
    res.status(201).json({ token, userId: user.id, username: user.username });
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable)
      .where(eq(usersTable.username, username)).limit(1);

    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    await db.update(usersTable).set({ lastLogin: new Date() }).where(eq(usersTable.id, user.id));
    const token = await createSession(user.id);
    res.json({ token, userId: user.id, username: user.username });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", requireAuth, async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token)).catch(() => {});
  }
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/auth/me", requireAuth, async (req, res) => {
  res.json({ userId: (req as any).userId, username: (req as any).username });
});

export default router;
