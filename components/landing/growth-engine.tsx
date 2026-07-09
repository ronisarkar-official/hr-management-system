"use client";

import React from "react";
import Link from "next/link";
import { Check, TrendingUp, Users, CreditCard, UserCheck, Briefcase } from "lucide-react";

export function GrowthEngine() {
  const stats = [
    {
      label: "Total Employees",
      value: "190",
      change: "+2%",
      positive: true,
      icon: Users,
      color: "text-blue-500 bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: "$24,753",
      change: "+16%",
      positive: true,
      icon: CreditCard,
      color: "text-emerald-500 bg-emerald-50",
    },
    {
      label: "Attendance Rate",
      value: "89%",
      change: "+12%",
      positive: true,
      icon: UserCheck,
      color: "text-orange-500 bg-orange-50",
    },
    {
      label: "Job Applicant",
      value: "300",
      change: "+3%",
      positive: true,
      icon: Briefcase,
      color: "text-purple-500 bg-purple-50",
    },
  ];

  const checklist = [
    "Track workforce growth and team demographics dynamically.",
    "Keep an eye on business performance and payroll structures.",
    "Measure productivity and optimize daily attendance rates.",
    "Stay updated on hiring trends and recruitment progress.",
  ];

  return (
    <section className="w-full bg-white py-20 md:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: 2x2 Stat Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} transition-colors`}>
                  <stat.icon className="size-5" />
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  <TrendingUp className="size-3" />
                  {stat.change}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400">{stat.label}</p>
                <p className="text-2xl font-black text-brand-navy-dark">{stat.value}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-gray-500 hover:text-brand-navy-dark flex items-center gap-1 transition-colors group-hover:text-brand-navy-light"
                >
                  Details
                  <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: H2 + Checklist */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light">
            Business performance
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-[1.15]">
            Transform HR Into A Growth Engine
          </h2>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            A healthy business starts with a healthy workforce. HrFlow helps you monitor key metrics so you can scale your operations and drive growth.
          </p>

          {/* Checklist */}
          <ul className="space-y-4 pt-2">
            {checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-gray-700 font-sans">
                <span className="size-6 rounded-full bg-brand-lime flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-brand-lime/30">
                  <Check className="size-4 text-brand-navy-dark stroke-[3px]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
