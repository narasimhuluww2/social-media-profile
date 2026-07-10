export interface Story {
  id: string;
  username: string;
  avatar: string;
  isViewed: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
}

export interface Suggestion {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  mutualFriends: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    username: string;
    avatar: string;
  }>;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  actor: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  isFollowing: boolean;
  website?: string;
  location?: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export const currentUser = {
  name: 'Sarah Anderson',
  username: 'sarahanders',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  bio: 'Designer | Creator | Coffee Enthusiast ☕',
  followers: 12400,
  following: 842,
  posts: 324,
  website: 'www.sarahanders.com',
  location: 'San Francisco, CA',
  coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
  isVerified: true,
};

export const stories: Story[] = [
  { id: '1', username: 'alex_chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isViewed: true },
  { id: '2', username: 'emma_tech', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', isViewed: false },
  { id: '3', username: 'mike_design', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', isViewed: false },
  { id: '4', username: 'jessica_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', isViewed: true },
  { id: '5', username: 'david_photo', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', isViewed: false },
];

export const posts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Alex Chen',
      username: 'alex_chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      isVerified: true,
    },
    content: 'Just launched my new project! Really excited to share it with you all. 🚀',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop',
    timestamp: '2 hours ago',
    likes: 1203,
    comments: 42,
    shares: 128,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Emma Tech',
      username: 'emma_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: 'Beautiful sunset at the beach today 🌅',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop',
    timestamp: '4 hours ago',
    likes: 856,
    comments: 38,
    shares: 92,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      name: 'Mike Design',
      username: 'mike_design',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: 'Working on some new UI designs. What do you think? 💻',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
    timestamp: '6 hours ago',
    likes: 945,
    comments: 56,
    shares: 134,
    isLiked: false,
  },
  {
    id: '4',
    author: {
      name: 'Jessica Art',
      username: 'jessica_art',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'New collection dropping soon! Stay tuned 🎨',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=600&fit=crop',
    timestamp: '8 hours ago',
    likes: 2103,
    comments: 89,
    shares: 267,
    isLiked: false,
  },
];

export const suggestions: Suggestion[] = [
  {
    id: '1',
    username: 'creative_mind',
    fullName: 'Creative Mind',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    mutualFriends: 5,
  },
  {
    id: '2',
    username: 'dev_daily',
    fullName: 'Dev Daily',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    mutualFriends: 3,
  },
  {
    id: '3',
    username: 'photo_vibes',
    fullName: 'Photo Vibes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    mutualFriends: 8,
  },
  {
    id: '4',
    username: 'design_hub',
    fullName: 'Design Hub',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    mutualFriends: 2,
  },
  {
    id: '5',
    username: 'tech_trends',
    fullName: 'Tech Trends',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    mutualFriends: 6,
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: 'user1',
        name: 'Alex Chen',
        username: 'alex_chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
    ],
    lastMessage: 'Sounds great! See you then',
    lastMessageTime: '5m ago',
    unread: false,
  },
  {
    id: '2',
    participants: [
      {
        id: 'user2',
        name: 'Emma Wilson',
        username: 'emmawilson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
    ],
    lastMessage: 'Check out this new design! 🎨',
    lastMessageTime: '2h ago',
    unread: true,
  },
  {
    id: '3',
    participants: [
      {
        id: 'user3',
        name: 'Mike Davis',
        username: 'mikedavis',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
    ],
    lastMessage: 'That was awesome!',
    lastMessageTime: '1d ago',
    unread: false,
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    actor: {
      name: 'Alex Chen',
      username: 'alex_chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'liked your post',
    postId: '1',
    timestamp: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    actor: {
      name: 'Emma Tech',
      username: 'emma_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: 'commented: Amazing work!',
    postId: '1',
    timestamp: '5m ago',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    actor: {
      name: 'Jessica Art',
      username: 'jessica_art',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'started following you',
    timestamp: '1h ago',
    read: true,
  },
  {
    id: '4',
    type: 'like',
    actor: {
      name: 'Mike Design',
      username: 'mike_design',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: 'liked your post',
    postId: '2',
    timestamp: '3h ago',
    read: true,
  },
];

export const exploreUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Studio',
    username: 'sarahstudio',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    bio: 'Professional photographer',
    followers: 45000,
    following: 120,
    posts: 234,
    isVerified: true,
    isFollowing: false,
    website: 'sarahstudio.com',
    location: 'Los Angeles, CA',
  },
  {
    id: '2',
    name: 'Design Labs',
    username: 'designlabs',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    bio: 'Creative design studio',
    followers: 89000,
    following: 200,
    posts: 567,
    isVerified: true,
    isFollowing: false,
    website: 'designlabs.io',
    location: 'New York, NY',
  },
  {
    id: '3',
    name: 'Tech Insider',
    username: 'techinsider',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    bio: 'Latest tech news and reviews',
    followers: 234000,
    following: 450,
    posts: 1200,
    isVerified: true,
    isFollowing: false,
    website: 'techinsider.io',
    location: 'San Francisco, CA',
  },
];

export const comments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Emma Tech',
      username: 'emma_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    content: 'This is incredible! Love the design approach 😍',
    timestamp: '2h ago',
    likes: 234,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Mike Design',
      username: 'mike_design',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    content: 'Amazing work! Can we collaborate on something?',
    timestamp: '1h ago',
    likes: 156,
    isLiked: false,
  },
  {
    id: '3',
    author: {
      name: 'Jessica Art',
      username: 'jessica_art',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    content: 'You never disappoint! 🔥',
    timestamp: '30m ago',
    likes: 89,
    isLiked: true,
  },
];
