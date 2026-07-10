'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, Clock, UserPlus, MessageCircle, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '@/lib/context';

export default function SearchPage() {
  const { searchQuery, setSearchQuery, isFollowing, toggleFollow, isLiked, toggleLike, exploreUsers, posts } = useAppContext();
  const [searchResults, setSearchResults] = useState<'users' | 'posts' | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      setSearchResults('users');
    } else {
      setSearchResults(null);
    }
  };

  const handleFollow = (userId: string) => {
    toggleFollow(userId);
  };

  const filteredUsers = exploreUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search Quantum..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-card border border-border text-foreground rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>

          {/* Search Results */}
          {searchQuery === '' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted-foreground mb-4">Search users, posts, and more</p>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <h3 className="font-bold mb-4">Recent Searches</h3>
                <div className="space-y-2">
                  {['Design', 'Photography', 'Tech'].map((search) => (
                    <motion.button
                      key={search}
                      whileHover={{ x: 4 }}
                      onClick={() => setSearchQuery(search)}
                      className="w-full text-left flex items-center gap-3 p-3 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Tabs */}
              <div className="flex gap-4 border-b border-border">
                <button
                  onClick={() => setSearchResults('users')}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                    searchResults === 'users'
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  Users ({filteredUsers.length})
                </button>
                <button
                  onClick={() => setSearchResults('posts')}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                    searchResults === 'posts'
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  Posts ({filteredPosts.length})
                </button>
              </div>

              {/* Users Results */}
              {searchResults === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        whileHover={{ x: 4 }}
                        className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">@{user.username}</p>
                            <p className="text-xs text-foreground mt-1">{user.bio}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFollow(user.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                              isFollowing(user.id)
                                ? 'bg-muted text-foreground border border-border'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                          >
                            {isFollowing(user.id) ? 'Following' : 'Follow'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No users found</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Posts Results */}
              {searchResults === 'posts' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ y: -2 }}
                        className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{post.author.name}</p>
                            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                          </div>
                        </div>

                        <p className="text-sm mb-3">{post.content}</p>

                        {post.image && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={post.image}
                              alt="Post"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="flex gap-4 text-muted-foreground">
                          <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Heart size={16} />
                            <span className="text-xs">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <MessageCircle size={16} />
                            <span className="text-xs">{post.comments}</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No posts found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
