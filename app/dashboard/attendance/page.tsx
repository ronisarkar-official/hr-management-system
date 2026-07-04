"use client";

import React from "react";
import { Clock, Calendar, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AttendancePage() {
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<string | null>(null);

  const toggleCheckIn = () => {
    if (!isCheckedIn) {
      setCheckInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsCheckedIn(true);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  return (
    <>
    </>
  );
}
