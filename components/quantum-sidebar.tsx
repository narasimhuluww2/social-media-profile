'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Heart,
  MessageCircle,
  Bookmark,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Search,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '@/lib/context';

export function QuantumSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, conversations, unreadNotificationsCount } = useAppContext();
  const [expanded, setExpanded] = useState(true);

  const unreadMessagesCount = conversations.filter((c) => c.unread).length;

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Explore', icon: Compass, href: '/explore' },
    { label: 'Search', icon: Search, href: '/search' },
    { label: 'Notifications', icon: Heart, href: '/notifications', badge: unreadNotificationsCount },
    { label: 'Messages', icon: MessageCircle, href: '/messages', badge: unreadMessagesCount },
    { label: 'Saved', icon: Bookmark, href: '/saved' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col py-8 px-4 z-40"
      >
        {/* Logo */}
        <Link href="/" className="px-4 mb-10 flex-shrink-0">
          <div className="text-2xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Quantum
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.label} whileHover={{ x: 4 }}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={22} className={isActive ? 'text-primary' : 'text-foreground'} />
                    <span className="text-base">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] font-black min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center border border-card shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-border pt-4 space-y-3 flex-shrink-0">
          {isAuthenticated && user && (
            <Link href="/profile" className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all cursor-pointer border border-border/40"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
              </motion.div>
            </Link>
          )}

          {isAuthenticated && (
            <>
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Post
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-foreground hover:bg-secondary p-3 rounded-xl transition-colors border border-transparent hover:border-border/40"
              >
                <LogOut size={20} className="text-muted-foreground" />
                <span>Logout</span>
              </motion.button>
            </>
          )}
          {!isAuthenticated && (
            <Link href="/auth/login" className="w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-xl hover:shadow-lg transition-all"
              >
                Log In
              </motion.button>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 right-0 left-0 bg-card border-b border-border z-40 h-14 flex items-center px-4 justify-between soft-shadow">
        <Link href="/" className="text-xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Quantum
        </Link>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="hidden" // hide since top menu doesn't toggle much in a single tab layout
        >
          <Menu size={24} />
        </motion.button>
      </div>
    </>
  );
}
