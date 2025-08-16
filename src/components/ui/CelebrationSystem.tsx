import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { IconTrophy, IconStar, IconCheck, IconHeart } from '@tabler/icons-react';

interface CelebrationSystemProps {
  trigger: boolean;
  type?: 'task' | 'expense' | 'achievement' | 'streak';
  onComplete?: () => void;
  intensity?: 'low' | 'medium' | 'high';
  message?: string;
}

interface Achievement {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({
  trigger,
  type = 'task',
  onComplete,
  intensity = 'medium',
  message
}) => {
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [showAchievement, setShowAchievement] = React.useState(false);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const achievements: Record<string, Achievement> = {
    task: {
      icon: IconCheck,
      title: 'Task Complete!',
      subtitle: message || 'Great job! Keep up the momentum! 🎉',
      color: 'from-green-400 to-emerald-500'
    },
    expense: {
      icon: IconStar,
      title: 'Expense Added!',
      subtitle: message || 'Bills tracked, transparency maintained! 💰',
      color: 'from-blue-400 to-cyan-500'
    },
    achievement: {
      icon: IconTrophy,
      title: 'Achievement Unlocked!',
      subtitle: message || 'You\'re on fire! 🔥',
      color: 'from-yellow-400 to-orange-500'
    },
    streak: {
      icon: IconHeart,
      title: 'Streak Bonus!',
      subtitle: message || 'Consistency is key! Keep going! ⚡',
      color: 'from-purple-400 to-pink-500'
    }
  };

  const triggerConfetti = useCallback(() => {
    const confettiConfig = {
      particleCount: intensity === 'high' ? 150 : intensity === 'medium' ? 100 : 50,
      spread: intensity === 'high' ? 100 : intensity === 'medium' ? 70 : 45,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'],
      ticks: 200,
      gravity: 0.8,
      drift: 0,
      startVelocity: intensity === 'high' ? 45 : intensity === 'medium' ? 35 : 25,
      scalar: 1.2
    };

    // Primary burst
    confetti(confettiConfig);

    // Secondary delayed bursts for high intensity
    if (intensity === 'high') {
      setTimeout(() => {
        confetti({
          ...confettiConfig,
          particleCount: 75,
          origin: { x: 0.2, y: 0.7 }
        });
      }, 150);

      setTimeout(() => {
        confetti({
          ...confettiConfig,
          particleCount: 75,
          origin: { x: 0.8, y: 0.7 }
        });
      }, 300);
    }

    // Hearts for special achievements
    if (type === 'achievement' || type === 'streak') {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#F87171', '#FB7185', '#F472B6'],
          shapes: ['heart'],
          scalar: 1.5,
          gravity: 0.5
        });
      }, 200);
    }
  }, [intensity, type]);

  useEffect(() => {
    if (trigger) {
      setShowCelebration(true);
      setShowAchievement(true);
      triggerConfetti();

      // Auto-hide celebration
      const hideTimeout = setTimeout(() => {
        setShowCelebration(false);
        setShowAchievement(false);
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(hideTimeout);
        if (confettiTimeoutRef.current) {
          clearTimeout(confettiTimeoutRef.current);
        }
      };
    }
  }, [trigger, triggerConfetti, onComplete]);

  const achievement = achievements[type];
  const Icon = achievement.icon;

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          {/* Celebration Background Overlay */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Radial gradient burst effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-purple-400/20 via-transparent to-transparent"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              exit={{ scale: 4, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Sparkle effects */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </motion.div>

          {/* Achievement Card */}
          {showAchievement && (
            <motion.div
              className="fixed top-1/2 left-1/2 pointer-events-none z-[300]"
              initial={{ 
                scale: 0, 
                rotateY: -90, 
                opacity: 0,
                x: '-50%',
                y: '-50%'
              }}
              animate={{ 
                scale: 1, 
                rotateY: 0, 
                opacity: 1,
                x: '-50%',
                y: '-50%'
              }}
              exit={{ 
                scale: 0.8, 
                rotateY: 90, 
                opacity: 0,
                x: '-50%',
                y: '-50%'
              }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                duration: 0.6
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${achievement.color} rounded-3xl blur-2xl opacity-60`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Main card */}
                <motion.div
                  className="relative bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-8 min-w-[320px] text-center shadow-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotateX: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Icon with gradient background */}
                  <motion.div
                    className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2
                    }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {achievement.title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    className="text-gray-200 dark:text-gray-300 text-sm leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {achievement.subtitle}
                  </motion.p>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [360, 180, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default CelebrationSystem;
