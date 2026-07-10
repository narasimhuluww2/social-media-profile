import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { searchUsers } from '@/lib/db';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query && query.trim().length > 0) {
      // Search mode
      const users = await searchUsers(query.trim());
      return NextResponse.json({ users }, { status: 200 });
    }

    // Explore mode — return all users, optionally excluding the current user
    const session = await getSession(request);

    const users = await prisma.user.findMany({
      where: session ? { id: { not: session.id } } : undefined,
      orderBy: { followers: 'desc' },
      take: 30,
    });

    const result = users.map(u => ({
      id: u.id,
      name: u.name,
      username: u.username,
      avatar: u.avatar,
      bio: u.bio,
      followers: u.followers,
      following: u.following,
      posts: u.posts,
      is_verified: u.is_verified,
    }));

    return NextResponse.json({ users: result }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}
