'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { useAppContext } from '@/lib/context';
import { InstagramPost } from '@/components/instagram-post';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Compass } from 'lucide-react';
import Link from 'next/link';

export default function SavedPostsPage() {
  const { posts, isSaved } = useAppContext();

  const savedList = posts.filter((post) => isSaved(post.id));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-black text-foreground">Saved</h1>
            </div>
            <p className="text-muted-foreground">Your private bookmarks collection</p>
          </motion.div>

          {/* Bookmarked Feed */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {savedList.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <InstagramPost post={post} />
                </motion.div>
              ))}
            </AnimatePresence>

            {savedList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-card border border-border rounded-2xl p-8"
              >
                <Bookmark size={48} className="mx-auto text-muted mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-1">No Saved Posts</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                  Save posts from your feed by clicking the bookmark icon to view them here later.
                </p>
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 mx-auto hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <Compass size={16} />
                    Explore Feed
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
