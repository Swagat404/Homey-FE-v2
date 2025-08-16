// Modern Professional Color System - Inspired by Apple, Linear, Notion, YC Startups
// Vibrant yet sophisticated - professional doesn't mean boring!

const MODERN_PALETTE = {
  // Rich, vibrant neutrals with personality
  neutral: {
    50: "#fdfdfd",   // Crisp white
    100: "#f8f9fa",  // Light gray with warmth
    200: "#e9ecef",  // Subtle borders
    300: "#dee2e6",  // Medium borders
    400: "#6c757d",  // Muted text with character
    500: "#495057",  // Secondary text
    600: "#343a40",  // Primary text
    700: "#212529",  // Strong text
    800: "#1a1d23",  // Heading text
    900: "#0d1117",  // Maximum contrast
  },

  // Vibrant purple - modern and energetic like Linear
  primary: {
    50: "#faf5ff",
    100: "#f3e8ff", 
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",  // Bright and modern
    500: "#a855f7",  // Main brand - vibrant purple
    600: "#9333ea",  // Rich purple
    700: "#7c3aed",  // Deep purple
    800: "#6b21b6",  // Dark purple
    900: "#581c87",  // Darkest purple
  },

  // Vibrant teal - like modern SaaS tools
  success: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc", 
    300: "#67e8f9",
    400: "#22d3ee",  // Bright cyan
    500: "#06b6d4",  // Vibrant teal
    600: "#0891b2",  // Rich teal
    700: "#0e7490",  // Deep teal
    800: "#155e75",  // Dark teal
    900: "#164e63",  // Darkest teal
  },

  // Energetic orange - like modern startups
  warning: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",  // Bright orange
    500: "#f97316",  // Energetic orange
    600: "#ea580c",  // Rich orange
    700: "#c2410c",  // Deep orange
    800: "#9a3412",  // Dark orange
    900: "#7c2d12",  // Darkest orange
  },

  // Modern red - sophisticated but vibrant
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",  // Bright red
    500: "#ef4444",  // Modern red
    600: "#dc2626",  // Rich red
    700: "#b91c1c",  // Deep red
    800: "#991b1b",  // Dark red
    900: "#7f1d1d",  // Darkest red
  },

  // Vibrant blue - like modern tech companies
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",  // Bright blue
    500: "#3b82f6",  // Modern blue
    600: "#2563eb",  // Rich blue
    700: "#1d4ed8",  // Deep blue
    800: "#1e40af",  // Dark blue
    900: "#1e3a8a",  // Darkest blue
  },

  // Additional vibrant colors for variety
  accent: {
    pink: "#ec4899",     // Vibrant pink
    emerald: "#10b981",  // Fresh emerald
    yellow: "#f59e0b",   // Bright yellow
    indigo: "#6366f1",   // Modern indigo
    lime: "#84cc16",     // Fresh lime
    rose: "#f43f5e",     // Modern rose
  },
};

// Type definitions
export interface ColorPalette {
  [key: string]: string;
}

export interface ThemeColors {
  primary: string;
  primaryBright: string;
  primaryDark: string;
  glassBackground: string;
  glassBorder: string;
  glassViolet: string;
  background: string;
  text: string;
  textSecondary: string;
  textMuted: string;
}

export interface CSSVariables {
  [key: string]: string;
}

// Professional Theme Configurations
export const LIGHT_THEME_COLORS: ThemeColors = {
  primary: MODERN_PALETTE.primary[600],
  primaryBright: MODERN_PALETTE.primary[500],
  primaryDark: MODERN_PALETTE.primary[700],

  glassBackground: "rgba(255, 255, 255, 0.08)",
  glassBorder: "rgba(168, 85, 247, 0.06)",
  glassViolet: "rgba(168, 85, 247, 0.04)",

  text: MODERN_PALETTE.neutral[800],
  textSecondary: MODERN_PALETTE.neutral[600],
  textMuted: MODERN_PALETTE.neutral[500],
  background: MODERN_PALETTE.neutral[50],
};

export const DARK_THEME_COLORS: ThemeColors = {
  primary: MODERN_PALETTE.primary[400],
  primaryBright: MODERN_PALETTE.primary[300],
  primaryDark: MODERN_PALETTE.primary[500],

  glassBackground: "rgba(0, 0, 0, 0.15)",
  glassBorder: "rgba(168, 85, 247, 0.08)",
  glassViolet: "rgba(168, 85, 247, 0.06)",

  text: MODERN_PALETTE.neutral[100],
  textSecondary: MODERN_PALETTE.neutral[300],
  textMuted: MODERN_PALETTE.neutral[400],
  background: MODERN_PALETTE.neutral[900],
};

// Professional CSS Variables Generator
export const generateCSSVars = (theme: ThemeColors): CSSVariables => {
  return {
    "--homey-primary": theme.primary,
    "--homey-primary-bright": theme.primaryBright,
    "--homey-primary-dark": theme.primaryDark,
    "--homey-glass-bg": theme.glassBackground,
    "--homey-glass-border": theme.glassBorder,
    "--homey-glass-violet": theme.glassViolet,
    "--homey-bg": theme.background,
    "--homey-text": theme.text,
    "--homey-text-secondary": theme.textSecondary,
    "--homey-text-muted": theme.textMuted,

    // Professional status colors - subtle and sophisticated
    "--color-success": MODERN_PALETTE.success[600],
    "--color-warning": MODERN_PALETTE.warning[600],
    "--color-error": MODERN_PALETTE.error[500],
    "--color-info": MODERN_PALETTE.info[600],

    // Subtle accent colors for different categories
    "--accent-stats": MODERN_PALETTE.primary[500],     // Primary purple for main stats
    "--accent-tasks": MODERN_PALETTE.warning[500],     // Sophisticated amber for tasks
    "--accent-pending": MODERN_PALETTE.warning[400],   // Lighter amber for pending
    "--accent-progress": MODERN_PALETTE.info[500],     // Professional blue for in progress
    "--accent-completed": MODERN_PALETTE.success[500], // Sophisticated teal for completed
    "--accent-overdue": MODERN_PALETTE.error[400],     // Soft rose for overdue
    "--accent-neutral": MODERN_PALETTE.neutral[400],   // Neutral for secondary elements

    // Dynamic surface colors with subtle opacity
    "--surface-1": theme.text === MODERN_PALETTE.neutral[100] ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
    "--surface-2": theme.text === MODERN_PALETTE.neutral[100] ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
    "--surface-3": theme.text === MODERN_PALETTE.neutral[100] ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
    "--glass-input-bg": theme.text === MODERN_PALETTE.neutral[100] ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.08)",
  };
};

// Tailwind integration
export const TAILWIND_COLORS = {
  "professional-neutral": MODERN_PALETTE.neutral,
  "professional-primary": MODERN_PALETTE.primary,
  "professional-success": MODERN_PALETTE.success,
  "professional-warning": MODERN_PALETTE.warning,
  "professional-error": MODERN_PALETTE.error,
  "professional-info": MODERN_PALETTE.info,
} as const;
