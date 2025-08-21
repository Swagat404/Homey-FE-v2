import React from "react";
import { motion } from "framer-motion";
import hapticFeedback from "../utils/haptics";
import {
  IconHome,
  IconCheck,
  IconCurrencyDollar,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onNavigate, isDark }) => {
  const navItems = [
    { id: "dashboard", icon: IconHome, label: "Home" },
    { id: "tasks", icon: IconCheck, label: "Tasks" },
    { id: "expenses", icon: IconCurrencyDollar, label: "Money" },
    { id: "announcements", icon: IconMessageCircle, label: "Chat" },
    { id: "settings", icon: IconSettings, label: "Settings" },
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/80 backdrop-blur-3xl border-t border-white/30 dark:border-white/10 shadow-lg shadow-purple-500/10"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(139,92,246,0.1) 100%)'
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="flex justify-around items-center px-2 py-3 relative">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              onClick={() => {
                hapticFeedback.navigate();
                onNavigate(item.id);
              }}
              className={`
                flex flex-col items-center p-3 rounded-2xl transition-all duration-300 min-w-[68px] relative overflow-hidden
                ${isActive
                  ? "bg-gradient-to-b from-purple-500/20 to-purple-600/10 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/20 border border-purple-200/50 dark:border-purple-700/50"
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 active:bg-purple-500/20"
                }
              `}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.08,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
            >
              {/* Ripple effect background */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-purple-400/20 to-purple-600/20 rounded-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    rotateY: isActive ? 360 : 0
                  }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 400, damping: 25 },
                    rotateY: { duration: 0.6, ease: "easeOut" }
                  }}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                </motion.div>
                
                <motion.span 
                  className={`text-xs mt-1.5 font-medium ${isActive ? "font-bold" : ""}`}
                  animate={{ 
                    y: isActive ? -1 : 0,
                    color: isActive ? "#8B5CF6" : undefined
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {item.label}
                </motion.span>
              </div>
              
              {/* Enhanced active indicator */}
              {isActive && (
                <>
                  <motion.div
                    className="absolute -top-0.5 left-1/2 w-8 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ scale: 0, x: "-50%" }}
                    animate={{ scale: 1, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation; 