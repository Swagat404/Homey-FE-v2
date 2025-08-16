import { motion } from "framer-motion";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const cn = (...inputs: any[]) => clsx(inputs);

const cardVariants = cva(
  "relative rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white/[0.08] border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.16] shadow-lg hover:shadow-xl",
        glass: "glass-container shiny-overlay",
        premium: "liquid-glass",
        frosted: "frosted-glass",
        dark: "bg-black/[0.20] border-white/[0.08] hover:bg-black/[0.30] hover:border-white/[0.12]",
        gradient: "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-transparent shadow-xl hover:shadow-2xl",
        crystal: "crystal-glass",
        holographic: "holographic shiny-overlay",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1",
        scale: "hover:scale-[1.02]",
        glow: "hover:shadow-purple-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "lift",
    },
  }
);

interface ModernCardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  interactive?: boolean;
  glowOnHover?: boolean;
  borderGradient?: boolean;
  className?: string;
  onClick?: () => void;
}

const ModernCard = forwardRef<HTMLDivElement, ModernCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    hover, 
    children, 
    interactive = false, 
    glowOnHover = false,
    borderGradient = false,
    onClick,
    ...props 
  }, ref) => {
    
    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, size, hover, className }))}
          onClick={onClick}
          whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Border gradient overlay */}
          {borderGradient && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 p-[1px]">
              <div className="w-full h-full rounded-2xl bg-black/90 backdrop-blur-xl" />
            </div>
          )}
          
          {/* Glow effect */}
          {glowOnHover && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
          )}
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Subtle highlight effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      );
    }
    
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, className }))}
        onClick={onClick}
      >
        {/* Border gradient overlay */}
        {borderGradient && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 p-[1px]">
            <div className="w-full h-full rounded-2xl bg-black/90 backdrop-blur-xl" />
          </div>
        )}
        
        {/* Glow effect */}
        {glowOnHover && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle highlight effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    );
  }
);

ModernCard.displayName = "ModernCard";

export { ModernCard, cardVariants }; 