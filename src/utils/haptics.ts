/**
 * Haptic feedback utilities for enhanced mobile UX
 * Uses the Web Vibration API to provide tactile feedback
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

interface HapticPattern {
  pattern: number | number[];
  description: string;
}

const hapticPatterns: Record<HapticType, HapticPattern> = {
  light: {
    pattern: 10,
    description: 'Light tap for subtle interactions'
  },
  medium: {
    pattern: 25,
    description: 'Medium tap for button presses'
  },
  heavy: {
    pattern: 50,
    description: 'Heavy tap for important actions'
  },
  success: {
    pattern: [10, 50, 10],
    description: 'Success pattern for completions'
  },
  error: {
    pattern: [100, 50, 100],
    description: 'Error pattern for mistakes'
  },
  selection: {
    pattern: [5, 10, 5],
    description: 'Quick pattern for selections'
  }
};

/**
 * Trigger haptic feedback if supported by the device
 */
export const triggerHaptic = (type: HapticType = 'light'): void => {
  // Check if the device supports vibration
  if (!navigator.vibrate) {
    return;
  }

  // Check if the user is on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile) {
    return;
  }

  const pattern = hapticPatterns[type].pattern;
  
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    // Silently fail if vibration is not supported or disabled
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Enhanced haptic feedback for specific UI actions
 */
export const hapticFeedback = {
  /**
   * Light feedback for hover states and subtle interactions
   */
  hover: () => triggerHaptic('light'),

  /**
   * Medium feedback for button presses and taps
   */
  tap: () => triggerHaptic('medium'),

  /**
   * Heavy feedback for important actions like deletes
   */
  impact: () => triggerHaptic('heavy'),

  /**
   * Success feedback for completed actions
   */
  success: () => triggerHaptic('success'),

  /**
   * Error feedback for failed actions
   */
  error: () => triggerHaptic('error'),

  /**
   * Selection feedback for picker interactions
   */
  selection: () => triggerHaptic('selection'),

  /**
   * Task completion - special success pattern
   */
  taskComplete: () => {
    // Double success pattern for task completion
    triggerHaptic('success');
    setTimeout(() => triggerHaptic('light'), 150);
  },

  /**
   * Expense added - medium + light pattern
   */
  expenseAdded: () => {
    triggerHaptic('medium');
    setTimeout(() => triggerHaptic('light'), 100);
  },

  /**
   * Navigation feedback
   */
  navigate: () => triggerHaptic('light'),

  /**
   * Delete confirmation - warning pattern
   */
  deleteWarning: () => {
    triggerHaptic('heavy');
    setTimeout(() => triggerHaptic('medium'), 100);
  }
};

/**
 * Check if haptic feedback is supported on the current device
 */
export const isHapticSupported = (): boolean => {
  return !!navigator.vibrate && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export default hapticFeedback;
