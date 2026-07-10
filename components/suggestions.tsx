'use client';

import { suggestions, currentUser } from '@/lib/mock-data';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAppContext } from '@/lib/context';

export function Suggestions() {
  const { isFollowing, toggleFollow, user } = useAppContext();
  const profileUser = user || currentUser;

  return (
    <div className="hidden lg:block">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={profileUser.avatar}
            alt={profileUser.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{profileUser.name}</p>
          <p className="text-xs text-muted-foreground">@{profileUser.username}</p>
        </div>
        <button className="text-primary font-semibold text-xs hover:text-primary/80">Switch</button>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-sm text-muted-foreground">Suggested For You</p>
          <button className="text-xs font-semibold text-foreground hover:text-muted-foreground">See All</button>
        </div>

        <div className="space-y-3">
          {suggestions.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.avatar}
                    alt={user.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.mutualFriends} mutual friends
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleFollow(user.id)}
                className={`font-semibold text-xs transition-all ${
                  isFollowing(user.id)
                    ? 'text-foreground border border-border rounded px-3 py-1'
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                {isFollowing(user.id) ? 'Following' : 'Follow'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 space-y-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:text-foreground">About</a>
          <a href="#" className="hover:text-foreground">Help</a>
          <a href="#" className="hover:text-foreground">Press</a>
          <a href="#" className="hover:text-foreground">API</a>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:text-foreground">Jobs</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Locations</a>
        </div>
        <p className="text-xs text-muted-foreground/60 mt-4">© 2024 Quantum</p>
      </div>
    </div>
  );
}
