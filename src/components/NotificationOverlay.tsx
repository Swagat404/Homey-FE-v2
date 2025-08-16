import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCheck,
  IconCurrencyDollar,
  IconMessageCircle,
  IconTrash,
  IconCooker,
  IconReceipt,
  IconUsers,
  IconCalendar,
  IconBell,
  IconX,
} from "@tabler/icons-react";
import { ModernCard, ModernIconButton } from "./ui";

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onNavigate?: (page: string) => void;
}

interface Notification {
  id: number;
  type: "task" | "expense" | "announcement" | "system";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  actionUrl?: string;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ isOpen, onClose, isDark, onNavigate }) => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "task",
      title: "Task Reminder",
      message: "Don't forget to take out the trash tonight!",
      time: "5 min ago",
      unread: true,
      icon: IconTrash,
      color: "yellow",
      actionUrl: "tasks"
    },
    {
      id: 2,
      type: "expense",
      title: "New Expense Added",
      message: "Sarah added grocery receipt: $89.50",
      time: "1 hour ago",
      unread: true,
      icon: IconReceipt,
      color: "green",
      actionUrl: "expenses"
    },
    {
      id: 3,
      type: "announcement",
      title: "House Meeting",
      message: "Emma posted: House party this Saturday!",
      time: "2 hours ago",
      unread: true,
      icon: IconMessageCircle,
      color: "blue",
      actionUrl: "announcements"
    },
    {
      id: 4,
      type: "task",
      title: "Task Completed",
      message: "Mike completed 'Clean bathroom'",
      time: "3 hours ago",
      unread: false,
      icon: IconCheck,
      color: "green"
    },
    {
      id: 5,
      type: "expense",
      title: "Payment Reminder",
      message: "You owe Sarah $45.25 for utilities",
      time: "1 day ago",
      unread: false,
      icon: IconCurrencyDollar,
      color: "red",
      actionUrl: "expenses"
    },
    {
      id: 6,
      type: "system",
      title: "New Roommate",
      message: "Jordan Davis joined your household",
      time: "2 days ago",
      unread: false,
      icon: IconUsers,
      color: "purple"
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationStyles = (notification: Notification) => {
    const baseStyles = "relative p-4 rounded-xl transition-all duration-200 cursor-pointer";
    
    if (notification.unread) {
      return `${baseStyles} bg-white/[0.12] border border-white/[0.20] hover:bg-white/[0.18] ring-1 ring-blue-400/30`;
    }
    
    return `${baseStyles} bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] opacity-75`;
  };

  const getIconColor = (color: string) => {
    const colors = {
      yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      green: "text-green-500 bg-green-500/10 border-green-500/20",
      blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      red: "text-red-500 bg-red-500/10 border-red-500/20",
      purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log("Marking notification as read:", id);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl && onNavigate) {
      onNavigate(notification.actionUrl);
    }
    onClose();
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Notification Panel */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] z-50"
          >
            <ModernCard variant="glass" className="overflow-hidden max-h-[80vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.12]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <IconBell className="w-6 h-6 text-purple-500" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{unreadCount}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                  </div>
                </div>
                
                <ModernIconButton
                  icon={IconX}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                />
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <IconBell className="w-12 h-12 text-gray-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className={getNotificationStyles(notification)}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${getIconColor(notification.color)}`}>
                            <notification.icon className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-medium text-sm ${notification.unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {notification.time}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${notification.unread ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                              {notification.message}
                            </p>
                          </div>

                          {/* Unread indicator */}
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-white/[0.12]">
                  <button 
                    className="w-full text-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    onClick={() => {
                      console.log("Mark all as read");
                      onClose();
                    }}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </ModernCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationOverlay; 