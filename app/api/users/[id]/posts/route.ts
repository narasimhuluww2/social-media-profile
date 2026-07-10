import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserPosts } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const session = await getSession(request);
    const posts = await getUserPosts(userId, session?.id);

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Get user posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts.' },
      { status: 500 }
    );
  }
}
