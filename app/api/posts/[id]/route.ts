import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getPostById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const postId = resolvedParams.id;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const session = await getSession(request);
    const post = await getPostById(postId, session?.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post.' },
      { status: 500 }
    );
  }
}
