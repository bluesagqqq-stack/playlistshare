export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    message: 'Edge runtime is active.',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
