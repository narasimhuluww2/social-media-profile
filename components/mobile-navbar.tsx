'use client';

import { Home, Compass, Heart, Mail, Bookmark, User, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/lib/context';

export function MobileNavbar() {
  const pathname = usePathname();
  const { conversations, unreadNotificationsCount } = useAppContext();

  const unreadMessagesCount = conversations.filter((c) => c.unread).length;

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Compass, label: 'Explore', href: '/explore' },
    { icon: Heart, label: 'Notifications', href: '/notifications', badge: unreadNotificationsCount },
    { icon: Mail, label: 'Messages', href: '/messages', badge: unreadMessagesCount },
    { icon: Bookmark, label: 'Saved', href: '/saved' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 soft-shadow">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className="flex-1 h-full">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={`relative flex flex-col items-center justify-center w-full h-full text-xs font-semibold gap-0.5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-card shadow-sm animate-pulse-slow">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium tracking-tight leading-none">{item.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

