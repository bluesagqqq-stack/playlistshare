'use server';

import { getDb } from '@/db';
import { songs, settings } from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function fetchSongs() {
  const db = getDb();
  return await db.select().from(songs).orderBy(desc(songs.likes)).execute();
}

export async function addSong(songName: string, artist: string, requestedBy: string) {
  const db = getDb();
  
  const existing = await db.select().from(songs).where(and(eq(songs.song_name, songName), eq(songs.artist, artist))).execute();
  if (existing.length > 0) return { success: false, error: 'duplicate' };

  const id = crypto.randomUUID();
  await db.insert(songs).values({
    id,
    song_name: songName,
    artist,
    requested_by: requestedBy,
    status: 'pending',
  }).execute();
  revalidatePath('/');
  return { success: true };
}

export async function likeSong(id: string) {
  const db = getDb();
  await db.update(songs).set({ likes: sql`${songs.likes} + 1` }).where(eq(songs.id, id)).execute();
  revalidatePath('/');
}

export async function deleteSong(id: string) {
  const db = getDb();
  await db.delete(songs).where(eq(songs.id, id)).execute();
  revalidatePath('/');
}

export async function getBgDisabled() {
  const db = getDb();
  const res = await db.select().from(settings).where(eq(settings.key, 'bg_disabled')).execute();
  return res.length > 0 ? res[0].value === 'true' : false;
}

export async function toggleBgDisabled() {
  const db = getDb();
  const current = await getBgDisabled();
  if (current) {
    await db.update(settings).set({ value: 'false' }).where(eq(settings.key, 'bg_disabled')).execute();
  } else {
    const res = await db.select().from(settings).where(eq(settings.key, 'bg_disabled')).execute();
    if (res.length > 0) {
      await db.update(settings).set({ value: 'true' }).where(eq(settings.key, 'bg_disabled')).execute();
    } else {
      await db.insert(settings).values({ key: 'bg_disabled', value: 'true' }).execute();
    }
  }
  revalidatePath('/');
}
