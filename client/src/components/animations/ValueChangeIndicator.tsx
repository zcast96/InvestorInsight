import { motion } from "framer-motion";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueChangeIndicatorProps {
  value: number;
  showIcon?: boolean;
  showBg?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function ValueChangeIndicator({
  value,
  showIcon = true,
  showBg = true,
  iconOnly = false,
  className = ""
}: ValueChangeIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const formattedValue = Math.abs(value).toFixed(2) + '%';
  
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  };

  const isNegative = value < 0;
  
  return (
    <motion.div
      className={cn(
        "inline-flex items-center space-x-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
        showBg && isPositive && "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
        showBg && isNegative && "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
        showBg && isNeutral && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
        !showBg && isPositive && "text-green-600 dark:text-green-400",
        !showBg && isNegative && "text-red-600 dark:text-red-400",
        !showBg && isNeutral && "text-gray-600 dark:text-gray-400",
        className
      )}
      initial="initial"
      animate="animate"
      variants={variants}
    >
      {showIcon && (
        <motion.span
          animate={{ rotate: [0, isPositive ? -20 : 20, 0], scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1,
            type: "spring",
            stiffness: 200
          }}
        >
          {isPositive ? (
            <ArrowUpIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
          ) : isNegative ? (
            <ArrowDownIcon className="h-3 w-3 text-red-600 dark:text-red-400" />
          ) : (
            <MinusIcon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
          )}
        </motion.span>
      )}
      {!iconOnly && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {formattedValue}
        </motion.span>
      )}
    </motion.div>
  );
}