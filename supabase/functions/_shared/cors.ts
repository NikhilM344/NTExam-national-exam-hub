// Simple CORS helper shared by your functions

// Add all origins that should be able to call your functions
const ALLOW_LIST = new Set<string>([
  'http://localhost:5173',
  'https://ntexam.in',
  'https://www.ntexam.in',
]);

export function buildCorsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOW_LIST.has(origin) ? origin : 'https://ntexam.in';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

// Quick preflight responder
export function handleOptions(req: Request) {
  const headers = buildCorsHeaders(req.headers.get('origin'));
  return new Response('ok', { headers });
}
