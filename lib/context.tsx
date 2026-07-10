'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Post,
  User,
  Comment,
  Conversation,
  Message,
  Notification,
  currentUser as initialCurrentUser,
  posts as initialPosts,
  suggestions as initialSuggestions,
  conversations as initialConversations,
  notifications as initialNotifications,
  exploreUsers as initialExploreUsers,
  comments as initialComments
} from './mock-data';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  website?: string;
  location?: string;
  coverImage?: string;
  isVerified?: boolean;
}

interface ToastInfo {
  show: boolean;
  message: string;
  title: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
}

interface AppContextType {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (name: string, username: string, bio: string, location: string, website: string, avatar?: string, coverImage?: string) => void;

  // Posts Feed
  posts: Post[];
  createPost: (caption: string, imagePreview: string | null, location?: string) => void;
  
  // Interactions
  likedPosts: Set<string>;
  savedPosts: Set<string>;
  followedUsers: Set<string>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleFollow: (userId: string) => void;
  isLiked: (postId: string) => boolean;
  isSaved: (postId: string) => boolean;
  isFollowing: (userId: string) => boolean;

  // Comments
  comments: Record<string, Comment[]>;
  addComment: (postId: string, content: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Messaging
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, content: string) => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => void;

  // Explore
  exploreUsers: User[];

  // Toast
  toast: ToastInfo;
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  hideToast: () => void;

