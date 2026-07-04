"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, CheckCircle2, Clock, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LeavesPage() {
  const [leaveType, setLeaveType] = useState("Paid");
  const [startDate, setStartDate] = useState("2026-08-12");
  const [endDate, setEndDate] = useState("2026-08-14");
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
    </>
  );
}
