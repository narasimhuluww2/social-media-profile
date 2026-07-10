'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, Info, Mail, X } from 'lucide-react';
import { useAppContext } from '@/lib/context';

const toastIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: Mail,
  system: Info,
};

const toastColors = {
  like: 'border-red-500/30 bg-red-500/10 text-red-500',
  comment: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  follow: 'border-blue-500/30 bg-blue-500/10 text-blue-500',
  message: 'border-purple-500/30 bg-purple-500/10 text-purple-500',
  system: 'border-primary/30 bg-primary/10 text-primary',
};

export function ToastNotification() {
  const { toast, hideToast } = useAppContext();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, hideToast]);

  const Icon = toastIcons[toast.type] || Info;
  const colorClass = toastColors[toast.type] || toastColors.system;

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:-translate-x-0 z-50 w-full max-w-sm px-4 sm:px-0"
        >
          <div className="glassmorphism soft-shadow rounded-2xl border border-border/80 p-4 flex gap-3 items-start relative overflow-hidden bg-card/95 backdrop-blur-md">
            {/* Color Accent Indicator */}
            <div className={`p-2 rounded-xl border ${colorClass} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="animate-pulse-slow" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-bold text-sm text-foreground mb-0.5 truncate">{toast.title}</h4>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{toast.message}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={hideToast}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/40 absolute top-3 right-3"
            >
              <X size={16} />
            </button>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.75 bg-primary/40 w-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
