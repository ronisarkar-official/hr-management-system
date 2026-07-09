"use client";

import React from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { PlatformFeatures } from "@/components/landing/platform-features";
import { GrowthEngine } from "@/components/landing/growth-engine";
import { AttendanceTrends } from "@/components/landing/attendance-trends";
import { StepByStep } from "@/components/landing/step-by-step";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* Navbar overlay */}
      <Navbar />

      {/* Hero Section (includes gradient and mockup) */}
      <Hero />

      {/* Trust Bar */}
      <TrustBar />

      {/* Core Capabilities - "Everything You Need in One HR Platform" */}
      <PlatformFeatures />

      {/* "Transform HR Into A Growth Engine" */}
      <GrowthEngine />

      {/* "Stay Ahead of Attendance Trends" */}
      <AttendanceTrends />

      {/* "Manage Your Team with Ease Step by Step" */}
      <StepByStep />

      {/* "Trusted by HR Teams Across Industries" — Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <Footer />
    </main>
  );
}
