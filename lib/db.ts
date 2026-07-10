// Mock database - in-memory storage for deployment without a real database
import { v4 as uuidv4 } from 'uuid';

// Types
export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  cover_image: string;
  is_verified: boolean;
  followers: number;
  following: number;
  posts: number;
  created_at: Date;
};

export type Post = {
  id: string;
  author_id: string;
  content: string;
  image: string | null;
  location: string | null;
  likesCount: number;
  commentsCount: number;
  shares: number;
  created_at: Date;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes: number;
  created_at: Date;
};

export type SafeUser = Omit<User, 'password_hash'>;

// Mock data storage
const users: Map<string, User> = new Map();
const posts: Map<string, Post> = new Map();
const comments: Map<string, Comment> = new Map();
const likes: Map<string, { post_id: string; user_id: string }> = new Map();
const savedPosts: Map<string, { post_id: string; user_id: string }> = new Map();
const follows: Map<string, { follower_id: string; following_id: string }> = new Map();

// Initialize with mock data
const initializeMockData = () => {
  if (users.size > 0) return; // Already initialized

  // Create default users
  const user1: User = {
    id: 'user1',
    name: 'Alex Chen',
    username: 'alexchen',
    email: 'alex@example.com',
    password_hash: '$2a$10$mock_hash_1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'Creative Developer 🚀',
    location: 'San Francisco',
    website: 'alexchen.dev',
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    is_verified: true,
    followers: 512,
    following: 234,
    posts: 89,
    created_at: new Date('2023-01-15'),
  };

  const user2: User = {
    id: 'user2',
    name: 'Sarah Williams',
    username: 'sarahwill',
    email: 'sarah@example.com',
    password_hash: '$2a$10$mock_hash_2',
    avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
    bio: 'Designer & Creative 🎨',
    location: 'New York',
    website: 'sarahdesigns.com',
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    is_verified: false,
    followers: 234,
    following: 156,
    posts: 45,
    created_at: new Date('2023-03-22'),
  };

  users.set(user1.id, user1);
  users.set(user2.id, user2);

  // Create mock posts
  const post1: Post = {
    id: 'post1',
    author_id: 'user1',
    content: 'Just launched my new portfolio website! Check it out and let me know what you think. The journey continues! 🚀',
    image: null,
    location: 'San Francisco, CA',
    likesCount: 234,
    commentsCount: 18,
    shares: 42,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  };

  const post2: Post = {
    id: 'post2',
    author_id: 'user2',
    content: 'Excited to announce that I\'m starting a new role as Lead Designer at an amazing startup! 🎉',
    image: null,
    location: 'New York, NY',
    likesCount: 567,
    commentsCount: 45,
    shares: 89,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
  };

  posts.set(post1.id, post1);
  posts.set(post2.id, post2);
};

// Initialize on load
initializeMockData();

export function toSafeUser(user: User): SafeUser {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

// ========== User Operations ==========

export async function createUser(
  id: string,
  name: string,
  username: string,
  email: string,
  passwordHash: string,
  avatar?: string,
  coverImage?: string
): Promise<User> {
  const user: User = {
    id,
    name,
    username,
    email,
    password_hash: passwordHash,
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    bio: 'New Quantum Creator ✨',
    location: '',
    website: '',
    cover_image: coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    is_verified: false,
    followers: 0,
    following: 0,
    posts: 0,
    created_at: new Date(),
  };
  users.set(id, user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.username === username) return user;
  }
  return null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

export async function updateUser(
  id: string,
  updates: Partial<Pick<User, 'name' | 'username' | 'bio' | 'location' | 'website' | 'avatar' | 'cover_image'>>
): Promise<User> {
  const user = users.get(id);
  if (!user) throw new Error('User not found');
  
  Object.assign(user, updates);
  return user;
}

// ========== Post Operations ==========

export async function createPost(
  id: string,
  authorId: string,
  content: string,
  image?: string | null,
  location?: string | null
): Promise<Post> {
  const post: Post = {
    id,
    author_id: authorId,
    content,
    image: image || null,
    location: location || null,
    likesCount: 0,
    commentsCount: 0,
    shares: 0,
    created_at: new Date(),
  };
  
  posts.set(id, post);
  
  const author = users.get(authorId);
  if (author) author.posts++;
  
  return post;
}

export async function getFeedPosts(currentUserId?: string) {
  const postArray = Array.from(posts.values())
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 50);

  return postArray.map(post => {
    const author = users.get(post.author_id);
    if (!author) return null;

    const isLiked = currentUserId ? 
      Array.from(likes.values()).some(l => l.post_id === post.id && l.user_id === currentUserId) : 
      false;
    const isSaved = currentUserId ? 
      Array.from(savedPosts.values()).some(s => s.post_id === post.id && s.user_id === currentUserId) : 
      false;

    return {
      id: post.id,
      author: {
        id: author.id,
        name: author.name,
        username: author.username,
        avatar: author.avatar,
        isVerified: author.is_verified
      },
      content: post.content,
      image: post.image,
      location: post.location,
      timestamp: post.created_at.toISOString(),
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.shares,
      isLiked,
      isSaved,
    };
  }).filter(Boolean);
}

// ========== Interactions ==========

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const key = `${postId}-${userId}`;
  
  if (likes.has(key)) {
    likes.delete(key);
    const post = posts.get(postId);
    if (post) post.likesCount = Math.max(0, post.likesCount - 1);
    return false;
  } else {
    likes.set(key, { post_id: postId, user_id: userId });
    const post = posts.get(postId);
    if (post) post.likesCount++;
    return true;
  }
}

