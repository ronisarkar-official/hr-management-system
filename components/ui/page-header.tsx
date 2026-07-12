import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between flex-wrap gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {icon && <span className="text-muted-foreground">{icon}</span>}
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
