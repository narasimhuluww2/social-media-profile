'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { QuantumSidebar } from '@/components/quantum-sidebar';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, MapPin, Smile, Send } from 'lucide-react';
import Image from 'next/image';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isAuthenticated, createPost } = useAppContext();
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postLocation, setPostLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handlePostCreation = async () => {
    if (!caption.trim()) {
      alert('Please add a caption');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      createPost(caption, imagePreview, postLocation);
      setIsLoading(false);
      setCaption('');
      setImagePreview(null);
      setPostLocation('');
      router.push('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Create Post</h1>
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-secondary rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Card */}
            <div className="bg-card rounded-2xl soft-shadow overflow-hidden">
              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Image Preview Area */}
                <div className="md:col-span-2 bg-secondary/30 aspect-square md:aspect-auto flex items-center justify-center relative overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover w-full h-full"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveImage}
                        className="absolute top-4 right-4 bg-foreground/80 backdrop-blur-md p-2 rounded-full text-background opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                      <span className="text-muted-foreground font-medium">Select photo</span>
                      <span className="text-xs text-muted-foreground mt-1">or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Form Area */}
                <div className="md:col-span-1 p-6 space-y-6 flex flex-col">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    </div>
                  </div>

                  {/* Caption Input */}
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Caption</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a caption..."
                      maxLength={2200}
                      className="w-full h-32 p-3 bg-secondary rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      {caption.length} / 2200
                    </p>
                  </div>

                  {/* Location Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location (optional)
                    </label>
                    <input
                      type="text"
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      placeholder="Add location"
                      className="w-full px-3 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.back()}
                      className="flex-1 px-4 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePostCreation}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Post
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                {
                  icon: ImageIcon,
                  title: 'Add a Photo',
                  description: 'Engage your audience with stunning visuals',
                },
                {
                  icon: MapPin,
                  title: 'Tag Location',
                  description: 'Help followers discover your whereabouts',
                },
                {
                  icon: Smile,
                  title: 'Add Emoji',
                  description: 'Express yourself with emojis and hashtags',
                },
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-card rounded-xl soft-shadow p-4 text-center"
                >
                  <tip.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
