import React from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationIconProps {
  className?: string;
}

const NotificationIcon = ({ className }: NotificationIconProps) => {
  const { notifications, markAsRead, loading, error } = useNotifications();

  // Count unread notifications
  const unreadCount =
    notifications?.filter((notification) => !notification.read).length || 0;

  // Format notification time to relative time (e.g., "2 hours ago")
  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60),
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
          className={`relative rounded-full p-2 transition-colors duration-200 hover:bg-[#FDF9F6] focus:outline-none ${
            className || ""
          }`}
        >
          <Bell className="h-6 w-6 text-[#404040]" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 rounded-full bg-[#BF4008] px-2 py-1 font-[Lato] text-xs text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 border-zinc-200 p-0" align="end">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4">
          <h3 className="font-[Poppins] font-medium tracking-[-0.4px] text-[#2C2C2C]">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="font-[Lato] text-xs text-[#BF4008] transition-colors duration-200 hover:text-[#BF4008]/80"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <p className="p-4 text-center font-[Lato] tracking-[0.08px] text-[#404040]">
              Loading notifications...
            </p>
          )}

          {error && (
            <p className="p-4 text-center font-[Lato] text-[#BF4008]">
              Error loading notifications
            </p>
          )}

          {!loading && !error && notifications?.length === 0 && (
            <p className="p-4 text-center font-[Lato] tracking-[0.08px] text-[#404040]">
              No notifications
            </p>
          )}

          {!loading &&
            !error &&
            notifications?.map((notification) => (
              <Card
                key={notification.id}
                className={`rounded-none border-0 border-b border-zinc-200 ${
                  !notification.read ? "bg-[#FDF9F6]" : ""
                }`}
              >
                <CardContent className="flex flex-col gap-2 px-4">
                  <div className="flex flex-col">
                    <p className="font-[Poppins] font-medium tracking-[-0.4px] text-[#2C2C2C]">
                      {notification.title}
                    </p>
                    <p className="font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex w-full items-end justify-between">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="font-[Lato] text-xs text-[#BF4008] transition-colors duration-200 hover:text-[#BF4008]/80"
                      >
                        Mark as read
                      </button>
                    )}
                    <span className="font-[Lato] text-xs text-[#404040]">
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
