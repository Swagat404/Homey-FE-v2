import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { IconButtonProps } from "./types";

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      size = "md",
      variant = "ghost",
      className = "",
      disabled = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      ghost: "bg-white/5 hover:bg-white/10 border border-white/10 text-purple-600",
      primary: "bg-gradient-to-br from-purple-500 to-purple-600 text-white border border-purple-500/20 shadow-lg shadow-purple-500/25",
      danger: "bg-gradient-to-br from-red-500 to-red-600 text-white border border-red-500/20 shadow-lg shadow-red-500/25",
      success: "bg-gradient-to-br from-green-500 to-green-600 text-white border border-green-500/20 shadow-lg shadow-green-500/25",
    };

    const sizes = {
      xs: "w-8 h-8 p-1.5",
      sm: "w-9 h-9 p-2",
      md: "w-10 h-10 p-2.5",
      lg: "w-12 h-12 p-3",
      xl: "w-14 h-14 p-3.5",
    };

    const iconSizes = {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-7 h-7",
    };

    const isInteractive = !disabled && !loading;

    return (
      <motion.button
        ref={ref}
        className={`
          relative rounded-xl backdrop-blur-sm transition-all duration-300
          flex items-center justify-center font-medium overflow-hidden
          ${variants[variant]} ${sizes[size]}
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        disabled={disabled || loading}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.3, 
          ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
        }}
        whileHover={isInteractive ? { 
          scale: 1.05,
          y: -1,
          transition: { duration: 0.2 }
        } : {}}
        whileTap={isInteractive ? { 
          scale: 0.95,
          y: 0,
          transition: { duration: 0.1 }
        } : {}}
        {...props}
      >
        {/* Enhanced background gradient overlay */}
        {variant === "primary" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-xl" />
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

        {/* Icon and content */}
        <motion.div 
          className={`flex items-center justify-center ${loading ? "opacity-0" : ""} relative z-10`}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {Icon && !children && (
            <motion.div
              whileHover={isInteractive ? { rotate: 5 } : {}}
              transition={{ duration: 0.2 }}
            >
              <Icon className={iconSizes[size]} />
            </motion.div>
          )}
          
          {children && (
            <div className="flex items-center gap-2">
              {Icon && (
                <motion.div
                  whileHover={isInteractive ? { rotate: 5 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={iconSizes[size]} />
                </motion.div>
              )}
              {children}
            </div>
          )}
        </motion.div>

        {/* Subtle shine effect on hover */}
        {isInteractive && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";
export default IconButton;
