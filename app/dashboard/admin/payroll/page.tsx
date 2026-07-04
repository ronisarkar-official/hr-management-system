"use client";

import React, { useState } from "react";
import { CreditCard, DollarSign, Download, CheckCircle2, Play, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAYROLL_DATA = [
  { id: "EMP-1001", name: "Sarah Jenkins", dept: "Engineering", basic: "$5,200", hra: "$2,080", deductions: "-$780", net: "$6,500", status: "Paid" },
  { id: "EMP-1002", name: "Mark Taylor", dept: "Sales & Marketing", basic: "$4,100", hra: "$1,640", deductions: "-$615", net: "$5,125", status: "Paid" },
  { id: "EMP-1003", name: "Alex Rivera", dept: "Engineering", basic: "$7,500", hra: "$3,000", deductions: "-$1,125", net: "$9,375", status: "Paid" },
  { id: "EMP-1004", name: "Elena Rostova", dept: "Human Resources", basic: "$3,800", hra: "$1,520", deductions: "-$570", net: "$4,750", status: "Paid" },
  { id: "EMP-1005", name: "David Chen", dept: "Product", basic: "$6,000", hra: "$2,400", deductions: "-$900", net: "$7,500", status: "Pending" },
];

export default function AdminPayrollPage() {
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRunPayroll = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <>
    </>
  );
}
