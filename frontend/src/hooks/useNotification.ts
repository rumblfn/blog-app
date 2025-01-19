import { useState } from "react";

interface NotificationState {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export const useNotification = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    type: "info",
  });

  const showNotification = (
    message: string,
    type: NotificationState["type"] = "info",
  ) => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
