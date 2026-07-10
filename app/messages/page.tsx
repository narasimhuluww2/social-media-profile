'use client';

import { QuantumSidebar } from '@/components/quantum-sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/lib/context';

export default function MessagesPage() {
  const {
    user,
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    sendMessage
  } = useAppContext();

  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const handleSend = () => {
    if (selectedConversation && messageText.trim()) {
      sendMessage(selectedConversation, messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const activeChat = conversations.find((c) => c.id === selectedConversation);
  const activeMessages = selectedConversation ? messages[selectedConversation] || [] : [];
  const partner = activeChat?.participants[0];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <QuantumSidebar />

      <main className="md:ml-64 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto h-[calc(100vh-56px)] md:h-screen flex flex-col md:flex-row relative">
          
          {/* Conversations List */}
          <div className={`w-full md:w-85 border-r border-border flex flex-col bg-card h-full ${
            selectedConversation ? 'hidden md:flex' : 'flex'
          }`}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 border-b border-border"
            >
              <h1 className="text-2xl font-black mb-4">Messages</h1>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-secondary text-foreground rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent"
              />
            </motion.div>

            {/* Conversations */}
            <motion.div
              className="flex-1 overflow-y-auto space-y-1 p-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {conversations.map((conv, index) => {
                const chatPartner = conv.participants[0];
                const isSelected = selectedConversation === conv.id;
                return (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all hover:bg-secondary flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary/15 text-primary border border-primary/20'
                        : 'border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                        <Image
                          src={chatPartner.avatar}
                          alt={chatPartner.name}
                          fill
                          className="object-cover"
                        />
                        {conv.unread && (
                          <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${conv.unread ? 'text-primary font-bold' : 'text-foreground'}`}>
                          {chatPartner.name}
                        </p>
                        <p className={`text-xs truncate ${conv.unread ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2 flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {conv.lastMessageTime}
                      </span>
                      {conv.unread && (
                        <span className="w-2.5 h-2.5 bg-primary rounded-full" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
              {conversations.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-8">No conversations found</p>
              )}
            </motion.div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-background h-full ${
            selectedConversation ? 'flex' : 'hidden md:flex'
          }`}>
            {selectedConversation && partner ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                {/* Chat Header */}
                <div className="border-b border-border p-4 bg-card flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)} 
                    className="md:hidden p-1.5 hover:bg-secondary rounded-full text-foreground transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                    <Image
                      src={partner.avatar}
                      alt={partner.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">
                      {partner.name}
                    </p>
                    <p className="text-[10px] text-primary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                      Active now
                    </p>
                  </div>
                </div>

                {/* Messages View */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10"
                >
                  <AnimatePresence initial={false}>
                    {activeMessages.map((msg) => {
                      const isMe = msg.senderId === 'user1' || msg.senderId === user?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                            isMe 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : 'bg-card text-foreground rounded-bl-none border border-border/60'
                          }`}>
                            <p className="leading-relaxed">{msg.content}</p>
                            <span className={`block text-[9px] text-right mt-1 opacity-70 ${
                              isMe ? 'text-primary-foreground' : 'text-muted-foreground'
                            }`}>
                              {msg.timestamp}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-border p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-secondary text-foreground rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent text-foreground"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-all flex-shrink-0"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center bg-background p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <MessageCircle size={44} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-1">Your Messages</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Select a contact from the list or start a new conversation to chat in real time.
                </p>
              </motion.div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
