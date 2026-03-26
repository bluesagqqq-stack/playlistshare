import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const songs = sqliteTable('songs', {
  id: text('id').primaryKey(), // We'll use UUIDs like crypto.randomUUID()
  song_name: text('song_name').notNull(),
  artist: text('artist').notNull(),
  likes: integer('likes').default(0).notNull(),
  requested_by: text('requested_by').notNull(),
  status: text('status', { enum: ['pending', 'completed'] }).default('pending').notNull(),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