  // Initialization status
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [exploreUsers, setExploreUsers] = useState<User[]>(initialExploreUsers);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set(['2']));
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    '1': initialComments,
  });

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastInfo>({ show: false, message: '', title: '', type: 'system' });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize: check backend session first, then load local data
  useEffect(() => {
    async function initSession() {
      if (typeof window === 'undefined') return;

      // Try to restore session from backend cookie
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          const dbUser = data.user;
          const authUser: AuthUser = {
            id: dbUser.id,
            name: dbUser.name,
            username: dbUser.username,
            avatar: dbUser.avatar,
            bio: dbUser.bio,
            followers: dbUser.followers,
            following: dbUser.following,
            posts: dbUser.posts,
            website: dbUser.website,
            location: dbUser.location,
            coverImage: dbUser.cover_image,
            isVerified: !!dbUser.is_verified,
          };
          setUser(authUser);
          localStorage.setItem('qt_user', JSON.stringify(authUser));

          // Fetch real posts feed
          try {
            const postsRes = await fetch('/api/posts');
            if (postsRes.ok) {
              const postsData = await postsRes.json();
              setPosts(postsData.posts);
              
              // Extract liked/saved state from posts
              const liked = new Set<string>();
              const saved = new Set<string>();
              postsData.posts.forEach((p: any) => {
                if (p.isLiked) liked.add(p.id);
                if (p.isSaved) saved.add(p.id);
              });
              setLikedPosts(liked);
              setSavedPosts(saved);
            }
          } catch (e) {
            console.error('Failed to fetch posts feed:', e);
          }
        } else {
          // No valid session — clear any stale local user
          localStorage.removeItem('qt_user');
        }
      } catch {
        // API unavailable — fall back to localStorage user if present
        const storedUser = localStorage.getItem('qt_user');
        if (storedUser) setUser(JSON.parse(storedUser));
      }

      // Load other local data (posts, explore, conversations, etc.)
      const storedPosts = localStorage.getItem('qt_posts');
      const storedExplore = localStorage.getItem('qt_explore_users');
      const storedConvs = localStorage.getItem('qt_conversations');
      const storedMessages = localStorage.getItem('qt_messages');
      const storedNotifs = localStorage.getItem('qt_notifications');
      const storedLiked = localStorage.getItem('qt_liked_posts');
      const storedSaved = localStorage.getItem('qt_saved_posts');
      const storedFollowed = localStorage.getItem('qt_followed_users');
      const storedComments = localStorage.getItem('qt_comments');

      if (storedPosts && posts === initialPosts) setPosts(JSON.parse(storedPosts));
      if (storedExplore) setExploreUsers(JSON.parse(storedExplore));
      if (storedConvs) setConversations(JSON.parse(storedConvs));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
      if (storedComments) setComments(JSON.parse(storedComments));

      if (storedLiked && likedPosts.size === 1) setLikedPosts(new Set(JSON.parse(storedLiked)));
      if (storedSaved && savedPosts.size === 0) setSavedPosts(new Set(JSON.parse(storedSaved)));
      if (storedFollowed) setFollowedUsers(new Set(JSON.parse(storedFollowed)));

      // If no messages stored yet, populate some defaults
      if (!storedMessages) {
        const initialMsgs: Record<string, Message[]> = {
          '1': [
            { id: 'm1', conversationId: '1', senderId: 'user1', senderName: 'Sarah Anderson', senderAvatar: initialCurrentUser.avatar, content: 'Hey Alex! Are we still on for the project review?', timestamp: '2h ago', read: true },
            { id: 'm2', conversationId: '1', senderId: 'alex_chen', senderName: 'Alex Chen', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', content: 'Hey Sarah! Yes, absolutely. Let\'s do 3 PM.', timestamp: '1h ago', read: true },
            { id: 'm3', conversationId: '1', senderId: 'user1', senderName: 'Sarah Anderson', senderAvatar: initialCurrentUser.avatar, content: 'Sounds great! See you then', timestamp: '5m ago', read: true },
          ],
          '2': [
            { id: 'm4', conversationId: '2', senderId: 'emma_tech', senderName: 'Emma Tech', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', content: 'Check out this new design! 🎨', timestamp: '2h ago', read: false },
          ],
          '3': [
            { id: 'm5', conversationId: '3', senderId: 'mike_design', senderName: 'Mike Design', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', content: 'The launch was a huge success!', timestamp: '2d ago', read: true },
            { id: 'm6', conversationId: '3', senderId: 'user1', senderName: 'Sarah Anderson', senderAvatar: initialCurrentUser.avatar, content: 'That was awesome!', timestamp: '1d ago', read: true },
          ]
        };
        setMessages(initialMsgs);
        localStorage.setItem('qt_messages', JSON.stringify(initialMsgs));
      }

      setIsInitialized(true);
    }

    initSession();
  }, []);

  // Helper function to persist a state change
  const saveToStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Toast controls
  const showToast = (title: string, message: string, type: ToastInfo['type'] = 'system') => {
    setToast({ show: true, message, title, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Auth functions — connected to real backend API
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      const dbUser = data.user;
      const loggedUser: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        avatar: dbUser.avatar,
        bio: dbUser.bio,
        followers: dbUser.followers,
        following: dbUser.following,
        posts: dbUser.posts,
        website: dbUser.website,
        location: dbUser.location,
        coverImage: dbUser.cover_image,
        isVerified: !!dbUser.is_verified,
      };
      setUser(loggedUser);
      saveToStorage('qt_user', loggedUser);
      showToast('Welcome Back', `Logged in as ${loggedUser.name}`, 'system');
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (name: string, username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }

      const dbUser = data.user;
      const newUser: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        username: dbUser.username,
        avatar: dbUser.avatar,
        bio: dbUser.bio,
        followers: dbUser.followers,
        following: dbUser.following,
        posts: dbUser.posts,
        website: dbUser.website,
        location: dbUser.location,
        coverImage: dbUser.cover_image,
        isVerified: !!dbUser.is_verified,
      };
      setUser(newUser);
      saveToStorage('qt_user', newUser);
      showToast('Welcome', `Account created successfully, ${name}!`, 'system');
      return { success: true };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue with local cleanup even if API call fails
    }
    setUser(null);
    setLikedPosts(new Set());
    setSavedPosts(new Set());
    setFollowedUsers(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('qt_user');
      localStorage.removeItem('qt_liked_posts');
      localStorage.removeItem('qt_saved_posts');
      localStorage.removeItem('qt_followed_users');
    }
    showToast('Logged Out', 'You have been successfully logged out', 'system');
  };

  const updateProfile = async (name: string, username: string, bio: string, location: string, website: string, avatar?: string, coverImage?: string) => {
    if (!user) return;

    // Optimistic update
    const updated = {
      ...user,
      name,
      username,
      bio,
      location,
      website,
      avatar: avatar || user.avatar,
      coverImage: coverImage || user.coverImage
    };
    setUser(updated);
    saveToStorage('qt_user', updated);

    // Persist to backend
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          bio,
          location,
          website,
          avatar: avatar || user.avatar,
          cover_image: coverImage || user.coverImage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const dbUser = data.user;
        const synced: AuthUser = {
          id: dbUser.id,
          name: dbUser.name,
          username: dbUser.username,
          avatar: dbUser.avatar,
          bio: dbUser.bio,
          followers: dbUser.followers,
          following: dbUser.following,
          posts: dbUser.posts,
          website: dbUser.website,
          location: dbUser.location,
          coverImage: dbUser.cover_image,
          isVerified: !!dbUser.is_verified,
        };
        setUser(synced);
        saveToStorage('qt_user', synced);
      }
    } catch {
      // Optimistic update already applied — backend will sync next session
    }

    showToast('Success', 'Profile updated successfully!', 'system');
  };

  // Feed functions
  const createPost = async (caption: string, imagePreview: string | null, location?: string) => {
    if (!user) return;
    
    // API Call
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: caption, image: imagePreview, location }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts([data.post, ...posts]);
        
        const updatedUser = { ...user, posts: user.posts + 1 };
        setUser(updatedUser);
        saveToStorage('qt_user', updatedUser);
        showToast('Success', 'Your post was published!', 'system');
      }
    } catch {
      showToast('Error', 'Failed to publish post', 'system');
    }
  };

  // Interactions
  const toggleLike = async (postId: string) => {
    if (!user) return;
    
    // Optimistic Update
    let wasLiked = false;
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        wasLiked = true;
      }
      saveToStorage('qt_liked_posts', Array.from(newSet));
      return newSet;
    });

    setPosts((prev) => prev.map((post) => {
      if (post.id === postId) {
        return { ...post, likes: Math.max(0, post.likes + (wasLiked ? 1 : -1)) };
      }
      return post;
    }));

    // API Call
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch {
      // Revert if failed (simplified here)
    }

    // Trigger notification if liked (and not liked own post)
    const targetPost = posts.find(p => p.id === postId);
    if (wasLiked && targetPost && targetPost.author.username !== user?.username) {
      addNotification('like', {
        name: user?.name || 'Sarah Anderson',
        username: user?.username || 'sarahanders',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
      }, 'liked your post', postId);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    let wasSaved = false;
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        wasSaved = true;
      }
      saveToStorage('qt_saved_posts', Array.from(newSet));
      return newSet;
    });

    // API Call
    try {
      await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
    } catch {}

    showToast(
      wasSaved ? 'Saved to Bookmarks' : 'Removed from Bookmarks',
      wasSaved ? 'You can access this post in your Saved tab' : 'Post removed from your Bookmarks',
      'system'
    );
  };

  const toggleFollow = async (userId: string) => {
    if (!user) return;

    let isNowFollowing = false;
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
        isNowFollowing = true;
      }
      saveToStorage('qt_followed_users', Array.from(newSet));
      return newSet;
    });

    // API Call
    try {
      await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
    } catch {}

    // Update follow count of the target user in exploreUsers list
    const updatedExplore = exploreUsers.map((u) => {
      if (u.id === userId) {
        const diff = isNowFollowing ? 1 : -1;
        return { ...u, followers: Math.max(0, u.followers + diff) };
      }
      return u;
    });
    setExploreUsers(updatedExplore);
    saveToStorage('qt_explore_users', updatedExplore);

    // Update current user following count
    if (user) {
      const diff = isNowFollowing ? 1 : -1;
      const updatedUser = { ...user, following: Math.max(0, user.following + diff) };
      setUser(updatedUser);
      saveToStorage('qt_user', updatedUser);
    }

    // Trigger follow notification
    const targetUser = exploreUsers.find(u => u.id === userId);
    if (isNowFollowing && targetUser) {
      addNotification('follow', {
        name: user?.name || 'Sarah Anderson',
        username: user?.username || 'sarahanders',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
      }, 'started following you');
      showToast('New Follow', `You started following @${targetUser.username}`, 'follow');
    }
  };

  const isLiked = (postId: string) => likedPosts.has(postId);
  const isSaved = (postId: string) => savedPosts.has(postId);
  const isFollowing = (userId: string) => followedUsers.has(userId);

  // Comments functions
  const addComment = async (postId: string, content: string) => {
    if (!user) return;
    
    // API Call
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        const newComment = data.comment;
        
        const postComments = comments[postId] || [];
        const updatedComments = {
          ...comments,
          [postId]: [...postComments, newComment]
        };
        setComments(updatedComments);
        saveToStorage('qt_comments', updatedComments);

        // Update comment counter on the post
        const newPosts = posts.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: post.comments + 1 };
          }
          return post;
        });
        setPosts(newPosts);
        
        // Notification
        const targetPost = posts.find(p => p.id === postId);
        if (targetPost && targetPost.author.username !== user.username) {
          addNotification('comment', {
            name: user.name,
            username: user.username,
            avatar: user.avatar
          }, `commented: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`, postId);
        }
      }
    } catch {}
  };

  // Messaging functions
  const sendMessage = (conversationId: string, content: string) => {
    if (!user) return;
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'user1',
      senderName: user.name,
      senderAvatar: user.avatar,
      content,
      timestamp: 'Just now',
      read: true
    };

    const convMessages = messages[conversationId] || [];
    const updatedMessages = {
      ...messages,
      [conversationId]: [...convMessages, newMsg]
    };
    setMessages(updatedMessages);
    saveToStorage('qt_messages', updatedMessages);

    // Update conversation last message details
    const updatedConvs = conversations.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: content,
          lastMessageTime: 'Just now',
          unread: false
        };
      }
      return c;
    });
    setConversations(updatedConvs);
    saveToStorage('qt_conversations', updatedConvs);

    // Trigger simulated reply from the contact in 1.5 seconds!
    const replyPartner = conv.participants[0];
    setTimeout(() => {
      const partnerReplies = [
        "That's awesome! Let me know if you need anything.",
        "Oh neat! Send me a link when it is ready. 🔗",
        "Haha, classic! Love that view. 🌅",
        "Sounds like a plan! Talk to you later.",
        "Wow, that's beautiful! Where was this taken? 😮",
        "Absolutely, I totally agree with that."
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      
      const replyMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        conversationId,
        senderId: replyPartner.id,
        senderName: replyPartner.name,
        senderAvatar: replyPartner.avatar,
        content: randomReply,
        timestamp: 'Just now',
        read: false
      };

      setMessages((prevMsgs) => {
        const currentMsgs = prevMsgs[conversationId] || [];
        const newest = {
          ...prevMsgs,
          [conversationId]: [...currentMsgs, replyMsg]
        };
        saveToStorage('qt_messages', newest);
        return newest;
      });

      setConversations((prevConvs) => {
        const newest = prevConvs.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              unread: selectedConversation !== conversationId // Unread if not looking at this chat
            };
          }
          return c;
        });
        saveToStorage('qt_conversations', newest);
        return newest;
      });

      // Add Notification
      addNotification('message', {
        name: replyPartner.name,
        username: replyPartner.username,
        avatar: replyPartner.avatar
      }, `sent you a message: "${randomReply}"`);

      // Audio notification if supported
      if (typeof Audio !== 'undefined') {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch(e) {}
      }

      // Show real-time overlay toast
      showToast(replyPartner.name, randomReply, 'message');
    }, 1500);
  };

  // Notifications functions
  const addNotification = (
    type: Notification['type'],
    actor: { name: string; username: string; avatar: string },
    content: string,
    postId?: string
  ) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      type,
      actor,
      content,
      postId,
      timestamp: 'Just now',
      read: false
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      saveToStorage('qt_notifications', updated);
      return updated;
    });

    // Fire sound effect or toast
    showToast(actor.name, content, type);
  };

  const markNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveToStorage('qt_notifications', updated);
    showToast('Success', 'All notifications marked as read', 'system');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        posts,
        createPost,
        likedPosts,
        savedPosts,
        followedUsers,
        toggleLike,
        toggleSave,
        toggleFollow,
        isLiked,
        isSaved,
        isFollowing,
        comments,
        addComment,
        conversations,
        messages,
        selectedConversation,
        setSelectedConversation,
        sendMessage,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        exploreUsers,
        searchQuery,
        setSearchQuery,
        toast,
        showToast,
        hideToast,
        isInitialized,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
