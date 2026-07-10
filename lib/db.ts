import { PrismaClient, User, Post, Comment } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ---------- User Types ----------

// Safe user object (without password hash) to return to the client
export type SafeUser = Omit<User, 'password_hash'>;

export function toSafeUser(user: User): SafeUser {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// ---------- CRUD Operations - Users ----------

export async function createUser(
  id: string,
  name: string,
  username: string,
  email: string,
  passwordHash: string,
  avatar?: string,
  coverImage?: string
): Promise<User> {
  return prisma.user.create({
    data: {
      id,
      name,
      username,
      email,
      password_hash: passwordHash,
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      bio: 'New Quantum Creator ✨',
      cover_image: coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    }
  });
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { username } });
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'location' | 'website' | 'avatar' | 'cover_image'>>
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: updates
  });
}

// ---------- CRUD Operations - Posts ----------

export async function createPost(
  id: string,
  authorId: string,
  content: string,
  image?: string | null,
  location?: string | null
): Promise<Post> {
  // Create post and increment user post count in a transaction
  const [post] = await prisma.$transaction([
    prisma.post.create({
      data: {
        id,
        author_id: authorId,
        content,
        image,
        location
      }
    }),
    prisma.user.update({
      where: { id: authorId },
      data: { posts: { increment: 1 } }
    })
  ]);

  return post;
}

// Get rich posts with author details and interaction states
export async function getFeedPosts(currentUserId?: string) {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    take: 50,
    include: {
      author: true,
      likes: currentUserId ? {
        where: { user_id: currentUserId }
      } : false,
      savedBy: currentUserId ? {
        where: { user_id: currentUserId }
      } : false,
    }
  });

  return posts.map(post => ({
    id: post.id,
    author: {
      id: post.author.id,
      name: post.author.name,
      username: post.author.username,
      avatar: post.author.avatar,
      isVerified: post.author.is_verified
    },
    content: post.content,
    image: post.image,
    location: post.location,
    timestamp: post.created_at.toISOString(),
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.shares,
    isLiked: post.likes?.length > 0,
    isSaved: post.savedBy?.length > 0
  }));
}

// ---------- CRUD Operations - Interactions ----------

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const existing = await prisma.like.findUnique({
    where: {
      post_id_user_id: { post_id: postId, user_id: userId }
    }
  });

  if (existing) {
    // Unlike
    await prisma.$transaction([
      prisma.like.delete({
        where: { post_id_user_id: { post_id: postId, user_id: userId } }
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } }
      })
    ]);
    return false;
  } else {
    // Like
    await prisma.$transaction([
      prisma.like.create({
        data: { post_id: postId, user_id: userId }
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } }
      })
    ]);
    return true;
  }
}

export async function toggleSave(postId: string, userId: string): Promise<boolean> {
  const existing = await prisma.savedPost.findUnique({
    where: {
      post_id_user_id: { post_id: postId, user_id: userId }
    }
  });

  if (existing) {
    // Unsave
    await prisma.savedPost.delete({
      where: { post_id_user_id: { post_id: postId, user_id: userId } }
    });
    return false;
  } else {
    // Save
    await prisma.savedPost.create({
      data: { post_id: postId, user_id: userId }
    });
    return true;
  }
}

export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false;
  
  const existing = await prisma.follow.findUnique({
    where: {
      follower_id_following_id: { follower_id: followerId, following_id: followingId }
    }
  });

  if (existing) {
    // Unfollow
    await prisma.$transaction([
      prisma.follow.delete({
        where: { follower_id_following_id: { follower_id: followerId, following_id: followingId } }
      }),
      prisma.user.update({
        where: { id: followerId },
        data: { following: { decrement: 1 } }
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followers: { decrement: 1 } }
      })
    ]);
    return false;
  } else {
    // Follow
    await prisma.$transaction([
      prisma.follow.create({
        data: { follower_id: followerId, following_id: followingId }
      }),
      prisma.user.update({
        where: { id: followerId },
        data: { following: { increment: 1 } }
      }),
      prisma.user.update({
        where: { id: followingId },
        data: { followers: { increment: 1 } }
      })
    ]);
    return true;
  }
}

// ---------- CRUD Operations - Comments ----------

export async function addComment(id: string, postId: string, authorId: string, content: string) {
  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        id,
        post_id: postId,
        author_id: authorId,
        content
      },
      include: {
        author: true
      }
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } }
    })
  ]);

  return {
    id: comment.id,
    author: {
      name: comment.author.name,
      username: comment.author.username,
      avatar: comment.author.avatar
    },
    content: comment.content,
    timestamp: comment.created_at.toISOString(),
    likes: comment.likes,
    isLiked: false
  };
}