export async function toggleSave(postId: string, userId: string): Promise<boolean> {
  const key = `${postId}-${userId}`;
  
  if (savedPosts.has(key)) {
    savedPosts.delete(key);
    return false;
  } else {
    savedPosts.set(key, { post_id: postId, user_id: userId });
    return true;
  }
}

export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) return false;
  
  const key = `${followerId}-${followingId}`;
  
  if (follows.has(key)) {
    follows.delete(key);
    const follower = users.get(followerId);
    const following = users.get(followingId);
    if (follower) follower.following = Math.max(0, follower.following - 1);
    if (following) following.followers = Math.max(0, following.followers - 1);
    return false;
  } else {
    follows.set(key, { follower_id: followerId, following_id: followingId });
    const follower = users.get(followerId);
    const following = users.get(followingId);
    if (follower) follower.following++;
    if (following) following.followers++;
    return true;
  }
}

// ========== Comments ==========

export async function addComment(id: string, postId: string, authorId: string, content: string) {
  const comment: Comment = {
    id,
    post_id: postId,
    author_id: authorId,
    content,
    likes: 0,
    created_at: new Date(),
  };
  
  comments.set(id, comment);
  
  const post = posts.get(postId);
  if (post) post.commentsCount++;

  const author = users.get(authorId);
  if (!author) return null;

  return {
    id: comment.id,
    author: {
      name: author.name,
      username: author.username,
      avatar: author.avatar
    },
    content: comment.content,
    timestamp: comment.created_at.toISOString(),
    likes: comment.likes,
    isLiked: false
  };
}

export async function getComments(postId: string) {
  const postComments = Array.from(comments.values())
    .filter(c => c.post_id === postId)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

  return postComments.map(comment => {
    const author = users.get(comment.author_id);
    if (!author) return null;

    return {
      id: comment.id,
      author: {
        name: author.name,
        username: author.username,
        avatar: author.avatar
      },
      content: comment.content,
      timestamp: comment.created_at.toISOString(),
      likes: comment.likes,
      isLiked: false
    };
  }).filter(Boolean);
}

// ========== Profiles ==========

export async function getUserProfile(userId: string, currentUserId?: string) {
  const user = users.get(userId);
  if (!user) return null;

  const isFollowing = currentUserId && currentUserId !== userId ?
    follows.has(`${currentUserId}-${userId}`) : false;

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
  const userPosts = Array.from(posts.values())
    .filter(p => p.author_id === userId)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, 50);

  return userPosts.map(post => {
    const author = users.get(post.author_id);
    if (!author) return null;

    const isLiked = currentUserId ? 
      likes.has(`${post.id}-${currentUserId}`) : false;
    const isSaved = currentUserId ? 
      savedPosts.has(`${post.id}-${currentUserId}`) : false;

    return {
      id: post.id,
      author: {
        id: author.id,
        name: author.name,
        username: author.username,
        avatar: author.avatar,
        isVerified: author.is_verified
      },
      content: post.content,
      image: post.image,
      location: post.location,
      timestamp: post.created_at.toISOString(),
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.shares,
      isLiked,
      isSaved,
    };
  }).filter(Boolean);
}

export async function getSavedPosts(userId: string) {
  const userSaved = Array.from(savedPosts.values())
    .filter(s => s.user_id === userId);

  return userSaved.map(saved => {
    const post = posts.get(saved.post_id);
    const author = post ? users.get(post.author_id) : null;
    if (!post || !author) return null;

    return {
      id: post.id,
      author: {
        id: author.id,
        name: author.name,
        username: author.username,
        avatar: author.avatar,
        isVerified: author.is_verified
      },
      content: post.content,
      image: post.image,
      location: post.location,
      timestamp: post.created_at.toISOString(),
      likes: post.likesCount,
      comments: post.commentsCount,
      shares: post.shares,
      isLiked: likes.has(`${post.id}-${userId}`),
      isSaved: true,
    };
  }).filter(Boolean);
}

export async function getFollowers(userId: string) {
  const userFollows = Array.from(follows.values())
    .filter(f => f.following_id === userId)
    .map(f => {
      const follower = users.get(f.follower_id);
      return {
        id: follower?.id || '',
        name: follower?.name || '',
        username: follower?.username || '',
        avatar: follower?.avatar || '',
        bio: follower?.bio || '',
        is_verified: follower?.is_verified || false,
        followed_at: new Date().toISOString(),
      };
    });

  return userFollows;
}

export async function getFollowing(userId: string) {
  const userFollows = Array.from(follows.values())
    .filter(f => f.follower_id === userId)
    .map(f => {
      const following = users.get(f.following_id);
      return {
        id: following?.id || '',
        name: following?.name || '',
        username: following?.username || '',
        avatar: following?.avatar || '',
        bio: following?.bio || '',
        is_verified: following?.is_verified || false,
        followed_at: new Date().toISOString(),
      };
    });

  return userFollows;
}

export async function searchUsers(query: string) {
  return Array.from(users.values())
    .filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 20)
    .map(u => ({
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
  const post = posts.get(postId);
  if (!post) return null;

  const author = users.get(post.author_id);
  if (!author) return null;

  const isLiked = currentUserId ? likes.has(`${postId}-${currentUserId}`) : false;
  const isSaved = currentUserId ? savedPosts.has(`${postId}-${currentUserId}`) : false;

  return {
    id: post.id,
    author: {
      id: author.id,
      name: author.name,
      username: author.username,
      avatar: author.avatar,
      isVerified: author.is_verified
    },
    content: post.content,
    image: post.image,
    location: post.location,
    timestamp: post.created_at.toISOString(),
    likes: post.likesCount,
    comments: post.commentsCount,
    shares: post.shares,
    isLiked,
    isSaved,
  };
}

// Export for backwards compatibility
export const prisma = null;
