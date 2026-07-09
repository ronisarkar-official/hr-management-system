"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How can it benefit my business?",
      answer:
        "HrFlow helps you streamline all aspects of employee management. It centralizes employee records, automates payroll components, logs daily check-in and check-out times, tracks leave requests with balances, and keeps your hiring pipeline organized. By automating repetitive tasks, it saves your business hours of paperwork and reduces operational complexity.",
    },
    {
      question: "Is my employee data safe and secure in the system?",
      answer:
        "Yes, security is our top priority. We use industry-standard encryption for data at rest and in transit, together with secure database architectures and role-based permissions. Your sensitive employee records and payroll information are safe, protected, and fully backed up.",
    },
    {
      question: "Is the system suitable for small businesses?",
      answer:
        "Absolutely. HrFlow was designed specifically for startups, growing companies, and small-to-medium enterprises. The platform is highly intuitive, features zero-config onboarding, and focuses on essential HR needs without the bloat of traditional enterprise systems.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-20 md:py-24 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy-light mb-3">
            Got questions?
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about the HrFlow platform and features.
          </p>
        </div>

        {/* Custom FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-gray-50/70 border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-gray-50"
              >
                {/* Header/Trigger */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    {/* Numbered Prefix */}
                    <span className="text-sm font-extrabold text-brand-navy-light font-mono select-none">
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </span>
                    <span className="text-sm md:text-base font-black text-brand-navy-dark leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div className="size-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand-navy-dark shrink-0 shadow-sm transition-transform duration-200">
                    {isOpen ? (
                      <Minus className="size-3 text-brand-navy-light stroke-[3px]" />
                    ) : (
                      <Plus className="size-3 text-brand-navy-light stroke-[3px]" />
                    )}
                  </div>
                </button>

                {/* Content area */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] border-t border-gray-100/50" : "max-h-0"
                  }`}
                >
                  <div className="p-6 text-xs md:text-sm text-gray-500 leading-relaxed font-sans font-normal">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
