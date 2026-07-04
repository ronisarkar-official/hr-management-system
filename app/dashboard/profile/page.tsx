"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/actions/profile";
import { EmployeeProfileView } from "@/components/employee-profile-view";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const result = await getMyProfile(user.id);
      if (result.success && result.data) {
        setProfile(result.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <EmployeeProfileView
      profile={profile}
      isAdmin={profile.role === "admin"}
      readOnly={false}
      onSave={loadProfile}
    />
  );
}
