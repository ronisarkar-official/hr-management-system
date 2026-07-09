"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

export function PlatformFeatures() {
  const employees = [
    { name: "Leandro Ramirez", role: "Project Manager", status: "Active" },
    { name: "Allan Duncan", role: "Project Manager", status: "Active" },
    { name: "Wiley Escobar", role: "Project Manager", status: "Cancelled" },
    { name: "Horace Quinn", role: "Project Manager", status: "Active" },
    { name: "Mathew Walls", role: "Project Manager", status: "Active" },
    { name: "Jewel Coller", role: "Project Manager", status: "Active" },
  ];

  const workDistribution = [
    { label: "Design", value: "33%", color: "bg-orange-500", text: "text-orange-500" },
    { label: "Marketing", value: "14%", color: "bg-yellow-500", text: "text-yellow-500" },
    { label: "Development", value: "29%", color: "bg-pink-500", text: "text-pink-500" },
    { label: "Research", value: "23%", color: "bg-purple-500", text: "text-purple-500" },
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light mb-3">
            Core capabilities
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-tight">
            Everything You Need<br />in One HR Platform
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Eliminate scattered spreadsheets and separate systems. HrFlow centralizes your tools so you can focus on your people.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card: Employee Demographics */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy-dark">Employee Demographics</h3>
                  <p className="text-xs text-gray-400 mt-1">Real-time listing and status of team members</p>
                </div>
                <Link
                  href="/dashboard/employees"
                  className="flex items-center gap-1 text-xs font-bold text-brand-navy-light hover:text-brand-navy-dark transition-colors group"
                >
                  See All 
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Table */}
              <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-bold text-gray-600 h-10 px-4">Employee Name</TableHead>
                      <TableHead className="text-xs font-bold text-gray-600 h-10 px-4">Role</TableHead>
                      <TableHead className="text-xs font-bold text-gray-600 h-10 px-4 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.name} className="hover:bg-gray-50/30 border-b border-gray-100/80">
                        <TableCell className="text-xs font-bold text-gray-800 py-3 px-4">{emp.name}</TableCell>
                        <TableCell className="text-xs text-gray-500 py-3 px-4">{emp.role}</TableCell>
                        <TableCell className="py-3 px-4 text-right">
                          <Badge
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border-0 ${
                              emp.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                            }`}
                          >
                            {emp.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <strong className="text-brand-navy-dark">Team Status Summary:</strong> 5 Active managers online, 1 request cancelled this week.
              </p>
            </div>
          </div>

          {/* Right Card: Work Overview */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy-dark">Work Overview</h3>
                  <p className="text-xs text-gray-400 mt-1">Resource allocation and division across segments</p>
                </div>
                <Link
                  href="/dashboard/analytics"
                  className="flex items-center gap-1 text-xs font-bold text-brand-navy-light hover:text-brand-navy-dark transition-colors group"
                >
                  See All 
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* 2x2 Grid of metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {workDistribution.map((item) => (
                  <div key={item.label} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`size-3 rounded-full ${item.color}`} />
                      <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Segments Visual bar */}
              <div className="space-y-2 mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Visual breakdown</p>
                <div className="w-full h-4 rounded-full overflow-hidden flex">
                  <div className="h-full bg-orange-500" style={{ width: "33%" }} title="Design: 33%" />
                  <div className="h-full bg-pink-500" style={{ width: "29%" }} title="Development: 29%" />
                  <div className="h-full bg-purple-500" style={{ width: "23%" }} title="Research: 23%" />
                  <div className="h-full bg-yellow-500" style={{ width: "15%" }} title="Marketing: 15%" />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 justify-center pt-1 font-medium">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-500" /> Design (33%)</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-pink-500" /> Dev (29%)</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500" /> Research (23%)</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-yellow-500" /> Marketing (14%)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <strong className="text-brand-navy-dark">Resource Allocation:</strong> Creative & engineering make up 62% of your talent resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
