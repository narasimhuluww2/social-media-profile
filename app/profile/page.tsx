'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { currentUser } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle, MapPin, Globe, MessageCircle, MoreHorizontal, Heart, X, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/context';

export default function ProfilePage() {
  const { user, posts, isSaved, updateProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const profileUser = user || currentUser;

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    name: profileUser.name,
    username: profileUser.username,
    bio: profileUser.bio,
    location: profileUser.location || 'San Francisco, CA',
    website: profileUser.website || 'www.sarahanders.com',
  });

  // Sync edit form and previews when user details update
  useEffect(() => {
    setEditForm({
      name: profileUser.name,
      username: profileUser.username,
      bio: profileUser.bio,
      location: profileUser.location || 'San Francisco, CA',
      website: profileUser.website || 'www.sarahanders.com',
    });
  }, [user]);

  // Sync previews on modal open
  useEffect(() => {
    if (showEditModal) {
      setAvatarPreview(profileUser.avatar);
      setCoverPreview(profileUser.coverImage || null);
    }
  }, [showEditModal, profileUser]);

  const handleEditProfile = () => {
    updateProfile(
      editForm.name,
      editForm.username,
      editForm.bio,
      editForm.location,
      editForm.website,
      avatarPreview || undefined,
      coverPreview || undefined
    );
    setShowEditModal(false);
  };

  // Filter posts
  const userPosts = posts.filter(p => p.author.username === profileUser.username);
  const bookmarkedPosts = posts.filter(p => isSaved(p.id));

  const mockFollowers = [
    { id: 'f1', name: 'Alex Chen', username: 'alex_chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { id: 'f2', name: 'Emma Tech', username: 'emma_tech', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 'f3', name: 'Mike Design', username: 'mike_design', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: 'f4', name: 'Jessica Art', username: 'jessica_art', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  ];

  const mockFollowing = [
    { id: 'f5', name: 'Creative Mind', username: 'creative_mind', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { id: 'f6', name: 'Design Hub', username: 'design_hub', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: 'f7', name: 'Tech Trends', username: 'tech_trends', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8 shadow-sm"
          >
            <Image
              src={profileUser.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-card bg-card shadow-md -mt-16 z-10"
              >
                <Image
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Info and Actions */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl md:text-4xl font-black text-foreground">
                        {profileUser.name}
                      </h1>
                      {profileUser.isVerified !== false && <CheckCircle size={24} className="text-blue-500 fill-blue-500" />}
                    </div>
                    <p className="text-muted-foreground text-sm">@{profileUser.username}</p>
                  </div>
                </div>

                <p className="text-foreground text-sm mb-4 leading-relaxed">{profileUser.bio}</p>

                <div className="flex flex-wrap gap-3 mb-4 text-xs">
                  {profileUser.location && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin size={14} />
                      {profileUser.location}
                    </div>
                  )}
                  {profileUser.website && (
                    <a href={`https://${profileUser.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline cursor-pointer">
                      <Globe size={14} />
                      {profileUser.website}
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6 mb-6 border-t border-border/40 pt-4">
                  <div className="text-center md:text-left">
                    <p className="font-black text-lg text-foreground">{userPosts.length}</p>
                    <p className="text-muted-foreground text-xs">Posts</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowFollowersModal(true)}
                    className="text-center md:text-left cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <p className="font-black text-lg text-foreground">
                      {profileUser.followers >= 1000 ? `${(profileUser.followers / 1000).toFixed(1)}K` : profileUser.followers}
                    </p>
                    <p className="text-muted-foreground text-xs">Followers</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowFollowingModal(true)}
                    className="text-center md:text-left cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <p className="font-black text-lg text-foreground">{profileUser.following}</p>
                    <p className="text-muted-foreground text-xs">Following</p>
                  </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 md:flex-none bg-primary text-primary-foreground font-semibold py-2.5 px-6 rounded-lg hover:bg-primary/95 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 md:flex-none bg-secondary text-foreground font-semibold py-2.5 px-6 rounded-lg hover:bg-secondary/80 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    Message
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-11 h-11 bg-secondary hover:bg-secondary/80 rounded-lg flex items-center justify-center transition-all text-foreground"
                  >
                    <MoreHorizontal size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-border mb-6"
          >
            <div className="flex gap-8">
              {['posts', 'reels', 'saved'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-semibold text-sm transition-all border-b-2 ${
                    activeTab === tab
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {activeTab === 'posts' && (
              <motion.div
                key="posts-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-border/40"
                  >
                    {post.image ? (
                      <>
                        <Image
                          src={post.image}
                          alt="Post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                          <div className="text-white text-center">
                            <Heart className="inline mb-1 fill-white" size={22} />
                            <p className="text-xs font-bold">{post.likes}</p>
                          </div>
                          <div className="text-white text-center">
                            <MessageCircle className="inline mb-1 fill-white" size={22} />
                            <p className="text-xs font-bold">{post.comments}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-secondary/40 h-full w-full p-4 flex flex-col justify-between group-hover:bg-secondary/60 transition-colors">
                        <p className="text-sm font-medium text-foreground line-clamp-4">{post.content}</p>
                        <div className="flex gap-4 text-muted-foreground text-xs">
                          <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                          <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {userPosts.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-card border border-border/60 rounded-2xl">
                    <p className="text-muted-foreground text-sm font-medium">No posts published yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reels' && (
              <motion.div
                key="reels-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border/60">
                  <p className="text-muted-foreground text-sm font-medium">No reels uploaded yet</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'saved' && (
              <motion.div
                key="saved-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {bookmarkedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-border/40"
                  >
                    {post.image ? (
                      <>
                        <Image
                          src={post.image}
                          alt="Post"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                          <div className="text-white text-center">
                            <Heart className="inline mb-1 fill-white" size={22} />
                            <p className="text-xs font-bold">{post.likes}</p>
                          </div>
                          <div className="text-white text-center">
                            <MessageCircle className="inline mb-1 fill-white" size={22} />
                            <p className="text-xs font-bold">{post.comments}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-secondary/40 h-full w-full p-4 flex flex-col justify-between group-hover:bg-secondary/60 transition-colors">
                        <p className="text-sm font-medium text-foreground line-clamp-4">{post.content}</p>
                        <div className="flex gap-4 text-muted-foreground text-xs">
                          <span className="flex items-center gap-1"><Heart size={14} /> {post.likes}</span>
                          <span className="flex items-center gap-1"><MessageCircle size={14} /> {post.comments}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {bookmarkedPosts.length === 0 && (
                  <div className="col-span-full text-center py-16 bg-card border border-border/60 rounded-2xl">
                    <p className="text-muted-foreground text-sm font-medium">No bookmarked posts found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full space-y-4 border border-border shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <h2 className="text-2xl font-black text-foreground">Edit Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Avatar Preview & Upload */}
              <div className="flex flex-col items-center gap-2 py-2 border-b border-border/40">
                <div 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 cursor-pointer group shadow-sm bg-secondary"
                  title="Click to change profile photo"
                >
                  <Image
                    src={avatarPreview || profileUser.avatar}
                    alt="Avatar Preview"
                    fill
                    className="object-cover group-hover:opacity-75 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    Change Photo
                  </div>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <button 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  type="button"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Change Profile Picture
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                {/* Cover Image Upload */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Cover Image</label>
                  <div 
                    onClick={() => document.getElementById('cover-upload')?.click()}
                    className="relative w-full h-24 rounded-xl overflow-hidden border border-border bg-secondary cursor-pointer group shadow-sm"
                    title="Click to change cover photo"
                  >
                    <Image
                      src={coverPreview || profileUser.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'}
                      alt="Cover Preview"
                      fill
                      className="object-cover group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                      Change Cover Photo
                    </div>
                  </div>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCoverPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Display Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-secondary border border-border/80 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full bg-secondary border border-border/80 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    maxLength={150}
                    rows={3}
                    className="w-full bg-secondary border border-border/80 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm focus:border-transparent"
                  />
                  <p className="text-[10px] text-muted-foreground text-right mt-1">{editForm.bio.length}/150</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-secondary border border-border/80 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Website</label>
                  <input
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full bg-secondary border border-border/80 rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-border/50">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-secondary text-foreground font-semibold py-2.5 rounded-lg hover:bg-secondary/80 transition-all text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEditProfile}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-semibold py-2.5 rounded-lg hover:opacity-95 transition-all text-sm shadow-sm"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Followers Modal */}
      <AnimatePresence>
        {showFollowersModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowFollowersModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-border shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <h2 className="text-xl font-black text-foreground">Followers</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFollowersModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={22} />
                </motion.button>
              </div>

              <div className="space-y-2">
                {mockFollowers.map((follower) => (
                  <motion.div
                    key={follower.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2.5 hover:bg-secondary/40 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={follower.avatar}
                          alt={follower.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground truncate">{follower.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{follower.username}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-primary text-xs font-semibold hover:opacity-80 transition-opacity ml-2"
                    >
                      Remove
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Following Modal */}
      <AnimatePresence>
        {showFollowingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowFollowingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-border shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
                <h2 className="text-xl font-black text-foreground">Following</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowFollowingModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={22} />
                </motion.button>
              </div>

              <div className="space-y-2">
                {mockFollowing.map((following) => (
                  <motion.div
                    key={following.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2.5 hover:bg-secondary/40 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={following.avatar}
                          alt={following.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-foreground truncate">{following.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{following.username}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-primary text-xs font-semibold hover:opacity-80 transition-opacity ml-2"
                    >
                      Unfollow
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
