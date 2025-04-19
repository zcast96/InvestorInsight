import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

interface AnimatedChartProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function AnimatedChart({
  children,
  className = "",
  delay = 0.3,
  duration = 0.8
}: AnimatedChartProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { 
            delay, 
            duration,
            ease: [0.34, 1.56, 0.64, 1] // Custom ease with slight overshoot
          }
        }}
        onAnimationComplete={() => setIsVisible(true)}
      >
        {children}
      </motion.div>
      
      {!isVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="w-8 h-8 rounded-full bg-primary/30"
          />
        </div>
      )}
    </div>
  );
}