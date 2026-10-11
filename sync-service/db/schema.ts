import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
  pairHash: text('pair_hash').notNull().unique(),
  pairExpires: integer('pair_expires').notNull(),
  tokenHash: text('token_hash'),
  sequence: integer('sequence').notNull().default(0),
  receivedAt: text('received_at'),
  snapshot: text('snapshot'),
  summary: text('summary'),
  revoked: integer('revoked').notNull().default(0),
});
