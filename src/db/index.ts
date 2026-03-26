import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { getRequestContext } from '@cloudflare/next-on-pages';

export function getDb() {
  const env = getRequestContext().env as { DB: D1Database };
  return drizzle(env.DB, { schema });
}
