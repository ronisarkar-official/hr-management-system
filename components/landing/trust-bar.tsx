"use client";

import React from "react";

export function TrustBar() {
  return (
    <section className="w-full bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">
          Trusted by Over 5,100+ Trusted Partners
        </p>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center opacity-60">
          {/* Logo 1 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-indigo-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>

          {/* Logo 2 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-emerald-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 3v18M3 12h18M12 3l9 9-9 9-9-9 9-9z" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>

          {/* Logo 3 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-amber-500 fill-current" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M9 17V7l7 5-7 5z" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>

          {/* Logo 4 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-rose-500 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>

          {/* Logo 5 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-cyan-500 fill-current" viewBox="0 0 24 24">
              <path d="M4.5 16.5L12 3l7.5 13.5h-15z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 3v13.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>

          {/* Logo 6 */}
          <div className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="size-6 text-purple-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 6v12M6 12h12" />
            </svg>
            <span className="font-extrabold text-sm tracking-wider font-mono">logoipsum</span>
          </div>
        </div>
      </div>
    </section>
  );
}
