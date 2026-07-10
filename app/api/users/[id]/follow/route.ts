import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toggleFollow } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const followingId = resolvedParams.id;
    
    if (!followingId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (user.id === followingId) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 });
    }

    const isFollowingNow = await toggleFollow(user.id, followingId);

    return NextResponse.json(
      { isFollowing: isFollowingNow, message: isFollowingNow ? 'Followed' : 'Unfollowed' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Toggle follow error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle follow.' },
      { status: 500 }
    );
  }
}
