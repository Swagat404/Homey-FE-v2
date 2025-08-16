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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/10 dark:bg-black/20 backdrop-blur-2xl border-t border-white/20 dark:border-white/10 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center px-4 py-2">
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
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 refined-text-pulse-glow"
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10 refined-text-subtle-glow"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className={`w-6 h-6 ${isActive ? "stroke-2" : "stroke-1.5"}`} />
              <span className={`text-xs mt-1 font-medium ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 w-1 h-1 bg-purple-500 rounded-full"
                  layoutId="activeIndicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation; 