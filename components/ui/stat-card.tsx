import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
  variant?: "default" | "compact";
  className?: string;
}

export function StatCard({
  icon,
  label,
  value,
  color,
  variant = "default",
  className = "",
}: StatCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`rounded-xl border border-border bg-card transition-all duration-200 hover:shadow-md hover:border-primary/20 ${
        isCompact ? "p-4 space-y-2" : "p-4 space-y-3"
      } ${className}`}
    >
      <div
        className={`inline-flex items-center justify-center rounded-lg ${color} ${
          isCompact ? "size-9" : "size-10"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className={`font-bold ${isCompact ? "text-xl" : "text-2xl"}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
