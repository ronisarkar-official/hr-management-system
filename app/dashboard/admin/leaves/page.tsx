"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const INITIAL_REQUESTS = [
  { id: "LR-201", name: "Sarah Jenkins", empId: "EMP-1001", dept: "Engineering", type: "Sick Leave", dates: "Aug 12 - Aug 14, 2026", days: 3, reason: "Viral fever and doctor advice", status: "Pending" },
  { id: "LR-202", name: "Mark Taylor", empId: "EMP-1002", dept: "Sales & Marketing", type: "Paid Leave", dates: "Aug 20 - Aug 21, 2026", days: 2, reason: "Family wedding out of town", status: "Pending" },
  { id: "LR-203", name: "Elena Rostova", empId: "EMP-1004", dept: "Human Resources", type: "Unpaid Leave", dates: "Sep 01, 2026", days: 1, reason: "Personal emergency", status: "Pending" },
  { id: "LR-204", name: "David Chen", empId: "EMP-1005", dept: "Product", type: "Paid Leave", dates: "Jul 01 - Jul 05, 2026", days: 5, reason: "Summer vacation", status: "Approved" },
];

export default function AdminLeavesPage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleAction = (id: string, newStatus: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <></>
  );
}
