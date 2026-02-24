import { NextRequest, NextResponse } from 'next/server';

function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    // Token valid for 24 hours
    const isExpired = Date.now() - payload.timestamp > 24 * 60 * 60 * 1000;
    const validPassword = 'simpson2024';
    return payload.password === validPassword && !isExpired;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  // Only protect API routes except auth
  if (request.nextUrl.pathname.startsWith('/api') && 
      !request.nextUrl.pathname.startsWith('/api/auth')) {
    
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token || !validateToken(token)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};