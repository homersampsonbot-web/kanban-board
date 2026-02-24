import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple password (you can change this)
const VALID_PASSWORD = 'simpson2024';

// Simple JWT-like token generation
function generateToken(password: string): string {
  const timestamp = Date.now();
  const payload = { password, timestamp };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    // Token valid for 24 hours
    const isExpired = Date.now() - payload.timestamp > 24 * 60 * 60 * 1000;
    return payload.password === VALID_PASSWORD && !isExpired;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === VALID_PASSWORD) {
      const token = generateToken(password);
      
      const response = NextResponse.json({ 
        success: true, 
        token,
        message: 'Authentication successful' 
      });
      
      // Set httpOnly cookie for additional security
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid password' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication failed' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (token && validateToken(token)) {
    return NextResponse.json({ success: true, authenticated: true });
  } else {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }
}

// Export the validateToken function for use in other API routes
export { validateToken };