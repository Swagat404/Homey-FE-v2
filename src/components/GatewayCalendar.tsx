import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconUser,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconDots,
  IconArrowRight,
  IconEdit,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import CelebrationSystem from './ui/CelebrationSystem';

interface Task {
  id: number;
  title: string;
  assignee: string;
  time: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

interface CalendarTasks {
  [key: string]: Task[];
}

interface GatewayCalendarProps {
  tasks: CalendarTasks;
  onTaskClick?: (task: Task) => void;
  onTaskComplete?: (taskId: number) => void;
  onTaskEdit?: (task: Task) => void;
  onNavigateToTasks?: () => void;
  onNavigateToExpenses?: () => void;
  className?: string;
}

const GatewayCalendar: React.FC<GatewayCalendarProps> = ({ 
  tasks, 
  onTaskClick, 
  onTaskComplete,
  onTaskEdit,
  onNavigateToTasks,
  onNavigateToExpenses,
  className = "" 
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<Task | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [celebrateTask, setCelebrateTask] = useState<{trigger: boolean, taskTitle?: string}>({trigger: false});

  const today = new Date();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const handleMarkComplete = (task: Task) => {
    if (onTaskComplete) {
      onTaskComplete(task.id);
      toast.success(`"${task.title}" marked as complete!`);
      setExpandedTask(null);
      
      // Trigger celebration
      setCelebrateTask({
        trigger: true,
        taskTitle: task.title
      });
      
      // Reset celebration state after animation
      setTimeout(() => {
        setCelebrateTask({trigger: false});
      }, 100);
    }
  };

  const handleEditTask = (task: Task) => {
    if (onTaskEdit) {
      onTaskEdit(task);
      setExpandedTask(null);
    }
  };

  const handleViewAllTasks = (dateStr?: string) => {
    if (onNavigateToTasks) {
      // Set a filter for the specific date if provided
      if (dateStr) {
        sessionStorage.setItem('taskDateFilter', dateStr);
      }
      onNavigateToTasks();
    }
  };

  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="w-12 h-12"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks[dateStr] || [];
    const isToday = day === today.getDate() && 
                   currentMonth.getMonth() === today.getMonth() && 
                   currentMonth.getFullYear() === today.getFullYear();
    const isHovered = hoveredDate === dateStr;
    const isSelected = selectedDate === dateStr;

    days.push(
      <motion.div
        key={`day-${day}`}
        className={`relative w-12 h-12 flex items-center justify-center text-sm font-bold cursor-pointer rounded-xl group overflow-visible ${
          isToday ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl border border-purple-400' : 
          isSelected ? 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-600' :
          dayTasks.length > 0 ? 'text-gray-700 dark:text-gray-300 bg-white/10 border border-white/20 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:border-purple-300/50' :
          'text-gray-500 dark:text-gray-500 bg-white/5 border border-white/10 hover:bg-white/10'
        }`}
        onMouseEnter={() => dayTasks.length > 0 && setHoveredDate(dateStr)}
        onMouseLeave={() => setHoveredDate(null)}
        onClick={() => {
          if (dayTasks.length > 0) {
            setSelectedDate(isSelected ? null : dateStr);
          }
        }}
        whileHover={dayTasks.length > 0 ? { 
          scale: 1.08, 
          z: 10,
          rotateY: 5,
        } : { scale: 1.02 }}
        whileTap={dayTasks.length > 0 ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, rotateY: -90, boxShadow: "0 0px 0px rgba(139, 92, 246, 0)" }}
        animate={{ opacity: 1, rotateY: 0, boxShadow: "0 2px 8px rgba(139, 92, 246, 0.1)" }}
        transition={{ 
          delay: (day - 1) * 0.02,
          duration: 0.4,
          type: "spring",
          stiffness: 200
        }}
        style={{
          transformStyle: 'preserve-3d',
          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          boxShadow: isHovered ? '0 8px 25px rgba(139, 92, 246, 0.3)' : undefined
        }}
      >
        <span className="relative z-10">{day}</span>
        
        {/* Enhanced Task indicator dots */}
        {dayTasks.length > 0 && (
          <motion.div 
            className="absolute bottom-1 left-0 right-0 flex gap-0.5 justify-center px-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (day - 1) * 0.02 + 0.2, type: "spring" }}
          >
            {dayTasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={`indicator-${task.id}`}
                className={`w-2 h-2 rounded-full shadow-lg ${
                  task.completed ? 'bg-green-400 shadow-green-400/50' :
                  task.priority === 'high' ? 'bg-red-500 shadow-red-500/50' :
                  task.priority === 'medium' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-blue-500 shadow-blue-500/50'
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2 + index * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
            {dayTasks.length > 3 && (
              <motion.div 
                className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg shadow-purple-400/50"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )}
          </motion.div>
        )}

        {/* Shimmer effect for today */}
        {isToday && (
          <motion.div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['-200% -200%', '200% 200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* 3D Hover Portal */}
        <AnimatePresence>
          {isHovered && dayTasks.length > 0 && (
            <motion.div
              className="absolute top-14 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-auto"
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: -10, 
                rotateX: -15,
                transformOrigin: 'top center'
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0, 
                rotateX: 0,
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                y: -10, 
                rotateX: -15,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.3
              }}
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateX(-50%)',
              }}
            >
              {/* Gateway Portal Card */}
              <div className="w-80 max-w-[90vw] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-purple-300/70 dark:border-purple-500/60 rounded-2xl shadow-2xl p-4 max-h-96 overflow-hidden" style={{
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Portal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white drop-shadow-sm flex items-center gap-2">
                    <IconCalendar className="w-4 h-4 text-purple-500" />
                    {monthNames[currentMonth.getMonth()]} {day}
                  </h4>
                  <span className="text-xs text-purple-700 dark:text-purple-300 bg-purple-500/30 border border-purple-400/30 px-2 py-1 rounded-full font-medium">
                    {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Tasks Portal List */}
                <div className="space-y-3 max-h-64 overflow-y-auto scroll-smooth">
                  {dayTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        task.completed 
                          ? 'bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50' 
                          : 'bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 border border-white/30 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTask(task);
                        onTaskClick?.(task);
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        rotateY: 2,
                        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)"
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Priority/Status indicator */}
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          task.completed ? 'bg-green-500 shadow-lg shadow-green-500/50' :
                          task.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                          task.priority === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
                          'bg-blue-500 shadow-lg shadow-blue-500/50'
                        }`} />
                        
                        <div className="flex-1 min-w-0">
                          <h5 className={`font-bold text-sm truncate transition-colors drop-shadow-sm ${
                            task.completed 
                              ? 'text-green-800 dark:text-green-200 line-through' 
                              : 'text-gray-900 dark:text-white group-hover:text-purple-800 dark:group-hover:text-purple-200'
                          }`}>
                            {task.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-800 dark:text-gray-200 font-medium">
                            <IconClock className="w-3 h-3 text-purple-500" />
                            <span className="font-medium">{task.time}</span>
                            <span>•</span>
                            <IconUser className="w-3 h-3 text-purple-500" />
                            <span className="font-medium">{task.assignee}</span>
                          </div>
                          <div className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.category === 'cleaning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' :
                            task.category === 'shopping' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                            task.category === 'bills' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' :
                            task.category === 'cooking' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300' :
                            task.category === 'meeting' ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300'
                          }`}>
                            {task.category}
                          </div>
                        </div>

                        {/* Expand arrow */}
                        <motion.div 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ x: 3 }}
                        >
                          <IconArrowRight className="w-4 h-4 text-purple-500" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Portal footer */}
                <div className="mt-4 pt-3 border-t border-white/20 dark:border-white/10">
                  <button 
                    className="w-full text-center text-sm text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition-colors flex items-center justify-center gap-2 font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAllTasks(dateStr);
                      setHoveredDate(null);
                    }}
                  >
                    <span>View all tasks</span>
                    <IconArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className={`gateway-calendar relative ${className}`}>
      {/* Background Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      
      {/* Celebration System */}
      <CelebrationSystem
        trigger={celebrateTask.trigger}
        type="task"
        intensity="medium"
        message={celebrateTask.taskTitle ? `"${celebrateTask.taskTitle}" completed! 🎉` : undefined}
        onComplete={() => setCelebrateTask({trigger: false})}
      />
      
      {/* Enhanced Calendar Container */}
      <motion.div 
        className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-visible border-light-crawl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Floating Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 10)}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <motion.h3 
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            layoutId="calendar-title"
            whileHover={{ scale: 1.05 }}
          >
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </motion.h3>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-300/50 transition-all duration-300 group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <IconChevronLeft className="w-4 h-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
          </motion.button>
          
          <motion.button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-300/50 transition-all duration-300 group"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <IconChevronRight className="w-4 h-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
          </motion.button>
          
          <motion.div
            className="ml-3 p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-300/30"
            animate={{
              boxShadow: [
                "0 0 10px rgba(139, 92, 246, 0.3)",
                "0 0 20px rgba(139, 92, 246, 0.2)",
                "0 0 10px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconCalendar className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
      </div>

        {/* Days header */}
        <div className="grid grid-cols-7 gap-2 mb-4 relative z-10">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <motion.div 
              key={`day-header-${index}`} 
              className="h-8 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400 bg-white/10 rounded-lg border border-white/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Calendar Grid */}
        <motion.div 
          className="grid grid-cols-7 gap-2 relative z-10 overflow-visible"
          style={{ perspective: '1000px', minHeight: '320px' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        >
          {days}
        </motion.div>
      </motion.div>

      {/* Expanded Task Modal */}
      <AnimatePresence>
        {expandedTask && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedTask(null)}
          >
            <motion.div
              className="w-full max-w-md bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl p-6"
              initial={{ scale: 0.9, rotateY: -15, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.9, rotateY: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white drop-shadow-sm">
                  Task Details
                </h3>
                <button
                  onClick={() => setExpandedTask(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <IconX className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Task Content */}
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold text-lg mb-2 drop-shadow-sm ${
                    expandedTask.completed ? 'text-green-200 line-through' : 'text-white'
                  }`}>
                    {expandedTask.title}
                  </h4>
                  {expandedTask.description && (
                    <p className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed">
                      {expandedTask.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-200 dark:text-gray-300">
                      <IconClock className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">{expandedTask.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200 dark:text-gray-300">
                      <IconUser className="w-4 h-4 text-purple-400" />
                      <span className="font-medium">{expandedTask.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      expandedTask.priority === 'high' ? 'bg-red-500/20 text-red-200 border border-red-400/30' :
                      expandedTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30' :
                      'bg-green-500/20 text-green-200 border border-green-400/30'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        expandedTask.priority === 'high' ? 'bg-red-400' :
                        expandedTask.priority === 'medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      {expandedTask.priority.toUpperCase()} PRIORITY
                    </div>
                    <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium border ${
                      expandedTask.category === 'cleaning' ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' :
                      expandedTask.category === 'shopping' ? 'bg-green-500/20 text-green-200 border-green-400/30' :
                      expandedTask.category === 'bills' ? 'bg-red-500/20 text-red-200 border-red-400/30' :
                      expandedTask.category === 'cooking' ? 'bg-orange-500/20 text-orange-200 border-orange-400/30' :
                      expandedTask.category === 'meeting' ? 'bg-purple-500/20 text-purple-200 border-purple-400/30' :
                      'bg-gray-500/20 text-gray-200 border-gray-400/30'
                    }`}>
                      {expandedTask.category.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                {expandedTask.completed && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
                    <IconCheck className="w-4 h-4 text-green-400" />
                    <span className="text-green-200 text-sm font-medium">Task completed!</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  {!expandedTask.completed ? (
                    <motion.button
                      onClick={() => handleMarkComplete(expandedTask)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-400/30 text-green-200 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IconCheck className="w-4 h-4" />
                      Mark Complete
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleViewAllTasks()}
                      className="flex-1 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IconArrowRight className="w-4 h-4" />
                      View All Tasks
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleEditTask(expandedTask)}
                    className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconEdit className="w-4 h-4" />
                    Edit Task
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GatewayCalendar; 