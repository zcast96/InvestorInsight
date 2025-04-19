import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error" | "warning" | "info";

interface AnimatedAlertProps {
  type: AlertType;
  title: string;
  description?: ReactNode;
  isVisible: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
  className?: string;
}

export function AnimatedAlert({
  type,
  title,
  description,
  isVisible,
  onClose,
  autoHideDuration = 5000,
  className = ""
}: AnimatedAlertProps) {
  // Handle auto-hide
  if (autoHideDuration > 0 && isVisible && onClose) {
    setTimeout(() => {
      onClose();
    }, autoHideDuration);
  }

  // Icon based on alert type
  const AlertIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn("fixed top-4 right-4 z-50 max-w-md", className)}
        >
          <Alert
            className={cn(
              "border-l-4 shadow-lg",
              type === "success" && "border-l-green-500 bg-green-50 dark:bg-green-950/20",
              type === "error" && "border-l-red-500 bg-red-50 dark:bg-red-950/20",
              type === "warning" && "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
              type === "info" && "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
            )}
          >
            <div className="flex items-start gap-3">
              <AlertIcon />
              <div className="flex-1">
                <AlertTitle className="text-sm font-medium mb-1">{title}</AlertTitle>
                {description && (
                  <AlertDescription className="text-xs opacity-80">
                    {description}
                  </AlertDescription>
                )}
              </div>
              {onClose && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Close</span>
                  <XCircle className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}