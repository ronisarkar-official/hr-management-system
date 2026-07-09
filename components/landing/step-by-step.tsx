"use client";

import React from "react";
import { UserPlus, Cpu, BarChart3 } from "lucide-react";

export function StepByStep() {
  const steps = [
    {
      title: "Add Your Team",
      desc: "Instantly create employee accounts, assign login IDs, and set up base details. No email confirmation required.",
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      title: "Automate HR Tasks",
      desc: "Let system engines handle payroll calculations, check-in logs, and leave tracking automatically.",
      icon: Cpu,
      color: "text-emerald-600",
    },
    {
      title: "Get Insights",
      desc: "Analyze attendance rates, workforce growth metrics, and cost metrics in real time through dashboards.",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  return (
    <section className="w-full bg-white py-20 md:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light mb-3">
            Workflow steps
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-tight">
            Manage Your Team with Ease<br />Step by Step
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Get up and running in minutes. Our onboarding process is designed to be frictionless for managers and employees alike.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative bg-gradient-to-br from-brand-navy-dark via-brand-navy-mid to-[#1e3a8a] rounded-2xl p-8 text-white shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center justify-between"
            >
              {/* Step number badge */}
              <div className="absolute top-4 right-6 text-5xl font-black text-white/5 font-mono select-none">
                0{idx + 1}
              </div>

              <div className="flex flex-col items-center">
                {/* White Icon Circle */}
                <div className="size-16 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/10 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className={`size-7 ${step.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 font-sans tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
