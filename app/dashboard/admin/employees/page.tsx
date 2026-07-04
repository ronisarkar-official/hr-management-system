"use client";

import React, { useState } from "react";
import { Users, Search, Plus, Filter, MoreHorizontal, Mail, Briefcase, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SAMPLE_EMPLOYEES = [
  { id: "EMP-1001", name: "Sarah Jenkins", email: "sarah.j@organization.com", dept: "Engineering", role: "Senior Software Engineer", status: "Active" },
  { id: "EMP-1002", name: "Mark Taylor", email: "mark.t@organization.com", dept: "Sales & Marketing", role: "Account Executive", status: "Active" },
  { id: "EMP-1003", name: "Alex Rivera", email: "alex.r@organization.com", dept: "Engineering", role: "VP of Engineering", status: "Active" },
  { id: "EMP-1004", name: "Elena Rostova", email: "elena.r@organization.com", dept: "Human Resources", role: "HR Specialist", status: "Active" },
  { id: "EMP-1005", name: "David Chen", email: "david.c@organization.com", dept: "Product", role: "Product Manager", status: "On Leave" },
];

export default function AdminEmployeesPage() {
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_EMPLOYEES.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    
  );
}
