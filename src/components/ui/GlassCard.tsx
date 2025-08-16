import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { GlassCardProps } from "./types";

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = "", hover = true, variant = "default", onClick, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const variants = {
      default: "glass-card",
      subtle: "glass-card-subtle", 
      strong: "glass-card-strong",
      violet: "glass-card-violet",
      elevated: "glass-card bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
      interactive: "glass-card bg-gradient-to-br from-violet-500/[0.08] to-transparent",
    };

    const hoverClass = hover ? "glass-card-hover" : "";

    return (
      <motion.div 
        ref={ref} 
        className={`${variants[variant]} ${hoverClass} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.4, 0, 0.2, 1] 
        }}
        whileHover={hover ? { 
          scale: 1.02, 
          y: -6,
          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
        } : {}}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
