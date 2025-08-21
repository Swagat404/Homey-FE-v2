import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { 
  IconCheck, 
  IconChevronDown, 
  IconEdit, 
  IconTrash, 
  IconClock,
  IconFlag,
  IconUser,
  IconCalendar
} from '@tabler/icons-react';

interface SwipeAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: 'red' | 'blue' | 'green' | 'purple';
  action: () => void;
}

interface MobilePillCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  assignee?: string;
  dueDate?: string;
  amount?: number;
  isExpanded?: boolean;
  enableSwipe?: boolean;
  swipeActions?: SwipeAction[];
  onToggleComplete?: () => void;
  onToggleExpand?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const MobilePillCard: React.FC<MobilePillCardProps> = ({
  id,
  title,
  subtitle,
  description,
  completed = false,
  priority,
  category,
  assignee,
  dueDate,
  amount,
  isExpanded = false,
  enableSwipe = false,
  swipeActions = [],
  onToggleComplete,
  onToggleExpand,
  children,
  className = ''
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!enableSwipe || swipeActions.length === 0) return;
      
      const offset = Math.max(-120, Math.min(0, eventData.deltaX));
      setSwipeOffset(offset);
      setIsRevealed(offset < -30);
    },
    onSwipedLeft: () => {
      if (!enableSwipe || swipeActions.length === 0) return;
      setIsRevealed(true);
      setSwipeOffset(-120);
    },
    onSwipedRight: () => {
      setIsRevealed(false);
      setSwipeOffset(0);
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10';
      default: return 'border-l-gray-300 bg-white/50 dark:bg-gray-800/50';
    }
  };

  const getActionColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'green': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'purple': return 'bg-purple-500 hover:bg-purple-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Actions Background */}
      {enableSwipe && swipeActions.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center z-10">
          <div className="flex h-full">
            {swipeActions.map((action, index) => (
              <motion.button
                key={action.id}
                className={`h-full px-4 flex items-center justify-center ${getActionColor(action.color)} 
                  transition-all duration-200 active:scale-95`}
                style={{ width: `${120 / swipeActions.length}px` }}
                onClick={() => {
                  action.action();
                  setIsRevealed(false);
                  setSwipeOffset(0);
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: isRevealed ? 1 : 0,
                  x: isRevealed ? 0 : 20
                }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col items-center gap-1">
                  {action.icon}
                  <span className="text-xs font-medium">{action.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Main Card */}
      <motion.div
        {...(enableSwipe ? swipeHandlers : {})}
        className={`relative z-20 ${className}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className={`
            rounded-3xl border-l-4 backdrop-blur-xl transition-all duration-300
            ${completed 
              ? 'bg-green-50/80 dark:bg-green-900/20 border-l-green-500 shadow-green-100/20 dark:shadow-green-900/20' 
              : priority 
                ? getPriorityColor(priority)
                : 'bg-white/80 dark:bg-gray-800/80 border-l-purple-500'
            }
            border border-white/20 dark:border-gray-700/50
            shadow-lg hover:shadow-xl
            ${isExpanded ? 'shadow-xl' : 'shadow-md'}
            active:scale-[0.98] transition-transform
          `}
        >
          {/* Main Content */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              {/* Left Content */}
              <div className="flex items-start gap-3 flex-1">
                {/* Completion Toggle */}
                {onToggleComplete && (
                  <button
                    onClick={onToggleComplete}
                    className={`
                      mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                      ${completed
                        ? 'bg-green-500 border-green-500 text-white scale-105'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }
                    `}
                  >
                    {completed && <IconCheck className="w-4 h-4" />}
                  </button>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-lg leading-tight
                    ${completed 
                      ? 'line-through text-gray-500 dark:text-gray-400' 
                      : 'text-gray-900 dark:text-white'
                    }
                  `}>
                    {title}
                  </h3>
                  
                  {subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {subtitle}
                    </p>
                  )}

                  {/* Quick Info Tags */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {assignee && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <IconUser className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                          {assignee}
                        </span>
                      </div>
                    )}
                    
                    {dueDate && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <IconCalendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                          {new Date(dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {category && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          {category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="flex items-center gap-2 ml-3">
                {/* Amount Display */}
                {amount !== undefined && (
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      ${amount.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                {(description || children || onToggleExpand) && (
                  <button
                    onClick={onToggleExpand}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                    {description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                        {description}
                      </p>
                    )}
                    {children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobilePillCard;