export async function getComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { post_id: postId },
    orderBy: { created_at: 'asc' },
    include: { author: true }
  });

  return comments.map(comment => ({
    id: comment.id,
    author: {
      name: comment.author.name,
      username: comment.author.username,
      avatar: comment.author.avatar
    },
    content: comment.content,
    timestamp: comment.created_at.toISOString(),
    likes: comment.likes,
    isLiked: false
  }));
}

// ---------- User Profile & Social ----------

export async function getUserProfile(userId: string, currentUserId?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const follow = await prisma.follow.findUnique({
      where: {
        follower_id_following_id: { follower_id: currentUserId, following_id: userId }
      }
    });
    isFollowing = !!follow;
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    posts: user.posts,
    website: user.website,
    location: user.location,
    cover_image: user.cover_image,
    is_verified: user.is_verified,
    created_at: user.created_at.toISOString(),
    isFollowing,
  };
}

export async function getUserPosts(userId: string, currentUserId?: string) {
  const posts = await prisma.post.findMany({
    where: { author_id: userId },
    orderBy: { created_at: 'desc' },
    take: 50,
    include: {
      author: true,
      likes: currentUserId ? { where: { user_id: currentUserId } } : false,
      savedBy: currentUserId ? { where: { user_id: currentUserId } } : false,
    }
  });

  return posts.map(post => ({
    id: post.id,
    author: {
      id: post.author.id,
      name: post.author.name,
      username: post.author.username,
      avatar: post.author.avatar,
      isVerified: post.author.is_verified
    },
    content: post.content,
    image: post.image,
    location: post.location,
    timestamp: post.created_at.toISOString(),
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.shares,
    isLiked: post.likes?.length > 0,
    isSaved: post.savedBy?.length > 0
  }));
}

export async function getSavedPosts(userId: string) {
  const savedEntries = await prisma.savedPost.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    include: {
      post: {
        include: {
          author: true,
          likes: { where: { user_id: userId } },
        }
      }
    }
  });

  return savedEntries.map(entry => ({
    id: entry.post.id,
    author: {
      id: entry.post.author.id,
      name: entry.post.author.name,
      username: entry.post.author.username,
      avatar: entry.post.author.avatar,
      isVerified: entry.post.author.is_verified
    },
    content: entry.post.content,
    image: entry.post.image,
    location: entry.post.location,
    timestamp: entry.post.created_at.toISOString(),
    likes: entry.post.likesCount,
    comments: entry.post.commentsCount,
    shares: entry.post.shares,
    isLiked: entry.post.likes?.length > 0,
    isSaved: true
  }));
}

export async function getFollowers(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { following_id: userId },
    orderBy: { created_at: 'desc' },
    include: { follower: true }
  });

  return follows.map(f => ({
    id: f.follower.id,
    name: f.follower.name,
    username: f.follower.username,
    avatar: f.follower.avatar,
    bio: f.follower.bio,
    is_verified: f.follower.is_verified,
    followed_at: f.created_at.toISOString(),
  }));
}

export async function getFollowing(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { follower_id: userId },
    orderBy: { created_at: 'desc' },
    include: { following: true }
  });

  return follows.map(f => ({
    id: f.following.id,
    name: f.following.name,
    username: f.following.username,
    avatar: f.following.avatar,
    bio: f.following.bio,
    is_verified: f.following.is_verified,
    followed_at: f.created_at.toISOString(),
  }));
}

export async function searchUsers(query: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { username: { contains: query } },
      ]
    },
    take: 20,
  });

  return users.map(u => ({
    id: u.id,
    name: u.name,
    username: u.username,
    avatar: u.avatar,
    bio: u.bio,
    followers: u.followers,
    is_verified: u.is_verified,
  }));
}

export async function getPostById(postId: string, currentUserId?: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      likes: currentUserId ? { where: { user_id: currentUserId } } : false,
      savedBy: currentUserId ? { where: { user_id: currentUserId } } : false,
    }
  });

  if (!post) return null;

  return {
    id: post.id,
    author: {
      id: post.author.id,
      name: post.author.name,
      username: post.author.username,
      avatar: post.author.avatar,
      isVerified: post.author.is_verified
    },
    content: post.content,
    image: post.image,
    location: post.location,
    timestamp: post.created_at.toISOString(),
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.shares,
    isLiked: post.likes?.length > 0,
    isSaved: post.savedBy?.length > 0
  };
}

