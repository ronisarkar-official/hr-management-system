"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Briefcase, Mail, Phone, MapPin, Calendar, Building, UserCheck, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Employee";
  const employeeId = user?.user_metadata?.employee_id || "EMP-1001";
  const role = user?.user_metadata?.role || "employee";
  const email = user?.email || "employee@organization.com";

  return (
    <>
    </>
  );
}
