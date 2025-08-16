import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconPlus,
  IconSend,
  IconPaperclip,
  IconHeart,
  IconMessageCircle,
  IconPin,
  IconSearch,
  IconDots,
  IconBell,
  IconBellOff,
  IconPhoto,
  IconCalendar,
} from "@tabler/icons-react";
import { ModernCard, ModernIconButton } from "./ui";

interface AnnouncementsPageProps {
  onBack: () => void;
  isDark: boolean;
}

interface Message {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  type: "message" | "announcement" | "event";
  pinned?: boolean;
  reactions?: { emoji: string; users: string[] }[];
  attachments?: { type: string; url: string; name: string }[];
  unread?: boolean; // Add unread status
}

const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({ onBack, isDark }) => {
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageTitle, setPageTitle] = useState("House Announcements");
  const [pageSubtitle, setPageSubtitle] = useState("Share important updates with your roommates");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  // Check for personalized filters from dashboard
  React.useEffect(() => {
    const pageFilter = sessionStorage.getItem('pageFilter');
    if (pageFilter === 'unread') {
      setPageTitle("Unread Messages");
      setPageSubtitle("Messages you haven't seen yet");
      setShowOnlyUnread(true);
      sessionStorage.removeItem('pageFilter');
    }
  }, []);

  const roommates = [
    { name: "Alex Johnson", avatar: "AJ", color: "purple", online: true },
    { name: "Sarah Chen", avatar: "SC", color: "blue", online: true },
    { name: "Mike Rodriguez", avatar: "MR", color: "green", online: false },
    { name: "Emma Davis", avatar: "ED", color: "pink", online: true },
  ];

  const messages: Message[] = [
    {
      id: 1,
      author: "Emma Davis",
      content: "🎉 House party this Saturday! Inviting some friends over. Pizza and drinks on me!",
      timestamp: "2024-12-15T18:30:00Z",
      type: "announcement",
      pinned: true,
      unread: true, // Mark as unread
      reactions: [
        { emoji: "🎉", users: ["Alex Johnson", "Sarah Chen"] },
        { emoji: "👍", users: ["Mike Rodriguez"] }
      ]
    },
    {
      id: 2,
      author: "Sarah Chen",
      content: "Reminder: Cleaning schedule for this week is posted on the fridge. Let's keep our place tidy! 🧹",
      timestamp: "2024-12-15T15:20:00Z",
      type: "announcement",
      unread: false,
      reactions: [
        { emoji: "✅", users: ["Alex Johnson", "Emma Davis", "Mike Rodriguez"] }
      ]
    },
    {
      id: 3,
      author: "Alex Johnson", 
      content: "Does anyone know where the spare key is? I might be home late tonight.",
      timestamp: "2024-12-15T14:45:00Z",
      type: "message",
      unread: false
    },
    {
      id: 4,
      author: "Mike Rodriguez",
      content: "It's in the plant pot by the door! Safe travels 🔑",
      timestamp: "2024-12-15T14:47:00Z",
      type: "message",
      unread: true, // Mark as unread
      reactions: [
        { emoji: "👍", users: ["Alex Johnson"] }
      ]
    },
    {
      id: 5,
      author: "Sarah Chen",
      content: "Monthly house meeting - Sunday 7PM in the living room. Agenda: December expenses, cleaning rotation, and holiday plans.",
      timestamp: "2024-12-15T12:00:00Z",
      type: "event",
      pinned: true,
      unread: false,
      reactions: [
        { emoji: "📅", users: ["Alex Johnson", "Emma Davis", "Mike Rodriguez"] }
      ]
    },
    {
      id: 6,
      author: "Emma Davis",
      content: "New coffee machine arrived! ☕ Instructions are on the counter. Let's keep it clean please!",
      timestamp: "2024-12-15T10:30:00Z",
      type: "announcement",
      unread: false,
      reactions: [
        { emoji: "☕", users: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez"] },
        { emoji: "❤️", users: ["Alex Johnson"] }
      ]
    }
  ];

  const getMessageTypeStyle = (type: string) => {
    switch (type) {
      case "announcement":
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "event":
        return "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20";
      default:
        return "border-l-4 border-l-gray-300 dark:border-l-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <IconBell className="w-4 h-4 text-blue-500" />;
      case "event":
        return <IconCalendar className="w-4 h-4 text-purple-500" />;
      default:
        return <IconMessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = !showOnlyUnread || message.unread;
    return matchesSearch && matchesUnread;
  });

  const pinnedMessages = filteredMessages.filter(m => m.pinned);
  const regularMessages = filteredMessages.filter(m => !m.pinned);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 pb-20 refined-plasma-border refined-aurora-glow holographic" style={{ 
      backgroundColor: "var(--homey-bg)",
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 75% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 50% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.08] border-b border-white/[0.12] refined-flowing-border refined-aurora-glow">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ModernIconButton
                icon={IconArrowLeft}
                onClick={onBack}
                variant="ghost"
                tooltip="Back to dashboard"
              />
              <div>
                <h1 className="refined-heading-1 text-gradient streaming-light-text">{pageTitle}</h1>
                <p className="refined-subheading pulsing-glow-text">
                  {pageSubtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ModernIconButton icon={IconSearch} variant="ghost" size="sm" />
              <ModernIconButton 
                icon={IconPlus} 
                variant="primary" 
                size="sm" 
                tooltip="Post announcement"
                className="refined-breathing-glow refined-particle-trail"
                onClick={() => {/* Add announcement logic */}}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Pinned Messages */}
          {pinnedMessages.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <IconPin className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pinned</h3>
              </div>
              
              <div className="space-y-3">
                {pinnedMessages.map((message) => (
                  <motion.div
                    key={`pinned-${message.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ModernCard variant="glass" className={`p-4 ${getMessageTypeStyle(message.type)} ${message.unread ? 'ring-2 ring-blue-400 ring-opacity-50' : ''} refined-light-worm refined-border-light`}>
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {message.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          {message.unread && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`font-semibold ${message.unread ? 'text-blue-600 dark:text-blue-400 refined-text-pulse-glow' : 'text-gray-900 dark:text-white refined-text-subtle-glow'}`}>
                              {message.author}
                            </span>
                            {getTypeIcon(message.type)}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                            <IconPin className="w-4 h-4 text-purple-500 ml-auto" />
                            {message.unread && (
                              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                            )}
                          </div>
                          
                          <p className={`mb-3 ${message.unread ? 'text-gray-900 dark:text-white font-medium refined-text-shimmer-stream' : 'text-gray-700 dark:text-gray-300'}`}>
                            {message.content}
                          </p>
                          
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {message.reactions.map((reaction, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                                >
                                  <span>{reaction.emoji}</span>
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    {reaction.users.length}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </ModernCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Messages */}
          <div>
            {pinnedMessages.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <IconMessageCircle className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Messages</h3>
              </div>
            )}
            
            <div className="space-y-4">
              {regularMessages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`p-4 rounded-xl transition-all duration-200 ${getMessageTypeStyle(message.type)} ${
                    message.type === "message" ? "hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""
                  } ${message.unread ? 'ring-2 ring-blue-400 ring-opacity-50' : ''} refined-plasma-border refined-breathing-light`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                        {message.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      {roommates.find(r => r.name === message.author)?.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {message.unread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-semibold ${message.unread ? 'text-blue-600 dark:text-blue-400 refined-text-pulse-glow' : 'text-gray-900 dark:text-white refined-text-subtle-glow'}`}>
                          {message.author}
                        </span>
                        {getTypeIcon(message.type)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.unread && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-auto">New</span>
                        )}
                      </div>
                      
                      <p className={`mb-3 ${message.unread ? 'text-gray-900 dark:text-white font-medium refined-text-shimmer-stream' : 'text-gray-700 dark:text-gray-300'}`}>
                        {message.content}
                      </p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {message.reactions.map((reaction, index) => (
                            <button
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {reaction.users.length}
                              </span>
                            </button>
                          ))}
                          <button className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors text-gray-500 text-sm">
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <ModernIconButton icon={IconHeart} variant="ghost" size="sm" />
                      <ModernIconButton icon={IconDots} variant="ghost" size="sm" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <IconMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                No messages found
              </h4>
              <p className="text-gray-400">
                {searchTerm ? "Try adjusting your search" : "Start a conversation with your roommates!"}
              </p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="sticky bottom-0 backdrop-blur-xl bg-white/[0.08] border-t border-white/[0.12] p-4 refined-flowing-border refined-shimmer-accent">
          <div className="flex items-end gap-3">
            <ModernIconButton icon={IconPaperclip} variant="ghost" size="sm" />
            <ModernIconButton icon={IconPhoto} variant="ghost" size="sm" />
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (newMessage.trim()) {
                      // Handle send message
                      console.log('Sending message:', newMessage);
                      setNewMessage('');
                    }
                  }
                }}
              />
            </div>
            
            <ModernIconButton 
              icon={IconSend} 
              variant={newMessage.trim() ? "primary" : "ghost"} 
              size="sm" 
              disabled={!newMessage.trim()}
              onClick={() => {
                if (newMessage.trim()) {
                  console.log('Sending message:', newMessage);
                  setNewMessage('');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage; 