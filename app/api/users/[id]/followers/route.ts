import { NextRequest, NextResponse } from 'next/server';
import { getFollowers } from '@/lib/db';

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

    const followers = await getFollowers(userId);

    return NextResponse.json({ followers }, { status: 200 });
  } catch (error: any) {
    console.error('Get followers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch followers.' },
      { status: 500 }
    );
  }
}
