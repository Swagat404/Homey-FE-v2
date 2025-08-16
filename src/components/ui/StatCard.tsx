import { motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { clsx } from "clsx";
import { ModernCard } from "./ModernCard";

const cn = (...inputs: any[]) => clsx(inputs);

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ComponentType<any>;
  color?: "blue" | "green" | "purple" | "red" | "yellow" | "gray";
  trend?: "up" | "down" | "neutral";
  prefix?: string;
  suffix?: string;
  animated?: boolean;
  className?: string;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = "purple",
  trend = "neutral",
  prefix = "",
  suffix = "",
  animated = true,
  className,
}, ref) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (animated && typeof value === 'number') {
      const startTime = Date.now();
      const duration = 1000;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setAnimatedValue(Math.floor(numericValue * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, animated, numericValue]);

  const colorClasses = {
    blue: {
      icon: "text-blue-600 bg-blue-500/15",
      border: "border-blue-500/25",
      trend: "text-blue-700 bg-blue-100/80",
    },
    green: {
      icon: "text-green-600 bg-green-500/15",
      border: "border-green-500/25",
      trend: "text-green-700 bg-green-100/80",
    },
    purple: {
      icon: "text-purple-600 bg-purple-500/15",
      border: "border-purple-500/25",
      trend: "text-purple-700 bg-purple-100/80",
    },
    red: {
      icon: "text-red-600 bg-red-500/15",
      border: "border-red-500/25",
      trend: "text-red-700 bg-red-100/80",
    },
    yellow: {
      icon: "text-yellow-600 bg-yellow-500/15",
      border: "border-yellow-500/25",
      trend: "text-yellow-700 bg-yellow-100/80",
    },
    gray: {
      icon: "text-gray-600 bg-gray-500/15",
      border: "border-gray-500/25",
      trend: "text-gray-700 bg-gray-100/80",
    },
  };

  const trendIcons = {
    up: "↗",
    down: "↘",
    neutral: "→",
  };

  const trendColors = {
    up: "text-green-700",
    down: "text-red-700",
    neutral: "text-gray-700",
  };

  const displayValue = animated && typeof value === 'number' ? animatedValue : value;

  return (
    <ModernCard
      ref={ref}
      variant="glass"
      interactive={true}
      glowOnHover={true}
      className={cn("relative overflow-hidden orbiting-lights", className)}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        {Icon && (
          <motion.div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-xl border",
              colorClasses[color].icon,
              colorClasses[color].border
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}

        {/* Trend indicator */}
        {change !== undefined && (
          <motion.div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm",
              colorClasses[color].trend,
              trendColors[trend]
            )}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-lg leading-none">{trendIcons[trend]}</span>
            <span>
              {change > 0 ? "+" : ""}{change}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Main content */}
      <div className="mt-4 space-y-1">
        <motion.div
          className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {prefix}{displayValue.toLocaleString()}{suffix}
        </motion.div>

        <motion.div
          className="text-sm font-medium text-gray-700 dark:text-gray-300 glass-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.div>

        {changeLabel && (
          <motion.div
            className="text-xs text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {changeLabel}
          </motion.div>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16">
        <div className={cn(
          "w-full h-full rounded-full opacity-5",
          colorClasses[color].icon.split(' ')[0].replace('text-', 'bg-')
        )} />
      </div>
    </ModernCard>
  );
});

StatCard.displayName = "StatCard";

export { StatCard }; 