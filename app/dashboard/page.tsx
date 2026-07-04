"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  ArrowRight,
  Clock,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  ShieldAlert,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
  <></>
    );
  }

  const role = user?.user_metadata?.role || "employee";
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Colleague";
  const employeeId = user?.user_metadata?.employee_id || "EMP-1001";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <></>
  );
}

/* =========================================================================
   ADMIN / HR OFFICER DASHBOARD VIEW (Section 5.3)
   ========================================================================= */
function AdminDashboardView() {
  return (
   <></>
  );
}

/* =========================================================================
   EMPLOYEE DASHBOARD VIEW (Section 5.2)
   ========================================================================= */
function EmployeeDashboardView({ userName }: { userName: string }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const toggleCheckIn = () => {
    if (!isCheckedIn) {
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setCheckInTime(now);
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  return (
    <></>
  );
}