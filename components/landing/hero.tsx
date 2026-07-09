"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  TrendingUp,
  UserCheck,
  Play,
  ArrowRight,
  Clock,
  Search,
  Bell,
  Grid,
  Calendar,
  CreditCard,
  Settings,
  ChevronDown,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const chartData = [
  { name: "Mon", Present: 160, Absent: 30 },
  { name: "Tue", Present: 172, Absent: 18 },
  { name: "Wed", Present: 175, Absent: 15 },
  { name: "Thu", Present: 168, Absent: 22 },
  { name: "Fri", Present: 165, Absent: 25 },
  { name: "Sat", Present: 40, Absent: 150 },
  { name: "Sun", Present: 20, Absent: 170 },
];

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-brand-navy-dark via-brand-navy-mid to-brand-navy-light text-white pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem]">
      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Atmospheric glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-lime/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
        {/* Banner Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md mb-8">
          <span className="size-2 rounded-full bg-brand-lime animate-pulse" />
          The New Standard in HR Management
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl font-sans">
          Unify Every Part Of Your{" "}
          <span className="text-brand-lime bg-gradient-to-r from-brand-lime to-lime-300 bg-clip-text text-transparent">
            HR Process
          </span>{" "}
          In One Platform
        </h1>

        {/* Subheading */}
        <p className="text-md sm:text-lg md:text-xl text-white/70 mt-6 max-w-2xl leading-relaxed font-sans font-normal">
          A Modern HR Solution Designed To Save Time, Reduce Complexity, And Empower Your People.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Button
            asChild
            className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-8 py-6 text-base border-0 shadow-xl shadow-brand-lime/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <Link href="/signup">
              Start Free Trial
              <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="rounded-full border border-white/20 text-white hover:bg-white/10 font-bold px-8 py-6 text-base transition-all"
          >
            <Link href="#demo" className="flex items-center gap-2">
              <Play className="size-4 fill-current text-white" />
              Try Demo
            </Link>
          </Button>
        </div>

        {/* Dashboard Mockup Screenshot Frame */}
        <div className="w-full max-w-5xl mt-16 md:mt-24 transition-all duration-1000 ease-out translate-y-0 opacity-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-white/10 p-2 md:p-3 overflow-hidden backdrop-blur-md shadow-black/40">
            {/* Browser top-bar */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-yellow-400" />
                <span className="size-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-gray-100/80 rounded-md px-10 py-1 text-[11px] text-gray-400 font-medium font-mono select-none">
                app.hrflow.com/dashboard
              </div>
              <div className="w-10" />
            </div>

            {/* Dashboard Workspace */}
            <div className="grid grid-cols-12 bg-gray-50/70 text-gray-800 rounded-b-xl overflow-hidden min-h-[500px]">
              {/* Sidebar navigation mockup */}
              <aside className="col-span-3 hidden md:flex flex-col border-r border-gray-100 bg-white p-4 justify-between text-left">
                <div className="space-y-6">
                  {/* Brand logo inside dashboard */}
                  <div className="flex items-center gap-2 px-2">
                    <div className="size-7 rounded-lg bg-brand-lime flex items-center justify-center text-brand-navy-dark shadow-sm">
                      <Zap className="size-4 fill-current" />
                    </div>
                    <span className="text-sm font-bold text-brand-navy-dark">HrFlow</span>
                  </div>

                  {/* Nav list */}
                  <nav className="space-y-1">
                    {[
                      { icon: Grid, label: "Overview", active: true },
                      { icon: Users, label: "Employees" },
                      { icon: Calendar, label: "Leave Requests" },
                      { icon: CreditCard, label: "Payroll Structure" },
                      { icon: Clock, label: "Time Tracking" },
                      { icon: Settings, label: "Settings" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-left ${
                          item.active
                            ? "bg-brand-navy-dark text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-3 px-2">
                  <div className="size-8 rounded-full bg-brand-navy-dark text-white flex items-center justify-center text-xs font-bold">
                    F
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-800 leading-none">Roni Sarkar</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 truncate">admin@hrflow.com</p>
                  </div>
                </div>
              </aside>

              {/* Main dashboard content area */}
              <main className="col-span-12 md:col-span-9 p-4 md:p-6 text-left flex flex-col gap-5 overflow-x-hidden">
                {/* Dashboard top header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Dashboard Overview</h2>
                    <p className="text-[11px] text-gray-500">Hi Fahim, Welcome back!</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2 size-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search anything..."
                        disabled
                        className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] w-40 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-500 relative cursor-not-allowed">
                      <Bell className="size-3.5" />
                      <span className="absolute top-1 right-1 size-1.5 bg-red-500 rounded-full" />
                    </button>
                  </div>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Total Employees", val: "190", icon: Users, color: "bg-blue-50 text-blue-600" },
                    { label: "Total Revenue", val: "$24,753", icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Attendance Rate", val: "89%", icon: UserCheck, color: "bg-orange-50 text-orange-600" },
                    { label: "Job Applicant", val: "300", icon: Briefcase, color: "bg-purple-50 text-purple-600" },
                  ].map((card) => (
                    <div key={card.label} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-gray-400">{card.label}</p>
                        <p className="text-base font-extrabold text-gray-800 leading-none">{card.val}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${card.color}`}>
                        <card.icon className="size-4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4-Metric Row & Chart Area Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left stats row (as a card stack) */}
                  <div className="lg:col-span-1 bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col justify-between">
                    <p className="text-xs font-bold text-gray-800 mb-3">Today's Attendance Status</p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      {[
                        { label: "Employee", val: "173", border: "border-blue-100 bg-blue-50/30 text-blue-700" },
                        { label: "On Time", val: "126", border: "border-emerald-100 bg-emerald-50/30 text-emerald-700" },
                        { label: "Absent", val: "21", border: "border-red-100 bg-red-50/30 text-red-700" },
                        { label: "Late", val: "06", border: "border-amber-100 bg-amber-50/30 text-amber-700" },
                      ].map((item) => (
                        <div key={item.label} className={`border p-2.5 rounded-lg flex flex-col justify-center items-center ${item.border}`}>
                          <span className="text-lg font-black leading-none">{item.val}</span>
                          <span className="text-[9px] font-medium text-gray-500 mt-1">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart area */}
                  <div className="lg:col-span-2 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-800">Attendance Statistics</p>
                        <p className="text-[9px] text-gray-400">Weekly breakdown of presence vs absence</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                        This Week <ChevronDown className="size-3" />
                      </div>
                    </div>

                    <div className="h-40 w-full text-[10px]">
                      {mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <defs>
                              <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                              </linearGradient>
                              <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.4} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#9ca3af" />
                            <YAxis tickLine={false} axisLine={false} stroke="#9ca3af" />
                            <Tooltip
                              contentStyle={{
                                fontSize: "10px",
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                            />
                            <Bar dataKey="Present" fill="url(#barBlue)" radius={[4, 4, 0, 0]} barSize={10} />
                            <Bar dataKey="Absent" fill="url(#barRed)" radius={[4, 4, 0, 0]} barSize={10} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
