"use client";

import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Testimonials() {
  const testimonials = [
    {
      name: "Wade Warren",
      company: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      initials: "WW",
    },
    {
      name: "Samual Rants",
      company: "ScaleCorp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      initials: "SR",
    },
    {
      name: "Jonathon S.",
      company: "ByteSize",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
      initials: "JS",
    },
    {
      name: "Max Amini",
      company: "ApexSolutions",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
      initials: "MA",
    },
    {
      name: "Glan Phillips",
      company: "CloudNine",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
      initials: "GP",
    },
    {
      name: "Park J. Sung",
      company: "GlobalGrowth",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      initials: "PS",
    },
  ];

  const quoteText =
    "HrFlow has completely transformed our HR operations. We've saved countless hours by automating tasks, and our team collaboration has never been better!";

  return (
    <section className="w-full bg-[#f8fafc] py-20 md:py-24 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light mb-3">
            Customer feedback
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-tight">
            Trusted by HR Teams Across Industries
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Here's what business owners, HR professionals, and employees are saying about using HrFlow.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-0.5 text-amber-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-600 italic leading-relaxed mb-6 font-sans">
                "{quoteText}"
              </p>

              {/* Profile info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <Avatar className="size-10 border border-gray-100">
                  <AvatarImage src={item.avatar} alt={item.name} />
                  <AvatarFallback className="font-extrabold text-xs bg-brand-navy-dark text-white">
                    {item.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-black text-brand-navy-dark leading-none">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">{item.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <Button
          className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-8 py-6 text-base border-0 shadow-lg shadow-brand-lime/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          View All Testimonials
        </Button>
      </div>
    </section>
  );
}
