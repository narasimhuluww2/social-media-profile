'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { useAppContext } from '@/lib/context';

export default function ExplorePage() {
  const { isFollowing, toggleFollow, exploreUsers } = useAppContext();

  const handleFollow = (userId: string) => {
    toggleFollow(userId);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black mb-2">Explore</h1>
            <p className="text-muted-foreground">Discover new creators and trending content</p>
          </motion.div>

          {/* Users Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {exploreUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all soft-shadow"
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    {user.isVerified && <CheckCircle size={18} className="text-blue-500" />}
                  </div>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                  <p className="text-foreground text-sm mt-2">{user.bio}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border">
                  <div className="text-center">
                    <div className="font-bold text-lg">{(user.followers / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{user.posts}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{user.following}</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                </div>

                {/* Follow Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFollow(user.id)}
                  className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                    isFollowing(user.id)
                      ? 'bg-muted text-foreground border border-border'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
