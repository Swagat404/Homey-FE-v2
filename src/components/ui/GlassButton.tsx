import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { GlassButtonProps } from "./types";

const GlassButton = forwardRef<any, GlassButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon: Icon,
      rightIcon: RightIcon,
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const variants: any = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      ghost: "glass-button",
      danger: "btn-danger",
      warning: "btn-secondary",
      outline: "bg-transparent border-2 border-purple-500/20 text-purple-600 hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-purple-700",
      minimal: "bg-transparent text-purple-600 hover:bg-purple-500/5 hover:text-purple-700 border-none font-medium",
    };

    const sizes = {
      xs: "px-2 py-1.5 text-xs gap-1",
      sm: "px-3 py-2 text-sm gap-1.5",
      md: "px-4 py-3 text-sm gap-2",
      lg: "px-6 py-4 text-base gap-2",
      xl: "px-8 py-5 text-lg gap-3",
    };

    const isInteractive = !disabled && !loading;

    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-glass font-medium
          transition-all duration-300 relative overflow-hidden
          ${variants[variant]} ${sizes[size]}
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        disabled={disabled || loading}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        whileHover={isInteractive ? { 
          scale: variant === "minimal" ? 1.01 : 1.02,
          y: variant === "minimal" ? -1 : -2,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={isInteractive ? { 
          scale: 0.98,
          y: 0,
          transition: { duration: 0.1 }
        } : {}}
        {...props}
      >
        {/* Loading shimmer effect */}
        {loading && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {/* Button content */}
        <motion.div 
          className={`flex items-center ${sizes[size].includes('gap') ? '' : 'gap-2'} ${loading ? "opacity-0" : ""}`}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {Icon && (
            <motion.div
              whileHover={{ rotate: variant === "minimal" ? 2 : 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
            </motion.div>
          )}
          <span className="flex-1">{children as React.ReactNode}</span>
          {RightIcon && (
            <motion.div
              whileHover={{ x: variant === "minimal" ? 1 : 2 }}
              transition={{ duration: 0.2 }}
            >
              <RightIcon className="w-4 h-4 flex-shrink-0" />
            </motion.div>
          )}
        </motion.div>
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
export default GlassButton;
