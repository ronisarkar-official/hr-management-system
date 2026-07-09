"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data12Months = [
  { name: "Jan", Rate: 160 },
  { name: "Feb", Rate: 165 },
  { name: "Mar", Rate: 170 },
  { name: "Apr", Rate: 173 },
  { name: "May", Rate: 180 },
  { name: "Jun", Rate: 185 },
  { name: "Jul", Rate: 178 },
  { name: "Aug", Rate: 182 },
  { name: "Sep", Rate: 188 },
  { name: "Oct", Rate: 190 },
  { name: "Nov", Rate: 192 },
  { name: "Dec", Rate: 189 },
];

export function AttendanceTrends() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="w-full bg-[#f8fafc] py-20 md:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading + Button */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light">
            Time & Attendance
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-[1.15]">
            Stay Ahead of Attendance Trends
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed font-sans">
            Monitor real-time check-in and check-out patterns. Identify trends over time and manage shifts smoothly to improve overall organization performance.
          </p>

          <div className="pt-2">
            <Button
              asChild
              className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-8 py-6 text-base border-0 shadow-lg shadow-brand-lime/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Attendance Reports Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition-shadow">
            {/* Header of the Card */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
              <div>
                <h3 className="text-md font-bold text-gray-900">Attendance Reports</h3>
                <p className="text-[10px] text-gray-400">12-month consolidated overview of attendance</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                Full Year <ChevronDown className="size-3" />
              </div>
            </div>

            {/* Same 4-metric Row (as in dashboard) */}
            <div className="grid grid-cols-4 gap-2 text-center bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
              {[
                { label: "Employee", val: "173", text: "text-blue-700" },
                { label: "On Time", val: "126", text: "text-emerald-700" },
                { label: "Absent", val: "21", text: "text-red-700" },
                { label: "Late", val: "06", text: "text-amber-700" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col justify-center items-center">
                  <span className={`text-base md:text-lg font-black leading-none ${item.text}`}>{item.val}</span>
                  <span className="text-[9px] font-semibold text-gray-400 mt-1">{item.label}</span>
                </div>
              ))}
            </div>

            {/* 12-Month Bar Chart */}
            <div className="h-52 w-full text-[10px] mt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data12Months} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attendanceBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.85} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.85} />
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
                    <Bar dataKey="Rate" fill="url(#attendanceBlue)" radius={[4, 4, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
