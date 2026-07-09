"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  return (
    <footer className="bg-brand-navy-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/5">
        
        {/* Left column: Brand logo + Tagline */}
        <div className="lg:col-span-4 space-y-5">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
            <div className="size-8 rounded-lg bg-brand-lime flex items-center justify-center text-brand-navy-dark shadow-sm">
              <Zap className="size-4.5 fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              Hr<span className="text-brand-lime">Flow</span>
            </span>
          </Link>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed font-sans max-w-sm">
            HrFlow is the all-in-one HR platform designed to streamline employee data management, automate daily tasks, and track attendance trends.
          </p>
        </div>

        {/* Column 1: Company */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-brand-lime">Company</h4>
          <ul className="space-y-2">
            {["About Us", "Careers", "Testimonials", "Contact Us"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Product */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-brand-lime">Product</h4>
          <ul className="space-y-2">
            {["Features", "How It Works", "Integrations", "Security"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Support & Training */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-brand-lime">Support</h4>
          <ul className="space-y-2">
            {["Help Center", "Community", "Product Updates", "Developer API"].map((link) => (
              <li key={link}>
                <Link href="#" className="text-xs md:text-sm text-white/60 hover:text-white transition-colors">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-brand-lime">Newsletter</h4>
          <p className="text-[11px] text-white/50 leading-relaxed font-sans">
            Subscribe to get latest updates, tips and product releases.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 rounded-lg text-white placeholder:text-white/30 text-xs focus-visible:ring-1 focus-visible:ring-brand-lime h-9 w-full"
            />
            <Button
              type="submit"
              className="bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold text-xs h-9 w-full rounded-lg flex items-center justify-center gap-1.5 transition-colors border-0"
            >
              Subscribe
              <ArrowRight className="size-3.5" />
            </Button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Social Icons */}
        <div className="flex items-center gap-4 order-2 md:order-1">
          {[
            { icon: TwitterIcon, href: "#" },
            { icon: GithubIcon, href: "#" },
            { icon: LinkedinIcon, href: "#" },
            { icon: InstagramIcon, href: "#" },
          ].map((social, idx) => (
            <Link
              key={idx}
              href={social.href}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            >
              <social.icon className="size-4" />
            </Link>
          ))}
        </div>

        {/* Copyright & Legal Links */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-1 md:order-2 text-center md:text-right">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} HrFlow. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Cookies Policy", "Privacy Policy", "Terms & Conditions"].map((link) => (
              <Link
                key={link}
                href="#"
                className="text-[11px] text-white/40 hover:text-white transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
