import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { toggleSave } from '@/lib/db';

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
    const postId = resolvedParams.id;
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const isSavedNow = await toggleSave(postId, user.id);

    return NextResponse.json(
      { isSaved: isSavedNow, message: isSavedNow ? 'Post saved' : 'Post unsaved' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Toggle save error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle save.' },
      { status: 500 }
    );
  }
}
