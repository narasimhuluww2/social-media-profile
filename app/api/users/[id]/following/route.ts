import { NextRequest, NextResponse } from 'next/server';
import { getFollowing } from '@/lib/db';

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

    const following = await getFollowing(userId);

    return NextResponse.json({ following }, { status: 200 });
  } catch (error: any) {
    console.error('Get following error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch following.' },
      { status: 500 }
    );
  }
}
