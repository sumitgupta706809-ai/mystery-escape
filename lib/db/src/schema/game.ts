import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const gameSavesTable = pgTable("game_saves", {
  id:             uuid("id").primaryKey().defaultRandom(),
  userId:         uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  roomId:         text("room_id").notNull().default("victorian-manor"),
  secondsElapsed: integer("seconds_elapsed").notNull().default(0),
  hintsUsed:      integer("hints_used").notNull().default(0),
  updatedAt:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const puzzleStatesTable = pgTable("puzzle_states", {
  id:       uuid("id").primaryKey().defaultRandom(),
  userId:   uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  puzzleId: text("puzzle_id").notNull(),
  solvedAt: timestamp("solved_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inventorySnapshotsTable = pgTable("inventory_snapshots", {
  id:        uuid("id").primaryKey().defaultRandom(),
  userId:    uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  itemIds:   text("item_ids").array().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaderboardTable = pgTable("leaderboard", {
  id:          uuid("id").primaryKey().defaultRandom(),
  userId:      uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  username:    text("username").notNull(),
  roomId:      text("room_id").notNull(),
  seconds:     integer("seconds").notNull(),
  hintsUsed:   integer("hints_used").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GameSave = typeof gameSavesTable.$inferSelect;
export type PuzzleState = typeof puzzleStatesTable.$inferSelect;
export type InventorySnapshot = typeof inventorySnapshotsTable.$inferSelect;
export type LeaderboardEntry = typeof leaderboardTable.$inferSelect;
