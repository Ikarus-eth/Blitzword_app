import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
  pairHash: text('pair_hash').notNull().unique(),
  pairExpires: integer('pair_expires').notNull(),
  tokenHash: text('token_hash'),
  sequence: integer('sequence').notNull().default(0),
  historySequence: integer('history_sequence').notNull().default(0),
  receivedAt: text('received_at'),
  snapshot: text('snapshot'),
  summary: text('summary'),
  revoked: integer('revoked').notNull().default(0),
});

export const progress_overview = sqliteTable('progress_overview', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_days = sqliteTable('progress_days', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_weeks = sqliteTable('progress_weeks', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_words = sqliteTable('progress_words', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_sessions = sqliteTable('progress_sessions', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_events = sqliteTable('progress_events', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_parts = sqliteTable('progress_parts', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);

export const progress_trends = sqliteTable('progress_trends', {
 deviceId: text('device_id').notNull(), recordKey: text('record_key').notNull(),
 part: integer('part').notNull(), parts: integer('parts').notNull(),
 sequence: integer('sequence').notNull(), data: text('data').notNull(),
}, t => [primaryKey({columns:[t.deviceId,t.recordKey,t.part]})]);
