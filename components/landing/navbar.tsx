"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Zap, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Services", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Features", href: "#" },
    { name: "Contact Us", href: "#" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo left */}
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
          <div className="size-9 rounded-xl bg-brand-lime flex items-center justify-center text-brand-navy-dark shadow-md shadow-brand-lime/20">
            <Zap className="size-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Hr<span className="text-brand-lime">Flow</span>
          </span>
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className="rounded-full text-white/80 hover:text-white hover:bg-white/10 font-semibold px-4 text-xs flex items-center gap-1.5"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="size-3.5" />
                  Dashboard
                </Link>
              </Button>
              <div className="size-8 rounded-full bg-brand-lime text-brand-navy-dark flex items-center justify-center text-xs font-black shadow-md shadow-brand-lime/25">
                {user.email?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <span className="text-xs font-semibold text-white/80 max-w-[120px] truncate">
                {user.user_metadata?.full_name || user.email}
              </span>
              <Button
                variant="ghost"
                className="rounded-full text-white/80 hover:text-white hover:bg-white/10 font-semibold px-3 text-xs flex items-center gap-1.5"
                onClick={handleSignOut}
              >
                <LogOut className="size-3.5" />
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-white hover:text-brand-lime hover:bg-white/5 font-semibold text-sm px-4 rounded-full"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-6 border-0 shadow-lg shadow-brand-lime/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/signup">Signup for free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-brand-navy-dark/95 backdrop-blur-md flex flex-col justify-center items-center gap-8">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/80 hover:text-white"
          >
            <X className="size-7" />
          </button>
          
          <nav className="flex flex-col items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-semibold text-white/80 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col items-center gap-4 w-full px-10">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  <div className="size-9 rounded-full bg-brand-lime text-brand-navy-dark flex items-center justify-center text-sm font-black">
                    {user.email?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-bold text-white">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <Button
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/10 text-white hover:bg-white/20 font-bold px-8 py-5 text-sm w-full border border-white/10"
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="rounded-full bg-transparent text-white/70 hover:text-white font-bold px-8 py-5 text-sm w-full"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="rounded-full text-white hover:text-brand-lime hover:bg-white/5 font-semibold text-base py-5 w-full"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-brand-lime text-brand-navy-dark hover:bg-brand-lime/90 font-bold px-8 py-5 text-base w-full border-0 shadow-lg shadow-brand-lime/25"
                >
                  <Link href="/signup">Signup for free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
