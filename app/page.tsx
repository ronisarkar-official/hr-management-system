"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Calendar,
  CreditCard,
  Users,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  BarChart3,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <div
            className={`space-y-6 max-w-3xl transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Modern HR for modern teams
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
              Manage your people,{" "}
              <span className="text-muted-foreground/60">not paperwork.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              All-in-one HR management — employee profiles, attendance tracking,
              leave approvals, and payroll. Built for startups and growing teams.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="h-11 px-6 font-semibold">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-6 font-semibold"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-xs text-muted-foreground">
              {["No credit card required", "Free for up to 25 employees", "Setup in under 2 minutes"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Everything you need to manage HR
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              From onboarding to payroll — one platform, zero complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:border-foreground/10 transition-all duration-300 ${
                  i === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center size-10 rounded-xl bg-muted shrink-0 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <feature.icon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Up and running in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-6 -translate-x-3 z-10">
                    <ChevronRight className="size-5 text-muted-foreground/30" />
                  </div>
                )}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 h-full">
                  <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLE ACCESS ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Role-Based Access
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Two portals, one platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Card */}
            <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-muted">
                <Users className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Employee Portal</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Everything employees need, self-service.
                </p>
              </div>
              <ul className="space-y-3">
                {EMPLOYEE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="size-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Card */}
            <div className="rounded-2xl border-2 border-foreground bg-foreground text-background p-8 space-y-6">
              <div className="inline-flex items-center justify-center size-12 rounded-xl bg-background/10">
                <Shield className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">HR Admin Dashboard</h3>
                <p className="text-sm opacity-70 mb-4">
                  Full control over your entire organization.
                </p>
              </div>
              <ul className="space-y-3">
                {ADMIN_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="size-4 opacity-50 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-24 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to simplify your HR?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Create your company account in under 2 minutes. Add employees, set up
            payroll, and let your team check in from day one.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="h-11 px-8 font-semibold">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-8 font-semibold"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="size-4" />
              <span className="text-sm font-bold">HRMS Portal</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HRMS Portal. Built for the Odoo Hackathon 2026.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Static Data ─────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Users,
    title: "Employee Directory & Profiles",
    description:
      "Centralized employee records with personal details, job info, emergency contacts, bank details, skills, and certifications. Admin-controlled with field-level permissions.",
  },
  {
    icon: UserCheck,
    title: "Attendance Tracking",
    description:
      "One-click check-in/out with automatic work hours and overtime calculation. Monthly logs with stats.",
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description:
      "Apply for PTO, sick leave, or unpaid leave. Admins approve/reject with remarks. Auto-deducting balances.",
  },
  {
    icon: CreditCard,
    title: "Payroll & Salary",
    description:
      "Configurable salary structures with components (basic, HRA, allowances). Percentage-based auto-computation.",
  },
  {
    icon: Clock,
    title: "Auto Login ID Generation",
    description:
      "Every employee gets a unique Login ID in the format COMPANY_CODE + YEAR + SERIAL. No email needed to sign in.",
  },
  {
    icon: BarChart3,
    title: "Admin Analytics Dashboard",
    description:
      "Real-time stats: who's checked in, department breakdowns, leave requests pending, and total payroll at a glance.",
  },
];

const STEPS = [
  {
    title: "Create your company",
    description:
      "Sign up with your company name and code. You become the first admin — your Login ID is generated instantly.",
  },
  {
    title: "Add your team",
    description:
      "Add employees from the directory. Each gets a unique Login ID and temporary password. No invites or emails needed.",
  },
  {
    title: "Start managing",
    description:
      "Employees check in, apply for leaves, view payroll. You approve requests, set salaries, and track everything.",
  },
];

const EMPLOYEE_FEATURES = [
  "One-click daily check-in / check-out",
  "Apply for leaves with balance tracking",
  "View salary structure and payslips",
  "Edit personal profile & documents",
  "Emergency contact & bank details",
];

const ADMIN_FEATURES = [
  "Add employees with auto-generated Login IDs",
  "Approve / reject leave requests",
  "Configure salary structures & components",
  "Company-wide attendance overview",
  "Edit any employee's profile & records",
];
