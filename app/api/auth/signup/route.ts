import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUserByUsername, toSafeUser } from '@/lib/db';
import { hashPassword, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = body;

    // --- Validation ---
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // --- Check for existing users ---
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const existingUsername = await findUserByUsername(username.toLowerCase());
    if (existingUsername) {
      return NextResponse.json(
        { error: 'This username is already taken' },
        { status: 409 }
      );
    }

    // --- Create user ---
    const passwordHash = await hashPassword(password);
    const userId = `user_${Date.now()}`;

    const newUser = await createUser(
      userId,
      name,
      username.toLowerCase().replace(/\s+/g, ''),
      email.toLowerCase(),
      passwordHash
    );

    // --- Create session ---
    const token = await createToken(userId);
    const response = NextResponse.json(
      { user: toSafeUser(newUser), message: 'Account created successfully' },
      { status: 201 }
    );

    return setSessionCookie(response, token);
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
