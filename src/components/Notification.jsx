import React, { useEffect, useState } from "react";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

const Notification = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";
  const textColor = "text-white";
  const icon =
    type === "success" ? (
      <IconCheck size={18} />
    ) : type === "error" ? (
      <IconAlertCircle size={18} />
    ) : null;

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in font-roboto font-medium`}
    >
      {icon}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Notification;
