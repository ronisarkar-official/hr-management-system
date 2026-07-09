"use client";

import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navy Gradient Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-navy-dark via-brand-navy-mid to-brand-navy-light rounded-[2rem] md:rounded-[3rem] px-6 py-16 md:py-24 text-center shadow-xl shadow-brand-navy-dark/10">
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-lime/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Card Content */}
          <div className="max-w-3xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              From Hire to Retire<br />We've Got You Covered
            </h2>
            <p className="text-sm md:text-base text-white/70 max-w-xl leading-relaxed font-sans">
              Streamline employee onboarding, payroll allocations, attendance approvals, and leave management. All within one secure, automated platform.
            </p>

            <div className="pt-4">
              <Button
                asChild
                className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-8 py-6 text-base border-0 shadow-lg shadow-brand-lime/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="size-4 fill-current text-brand-navy-dark" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
