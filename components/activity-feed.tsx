"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  UserCheck,
  Calendar,
  CreditCard,
  Users,
  UserPlus,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";
import { getRecentActivity } from "@/lib/actions/activity";
import type { ActivityEvent } from "@/lib/actions/activity";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ActivityFeedProps {
  companyId: string;
  limit?: number;
}

const actionIcons: Record<string, React.ReactNode> = {
  check_in: <LogIn className="size-3.5" />,
  check_out: <LogOut className="size-3.5" />,
  leave_approved: <Calendar className="size-3.5 text-emerald-500" />,
  leave_rejected: <Calendar className="size-3.5 text-red-500" />,
  employee_created: <UserPlus className="size-3.5 text-blue-500" />,
  salary_updated: <CreditCard className="size-3.5 text-purple-500" />,
  profile_updated: <Users className="size-3.5" />,
};

export function ActivityFeed({ companyId, limit = 20 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const result = await getRecentActivity(companyId, limit);
    if (result.success && result.data) setActivities(result.data);
    setLoading(false);
  }, [companyId, limit]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No recent activity.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((event) => {
        const profile = event.profile as ActivityEvent["profile"] | undefined;
        const initials = profile
          ? `${(profile.first_name?.[0] || "").toUpperCase()}${(profile.last_name?.[0] || "").toUpperCase()}`
          : "?";
        const icon = actionIcons[event.action] || <Clock className="size-3.5" />;

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 py-2.5 group hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
          >
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">
                  {profile ? `${profile.first_name} ${profile.last_name}` : "Someone"}
                </span>{" "}
                <span className="text-muted-foreground">{event.details || event.action.replace(/_/g, " ")}</span>
              </p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                <Clock className="size-3 inline mr-1" />
                {formatRelativeTime(event.created_at)}
              </p>
            </div>
            <div className="size-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
              {icon}
            </div>
          </div>
        );
      })}
    </div>
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
