import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatedAlert } from "@/components/animations";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: ReactNode;
  autoHideDuration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    type: NotificationType,
    title: string,
    message?: ReactNode,
    autoHideDuration?: number
  ) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    type: NotificationType,
    title: string,
    message?: ReactNode,
    autoHideDuration = 5000
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message, autoHideDuration }]);
  };

  const hideNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, hideNotification }}>
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <AnimatedAlert
          key={notification.id}
          type={notification.type}
          title={notification.title}
          description={notification.message}
          isVisible={true}
          onClose={() => hideNotification(notification.id)}
          autoHideDuration={notification.autoHideDuration}
          className={`top-${4 + index * 6}}`} // Stack notifications
        />
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}