import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSavedPosts } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Users can only view their own saved posts
    if (session.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const posts = await getSavedPosts(userId);

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Get saved posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved posts.' },
      { status: 500 }
    );
  }
}
