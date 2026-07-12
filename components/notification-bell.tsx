"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { getMyNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import type { AppNotification } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  profileId: string;
}

export function NotificationBell({ profileId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [notifResult, countResult] = await Promise.all([
      getMyNotifications(profileId, 10),
      getUnreadNotificationCount(profileId),
    ]);
    if (notifResult.success && notifResult.data) setNotifications(notifResult.data);
    if (countResult.success) setUnreadCount(countResult.data ?? 0);
  }, [profileId]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    await markAllNotificationsRead(profileId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    setLoading(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={loading}
              className="text-xs text-blue-500 hover:underline flex items-center gap-1"
            >
              {loading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <CheckCheck className="size-3" />
              )}
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.slice(0, 10).map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className={cn(
                "flex flex-col items-start gap-0.5 py-3 px-4 cursor-pointer",
                !notif.read && "bg-muted/50"
              )}
              onClick={() => handleMarkRead(notif.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm font-medium flex-1">{notif.title}</span>
                {!notif.read && (
                  <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {notif.message}
              </p>
              <span className="text-[10px] text-muted-foreground/60 mt-1">
                {formatRelativeTime(notif.created_at)}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString();
}
