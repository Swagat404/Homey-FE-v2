import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModernCard } from './ModernCard';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus,
  IconEye,
  IconChevronRight,
  IconSparkles,
  IconActivity,
  IconClock
} from '@tabler/icons-react';

interface AnalyticsData {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  icon?: React.ReactNode;
  details?: string;
}

interface PremiumAnalyticsProps {
  title: string;
  subtitle?: string;
  data: AnalyticsData[];
  type: 'distribution' | 'status' | 'trend';
  icon: React.ReactNode;
  accentColor?: string;
  showInsights?: boolean;
  onViewDetails?: () => void;
}

const PremiumAnalytics: React.FC<PremiumAnalyticsProps> = ({
  title,
  subtitle,
  data,
  type,
  icon,
  accentColor = '#8B5CF6',
  showInsights = true,
  onViewDetails
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <IconTrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <IconTrendingDown className="w-3 h-3 text-red-500" />;
      default: return <IconMinus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getColorVariants = (baseColor: string, index: number) => {
    const colors = [
      baseColor,
      `${baseColor}CC`, // 80% opacity
      `${baseColor}99`, // 60% opacity
      `${baseColor}66`, // 40% opacity
    ];
    return colors[index % colors.length];
  };

  const generateInsight = () => {
    if (data.length === 0) return null;
    
    const highest = data.reduce((max, item) => item.value > max.value ? item : max);
    const percentage = Math.round((highest.value / total) * 100);
    
    return `${highest.name} leads with ${percentage}% of all ${type === 'distribution' ? 'tasks' : 'activity'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <ModernCard 
        variant="glass" 
        className="p-5 h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(255,255,255,0.2)`,
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-cyan-400 rounded-full blur-2xl transform -translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showInsights && (
              <motion.button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconEye className="w-3 h-3 text-gray-400" />
              </motion.button>
            )}
            {onViewDetails && (
              <motion.button
                onClick={onViewDetails}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconChevronRight className="w-3 h-3 text-gray-400" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Insight Banner */}
        <AnimatePresence>
          {showDetails && showInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 relative z-10"
            >
              <div className="flex items-center gap-2">
                <IconSparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">
                  {generateInsight()}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Visualization */}
        <div className="space-y-3 relative z-10">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const isHovered = hoveredItem === item.name;
            
            return (
              <motion.div
                key={item.name}
                className="group/item cursor-pointer"
                onHoverStart={() => setHoveredItem(item.name)}
                onHoverEnd={() => setHoveredItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: item.color || getColorVariants(accentColor, index),
                      }}
                      animate={{
                        scale: isHovered ? 1.3 : 1,
                        boxShadow: isHovered ? `0 0 20px ${item.color || accentColor}` : 'none'
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                      {item.name}
                    </span>
                    {item.trend && getTrendIcon(item.trend)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <motion.span 
                        className="text-sm font-bold text-gray-900 dark:text-white"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                      >
                        {type === 'distribution' ? item.value : `$${item.value}`}
                      </motion.span>
                      {item.change && (
                        <div className={`text-xs ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="relative">
                  <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, ${item.color || getColorVariants(accentColor, index)}, ${item.color || getColorVariants(accentColor, index)}AA)`
                      }}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: animationComplete ? `${percentage}%` : 0,
                        boxShadow: isHovered ? `0 0 20px ${item.color || accentColor}40` : 'none'
                      }}
                      transition={{ 
                        duration: 1.2, 
                        delay: index * 0.1 + 0.5,
                        ease: "easeOut"
                      }}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-100%', '100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2 + 1
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Percentage Label */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-medium shadow-lg"
                      >
                        {Math.round(percentage)}%
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900 dark:border-t-white"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Details on Hover */}
                <AnimatePresence>
                  {isHovered && item.details && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-2"
                    >
                      {item.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-1">
            <IconActivity className="w-3 h-3" />
            <span>Total: {type === 'distribution' ? total : `$${total}`}</span>
          </div>
          <div className="flex items-center gap-1">
            <IconClock className="w-3 h-3" />
            <span>Live data</span>
          </div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5
              }}
              style={{
                left: `${20 + i * 30}%`,
                top: `${80 - i * 20}%`
              }}
            />
          ))}
        </div>
      </ModernCard>
    </motion.div>
  );
};

export default PremiumAnalytics;
