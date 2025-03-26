import React from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications"; // Assuming this custom hook exists

// Interface for the component props (if needed)
interface NotificationIconProps {
  className?: string;
}

const NotificationIcon = ({ className }: NotificationIconProps) => {
  // Use the custom hook to get notifications
  const { notifications, markAsRead, loading, error } = useNotifications();

  // Count unread notifications
  const unreadCount =
    notifications?.filter((notification) => !notification.read).length || 0;

  // Format notification time to relative time (e.g., "2 hours ago")
  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = (): void => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={`relative p-2 rounded-full hover:bg-gray-100 focus:outline-none ${
            className || ""
          }`}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <p className="p-4 text-center text-gray-500">
              Loading notifications...
            </p>
          )}

          {error && (
            <p className="p-4 text-center text-red-500">
              Error loading notifications
            </p>
          )}

          {!loading && !error && notifications?.length === 0 && (
            <p className="p-4 text-center text-gray-500">No notifications</p>
          )}

          {!loading &&
            !error &&
            notifications?.map((notification) => (
              <Card
                key={notification.id}
                className={`border-0 border-b rounded-none ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <CardContent className="px-4 flex flex-col gap-2">
                  <div className="flex flex-col">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex w-full justify-between item-center items-end">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-500 hover:text-blue-700 "
                      >
                        Mark as read
                      </button>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
