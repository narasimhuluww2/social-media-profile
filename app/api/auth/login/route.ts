import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, toSafeUser } from '@/lib/db';
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // --- Find user ---
    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 401 }
      );
    }

    // --- Verify password ---
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }

    // --- Create session ---
    const token = await createToken(user.id);
    const response = NextResponse.json(
      { user: toSafeUser(user), message: 'Logged in successfully' },
      { status: 200 }
    );

    return setSessionCookie(response, token);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
