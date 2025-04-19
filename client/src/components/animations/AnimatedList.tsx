import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedListProps {
  items: ReactNode[];
  className?: string;
}

export function AnimatedList({ items, className = "" }: AnimatedListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className={`space-y-2 ${className}`}
    >
      {items.map((child, index) => (
        <motion.li key={index} variants={item} className="list-none">
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}