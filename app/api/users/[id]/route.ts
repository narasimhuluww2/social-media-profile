import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserProfile, updateUser } from '@/lib/db';

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
    const profile = await getUserProfile(userId, session?.id);

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: profile }, { status: 200 });
  } catch (error: any) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile.' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Users can only update their own profile
    if (session.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, username, bio, location, website, avatar, cover_image } = body;

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;
    if (avatar !== undefined) updates.avatar = avatar;
    if (cover_image !== undefined) updates.cover_image = cover_image;

    const updatedUser = await updateUser(userId, updates);

    return NextResponse.json(
      {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          username: updatedUser.username,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          followers: updatedUser.followers,
          following: updatedUser.following,
          posts: updatedUser.posts,
          website: updatedUser.website,
          location: updatedUser.location,
          cover_image: updatedUser.cover_image,
          is_verified: updatedUser.is_verified,
        },
        message: 'Profile updated successfully'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update user profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
