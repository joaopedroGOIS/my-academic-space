import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/BackButton";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ icon: Icon, title, description, action }: PageHeaderProps) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
        <BackButton label={title} />
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-primary" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      {action}
    </header>
  );
}
