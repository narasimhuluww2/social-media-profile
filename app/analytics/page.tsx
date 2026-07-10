'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { useAppContext } from '@/lib/context';
import { currentUser } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Heart, Users, Eye, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsPage() {
  const { user, posts } = useAppContext();
  const profileUser = user || currentUser;

  // Calculate dynamic stats
  const userPosts = posts.filter(p => p.author.username === profileUser.username);
  const totalLikes = userPosts.reduce((acc, curr) => acc + curr.likes, 0);
  const totalComments = userPosts.reduce((acc, curr) => acc + curr.comments, 0);
  const totalEngagements = totalLikes + totalComments;

  const [metricTab, setMetricTab] = useState<'views' | 'reach'>('views');

  // SVG Chart Mock Coordinates (Follower Growth)
  const followerData = [
    { label: 'Jan', value: 8000 },
    { label: 'Feb', value: 9200 },
    { label: 'Mar', value: 9900 },
    { label: 'Apr', value: 10800 },
    { label: 'May', value: 11400 },
    { label: 'Jun', value: 12400 },
  ];

  // SVG Chart Mock Coordinates (Weekly Engagement breakdown)
  const weeklyData = [
    { day: 'Mon', count: 42 },
    { day: 'Tue', count: 68 },
    { day: 'Wed', count: 95 },
    { day: 'Thu', count: 74 },
    { day: 'Fri', count: 120 },
    { day: 'Sat', count: 154 },
    { day: 'Sun', count: 110 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary animate-pulse" />
                <h1 className="text-4xl font-black text-foreground">Analytics</h1>
              </div>
              <p className="text-muted-foreground">Track your content performance and audience growth</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-primary text-xs font-bold shadow-sm">
              <Sparkles size={14} className="animate-spin-slow" />
              Creator Account Active
            </div>
          </motion.div>

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: 'Total Followers',
                value: profileUser.followers.toLocaleString(),
                change: '+14% this month',
                icon: Users,
                color: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-500',
              },
              {
                title: 'Post Reach',
                value: (userPosts.length * 1420 + 12050).toLocaleString(),
                change: '+5.4% week-on-week',
                icon: Eye,
                color: 'from-pink-500/10 to-pink-600/10 border-pink-500/20 text-pink-500',
              },
              {
                title: 'Engagements',
                value: totalEngagements.toLocaleString(),
                change: `${userPosts.length} posts analyzed`,
                icon: Heart,
                color: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-500',
              },
              {
                title: 'Engagement Rate',
                value: userPosts.length > 0 ? `${((totalEngagements / (profileUser.followers || 1)) * 100).toFixed(2)}%` : '5.8%',
                change: 'Avg. social benchmark: 3.2%',
                icon: TrendingUp,
                color: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-500',
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} border flex items-center justify-center`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground mb-1">{stat.value}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Follower Growth (Area) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Followers Over Time</h3>
                  <p className="text-xs text-muted-foreground">Audience growth across the last 6 months</p>
                </div>
                <TrendingUp size={20} className="text-primary" />
              </div>

              {/* Follower SVG Area Chart */}
              <div className="relative w-full h-56 pt-2">
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="currentColor" strokeOpacity="0.05" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="currentColor" strokeOpacity="0.05" />
                  
                  {/* Path */}
                  <path
                    d="M 0 170 C 80 140, 120 130, 200 110 C 280 90, 320 80, 400 50 C 450 30, 480 20, 500 15"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Gradient Fill */}
                  <path
                    d="M 0 170 C 80 140, 120 130, 200 110 C 280 90, 320 80, 400 50 C 450 30, 480 20, 500 15 L 500 200 L 0 200 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Dots at key coordinates */}
                  <circle cx="0" cy="170" r="5" fill="#3b82f6" className="animate-pulse" />
                  <circle cx="200" cy="110" r="5" fill="#3b82f6" />
                  <circle cx="400" cy="50" r="5" fill="#3b82f6" />
                  <circle cx="500" cy="15" r="5.5" fill="#3b82f6" className="animate-pulse" />
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-semibold px-1">
                  {followerData.map(d => <span key={d.label}>{d.label}</span>)}
                </div>
              </div>
            </motion.div>

            {/* Chart 2: Daily Breakdown (Bar Chart) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">Engagement Density</h3>
                <p className="text-xs text-muted-foreground mb-6">Interaction volume per weekday</p>
              </div>

              {/* Bar Chart Representation */}
              <div className="flex items-end justify-between h-44 px-1">
                {weeklyData.map((d, index) => {
                  const percentHeight = (d.count / 160) * 100;
                  return (
                    <div key={d.day} className="flex flex-col items-center flex-1 group">
                      {/* Hover Count Badge */}
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-bold py-1 px-2 rounded-md -translate-y-8 z-15 shadow-md">
                        {d.count}
                      </div>
                      
                      {/* Bar */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${percentHeight}%` }}
                        transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
                        className="w-4 bg-gradient-to-t from-primary to-accent rounded-t-full group-hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      />

                      {/* X Label */}
                      <span className="text-[10px] text-muted-foreground font-semibold mt-2">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Interactive Metric Showcase widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/50 pb-4 mb-6 gap-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Interactive Metrics</h3>
                <p className="text-xs text-muted-foreground">Select a metric below to plot custom trends</p>
              </div>
              <div className="flex bg-secondary p-1 rounded-xl">
                <button
                  onClick={() => setMetricTab('views')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    metricTab === 'views' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Profile Views
                </button>
                <button
                  onClick={() => setMetricTab('reach')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    metricTab === 'reach' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Content Reach
                </button>
              </div>
            </div>

            {/* Simulated interactive plots */}
            <div className="h-44 w-full relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {metricTab === 'views' ? (
                  <motion.svg
                    key="views-svg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                    viewBox="0 0 600 150"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 0 120 C 100 80, 200 140, 300 70 C 400 40, 500 90, 600 20"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="70" r="4.5" fill="#ec4899" />
                    <circle cx="600" cy="20" r="4.5" fill="#ec4899" className="animate-pulse" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="reach-svg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                    viewBox="0 0 600 150"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 0 50 C 100 90, 200 40, 300 80 C 400 110, 500 50, 600 65"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="300" cy="80" r="4.5" fill="#10b981" />
                    <circle cx="600" cy="65" r="4.5" fill="#10b981" className="animate-pulse" />
                  </motion.svg>
                )}
              </AnimatePresence>
              
              <div className="absolute bottom-1 w-full flex justify-between text-[9px] text-muted-foreground font-semibold px-2">
                <span>08:00 AM</span>
                <span>12:00 PM</span>
                <span>04:00 PM</span>
                <span>08:00 PM</span>
                <span>Midnight</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
