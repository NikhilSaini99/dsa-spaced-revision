import { useState, useEffect, useCallback } from "react";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission as PermissionState;
  });

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);
      return result === "granted";
    } catch {
      return false;
    }
  }, []);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== "granted") return null;
      try {
        return new Notification(title, {
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          ...options,
        });
      } catch {
        return null;
      }
    },
    [permission]
  );

  // Schedule daily check for due revisions
  const scheduleDailyReminder = useCallback(
    (timeStr: string, dueCount: number) => {
      if (permission !== "granted" || dueCount === 0) return;

      const [hours, minutes] = timeStr.split(":").map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      // If the time has already passed today, don't send
      if (target.getTime() <= now.getTime()) return;

      const delay = target.getTime() - now.getTime();
      const timer = setTimeout(() => {
        sendNotification("DSA Revision Reminder", {
          body: `You have ${dueCount} revision${dueCount > 1 ? "s" : ""} due today. Keep your streak alive!`,
          tag: "dsa-daily-reminder",
        });
      }, delay);

      return () => clearTimeout(timer);
    },
    [permission, sendNotification]
  );

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleDailyReminder,
  };
}
