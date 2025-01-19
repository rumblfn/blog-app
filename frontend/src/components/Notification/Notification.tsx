import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface NotificationProps {
  open: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  type,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={type} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
