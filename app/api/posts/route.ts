import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createPost, getFeedPosts } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession(request);
    
    // Pass currentUserId to see if they've liked/saved posts
    const posts = await getFeedPosts(user?.id);

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, image, location } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      );
    }

    const postId = `post_${Date.now()}`;
    const newPost = await createPost(postId, user.id, content, image, location);

    // To return the post with author details just like the feed, we can fetch it via getFeedPosts
    const updatedFeed = await getFeedPosts(user.id);
    const fullyPopulatedPost = updatedFeed.find((p: any) => p.id === postId);

    return NextResponse.json(
      { post: fullyPopulatedPost, message: 'Post created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Failed to create post.' },
      { status: 500 }
    );
  }
}
