'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { QuantumSidebar } from '@/components/quantum-sidebar';
import { Stories } from '@/components/stories';
import { InstagramPost } from '@/components/instagram-post';
import { Suggestions } from '@/components/suggestions';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, posts } = useAppContext();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <div className="text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Quantum
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome to Quantum</h1>
          <p className="text-muted-foreground mb-8">
            Share your moments with the world. Connect with friends, discover amazing content, and express yourself.
          </p>
          <div className="space-y-3">
            <Link href="/auth/signup" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Create Account
              </motion.button>
            </Link>
            <Link href="/auth/login" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full border border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/5 transition-all"
              >
                Log In
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Sidebar */}
      <QuantumSidebar />

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto md:px-0 px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Feed - Center Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Stories */}
              <Stories />

              {/* Posts Feed */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <InstagramPost post={post} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <Suggestions />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
