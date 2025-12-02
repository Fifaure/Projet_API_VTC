import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per window

// Note: In a serverless environment (like Vercel), this map will be reset
// when the function is cold-started. For production, use Redis.
const ipRequests = new Map<string, { count: number; startTime: number }>();

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  const now = Date.now();

  const requestData = ipRequests.get(ip) || { count: 0, startTime: now };

  // Reset window if time passed
  if (now - requestData.startTime > RATE_LIMIT_WINDOW) {
    requestData.count = 0;
    requestData.startTime = now;
  }

  // Check limit
  if (requestData.count >= RATE_LIMIT_MAX) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Increment
  requestData.count++;
  ipRequests.set(ip, requestData);

  const response = NextResponse.next();

  // Add headers
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString());
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX - requestData.count).toString());
  response.headers.set('X-RateLimit-Reset', (requestData.startTime + RATE_LIMIT_WINDOW).toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
}
