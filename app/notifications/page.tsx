'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useAppContext } from '@/lib/context';

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: MessageCircle,
};

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useAppContext();

  // Mark all as read when opening notifications
  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {notifications.map((notification, index) => {
              const IconComponent = notificationIcons[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 rounded-xl border border-border transition-all cursor-pointer hover:bg-secondary ${
                    !notification.read ? 'bg-primary/5' : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                      <Image
                        src={notification.actor.avatar}
                        alt={notification.actor.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {notification.actor.name}
                        </p>
                        <span className="text-muted-foreground text-sm">
                          @{notification.actor.username}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent size={18} className="text-primary" />
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Heart size={48} className="mx-auto text-muted mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
