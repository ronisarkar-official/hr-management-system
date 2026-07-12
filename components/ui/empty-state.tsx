import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = <Inbox className="size-12" />,
  title = "No data yet",
  description = "",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex items-center justify-center size-16 rounded-full bg-muted mb-4 text-muted-foreground/60">
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
