import crypto from "crypto";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

export function hashPassword(password: string): string {
  const secret = process.env.AUTH_SECRET ?? "mystery-escape-secret";
  return crypto.createHash("sha256").update(password + secret).digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ token, userId, expiresAt });
  return token;
}

export async function validateToken(token: string) {
  if (!token) return null;
  const rows = await db
    .select({ userId: sessionsTable.userId, username: usersTable.username })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(sessionsTable.token, token),
        gt(sessionsTable.expiresAt, new Date()),
      )
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const session = await validateToken(token);
  if (!session) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }
  (req as any).userId   = session.userId;
  (req as any).username = session.username;
  next();
}
