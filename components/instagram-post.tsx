'use client';

import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Post } from '@/lib/mock-data';
import { useAppContext } from '@/lib/context';

export function InstagramPost({ post }: { post: Post }) {
  const { isLiked, toggleLike, isSaved, toggleSave, comments, addComment } = useAppContext();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const postIsLiked = isLiked(post.id);
  const postIsSaved = isSaved(post.id);
  const likeCount = postIsLiked ? post.likes + 1 : post.likes;
  const postComments = comments[post.id] || [];
  const totalComments = postComments.length || post.comments;

  const handleLike = () => {
    toggleLike(post.id);
  };

  const handleSave = () => {
    toggleSave(post.id);
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText.trim());
      setCommentText('');
      setShowComments(true); // make sure comments are shown when adding a comment
    }
  };

  return (
    <div className="bg-card rounded-lg soft-shadow overflow-hidden border border-border mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{post.author.name}</span>
              {post.author.isVerified && (
                <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.5 1.5H9.5V3h1V1.5zM15.5 10.5V9.5H17v1h-1.5zM3 10.5V9.5h1.5v1H3zM10.5 17v1.5H9.5V17h1z" />
            <path d="M15.5 5.5l1.06-1.06.707.707L16.207 6.2l-.707-.707zM4.5 14.5l-1.06 1.06-.707-.707 1.06-1.06.707.707z" />
          </svg>
        </button>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative bg-muted aspect-square w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.content}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions Bar */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="group"
            >
              <Heart
                className={`h-6 w-6 transition-all ${
                  postIsLiked ? 'fill-red-500 text-red-500' : 'text-foreground hover:text-red-500'
                }`}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-6 w-6 text-foreground hover:text-muted-foreground transition-colors" />
            </motion.button>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Share2 className="h-6 w-6 text-foreground hover:text-muted-foreground transition-colors" />
            </motion.button>
          </div>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave}>
            <Bookmark className={`h-6 w-6 transition-all ${
              postIsSaved ? 'fill-foreground text-foreground' : 'text-foreground hover:text-muted-foreground'
            }`} />
          </motion.button>
        </div>
      </div>

      {/* Likes and Content */}
      <div className="px-4 py-3 space-y-2">
        <div className="font-semibold text-sm">
          {likeCount.toLocaleString()} likes
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold mr-2">{post.author.name}</span>
            <span className="text-foreground/80">{post.content}</span>
          </p>
        </div>

        {totalComments > 0 && (
          <button 
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-muted-foreground hover:text-foreground font-medium block"
          >
            {showComments ? 'Hide comments' : `View all ${totalComments} comments`}
          </button>
        )}

        {/* Dynamic Comments List */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t border-border/40 overflow-hidden"
            >
              {postComments.map((c) => (
                <div key={c.id} className="text-sm flex gap-2 items-start py-1">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={c.author.avatar} 
                      alt={c.author.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p>
                      <span className="font-semibold mr-1">{c.author.name}</span>
                      <span className="text-foreground/80">{c.content}</span>
                    </p>
                    <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                  </div>
                </div>
              ))}
              {postComments.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No comments yet. Be the first to comment!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comment Input */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
          className="flex-1 bg-transparent text-sm outline-none placeholder-muted-foreground text-foreground"
        />
        <button 
          onClick={handlePostComment}
          disabled={!commentText.trim()}
          className="text-primary font-semibold text-sm hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post
        </button>
      </div>
    </div>
  );
}

