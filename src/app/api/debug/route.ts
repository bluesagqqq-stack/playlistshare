export const runtime = 'edge';

export async function GET() {
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages');
    const ctx = getRequestContext();
    const env = ctx.env as Record<string, unknown>;
    
    const dbBinding = env['DB'];
    if (!dbBinding) {
      return Response.json({ 
        ok: false, 
        error: 'DB binding not found',
        availableBindings: Object.keys(env)
      });
    }

    // Try a simple query
    const db = dbBinding as D1Database;
    const result = await db.prepare('SELECT 1 as test').first();
    
    return Response.json({ 
      ok: true, 
      bindings: Object.keys(env),
      queryResult: result
    });
  } catch (e: unknown) {
    return Response.json({ 
      ok: false, 
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined
    });
  }
}
