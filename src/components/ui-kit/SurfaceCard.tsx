import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SurfaceCardProps {
  title?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SurfaceCard({
  title,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: SurfaceCardProps) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="size-4 shrink-0 text-primary" />}
            <h2 className="truncate text-sm font-semibold text-foreground">{title}</h2>
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
