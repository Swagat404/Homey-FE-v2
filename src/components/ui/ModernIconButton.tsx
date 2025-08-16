import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

// Local utility function for class name merging
const cn = (...inputs: any[]) => clsx(inputs);

const iconButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.16] backdrop-blur-xl shadow-lg hover:shadow-xl text-purple-700 dark:text-purple-300",
        primary: "bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25",
        secondary: "bg-gray-500/10 hover:bg-gray-500/20 border border-gray-200/20 text-gray-700 dark:text-gray-300",
        ghost: "hover:bg-white/[0.08] text-purple-600 dark:text-purple-400",
        destructive: "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400",
        success: "bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-600 dark:text-green-400",
        warning: "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400",
        gradient: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl",
      },
      size: {
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-14 w-14 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ModernIconButtonProps extends VariantProps<typeof iconButtonVariants> {
  icon: React.ComponentType<any>;
  loading?: boolean;
  pulse?: boolean;
  tooltip?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ModernIconButton = forwardRef<HTMLButtonElement, ModernIconButtonProps>(
  ({ className, variant, size, icon: Icon, loading, pulse, tooltip, disabled, onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onClick={onClick}
          whileHover={{ 
    scale: 1.05,
    boxShadow: "0 8px 25px rgba(139, 92, 246, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)"
  }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
        title={tooltip}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        {/* Icon */}
        <motion.div
          className={cn(
            "relative z-10 transition-all duration-300",
            loading && "opacity-0",
            pulse && "animate-pulse"
          )}
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-full h-full" />
        </motion.div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
      </motion.button>
    );
  }
);

ModernIconButton.displayName = "ModernIconButton";

export { ModernIconButton, iconButtonVariants }; 