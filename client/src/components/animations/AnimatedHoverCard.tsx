import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedHoverCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedHoverCard({ children, className = "", onClick }: AnimatedHoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" 
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`rounded-lg bg-card overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}