'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { currentUser } from '@/lib/mock-data';
import { useAppContext } from '@/lib/context';
import { motion } from 'framer-motion';
import { ChevronRight, Bell, Lock, Eye, Share2, HelpCircle, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const settingsSections = [
  {
    title: 'Notifications',
    icon: Bell,
    settings: [
      { label: 'Push Notifications', enabled: true },
      { label: 'Email Notifications', enabled: false },
      { label: 'SMS Alerts', enabled: true },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Lock,
    settings: [
      { label: 'Private Account', enabled: false },
      { label: 'Allow Comments', enabled: true },
      { label: 'Two-Factor Authentication', enabled: false },
    ],
  },
  {
    title: 'Display',
    icon: Eye,
    settings: [
      { label: 'Dark Mode', enabled: false },
      { label: 'Compact Mode', enabled: false },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAppContext();
  const profileUser = user || currentUser;

  const [settings, setSettings] = useState(settingsSections);

  // Sync settings UI with current document classlist on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setSettings((prev) =>
        prev.map((section) => {
          if (section.title === 'Display') {
            return {
              ...section,
              settings: section.settings.map((s) =>
                s.label === 'Dark Mode' ? { ...s, enabled: isDark } : s
              ),
            };
          }
          return section;
        })
      );
    }
  }, []);

  const toggleSetting = (sectionIndex: number, settingIndex: number) => {
    setSettings((prev) => {
      const newSettings = JSON.parse(JSON.stringify(prev));
      const setting = newSettings[sectionIndex].settings[settingIndex];
      setting.enabled = !setting.enabled;

      // Real action for Dark Mode
      if (setting.label === 'Dark Mode') {
        if (setting.enabled) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('qt_dark_mode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('qt_dark_mode', 'false');
        }
      }

      return newSettings;
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

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
            <h1 className="text-4xl font-black mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </motion.div>

          {/* Profile Card */}
          <Link href="/profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-8 cursor-pointer hover:border-primary/40 transition-all hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary flex-shrink-0">
                  <Image
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Your Profile</p>
                  <h2 className="text-2xl font-black text-foreground">{profileUser.name}</h2>
                  <p className="text-sm text-muted-foreground">@{profileUser.username}</p>
                </div>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex-shrink-0"
                >
                  <ChevronRight size={24} className="text-primary" />
                </motion.div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary/20 flex gap-6">
                <div className="text-center">
                  <p className="text-lg font-black text-foreground">{profileUser.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-foreground">
                    {profileUser.followers >= 1000 ? `${(profileUser.followers / 1000).toFixed(1)}K` : profileUser.followers}
                  </p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-foreground">{profileUser.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Settings Sections */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {settings.map((section, sectionIndex) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/20">
                    <IconComponent size={24} className="text-primary" />
                    <h2 className="font-bold text-lg text-foreground">{section.title}</h2>
                  </div>

                  {/* Section Settings */}
                  <div className="divide-y divide-border">
                    {section.settings.map((setting, settingIndex) => (
                      <motion.div
                        key={setting.label}
                        className="flex items-center justify-between p-4 hover:bg-secondary transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <span className="font-medium text-sm text-foreground">{setting.label}</span>
                        <motion.button
                          onClick={() => toggleSetting(sectionIndex, settingIndex)}
                          className={`relative w-12 h-7 rounded-full transition-all ${
                            setting.enabled
                              ? 'bg-primary'
                              : 'bg-muted'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            initial={false}
                            animate={{
                              left: setting.enabled ? '24px' : '4px',
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                          />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Additional Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border"
            >
              <motion.button
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Share2 size={20} className="text-primary" />
                  <span className="font-medium text-foreground">Share Profile</span>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                className="w-full flex items-center justify-between p-4 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-primary" />
                  <span className="font-medium text-foreground">Help & Support</span>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors text-destructive"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={20} />
                  <span className="font-medium">Log Out</span>
                </div>
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            <p>Quantum v1.0.0</p>
            <p className="mt-2">© 2026 Quantum. All rights reserved.</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
