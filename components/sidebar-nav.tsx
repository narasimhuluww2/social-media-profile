'use client';

import { Home, Compass, Heart, Mail, BookmarkIcon, BarChart3, Settings, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Compass, label: 'Explore', active: false },
  { icon: Heart, label: 'Notifications', active: false },
  { icon: Mail, label: 'Messages', active: false },
  { icon: BookmarkIcon, label: 'Saved', active: false },
  { icon: BarChart3, label: 'Stats', active: false },
];

export function SidebarNav() {
  return (
    <div className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-card md:border-r md:border-border md:p-4 md:flex md:flex-col">
      {/* Logo */}
      <div className="mb-8 mt-4">
        <div className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Instagram
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-3 flex-1">
        {navItems.map((item, index) => (
          <motion.button
            key={item.label}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-3 border-t border-border pt-4">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-all"
        >
          <Settings className="h-6 w-6" />
          <span className="font-medium">Settings</span>
        </motion.button>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-all"
        >
          <MoreHorizontal className="h-6 w-6" />
          <span className="font-medium">More</span>
        </motion.button>
      </div>
    </div>
  );
}
