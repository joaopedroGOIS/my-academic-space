import { Link } from "@tanstack/react-router";

import type { AppModule } from "@/data/modules";
import { cn } from "@/lib/utils";

export function ModuleTile({
  module,
  variant = "row",
}: {
  module: AppModule;
  variant?: "row" | "tile";
}) {
  if (variant === "tile") {
    return (
      <Link
        to={module.to}
        className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-colors hover:border-primary/30 hover:bg-accent"
      >
        <module.icon className="size-5 text-primary" />
        <span className="line-clamp-2 text-xs font-medium text-foreground">{module.label}</span>
      </Link>
    );
  }

  return (
    <Link
      to={module.to}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-accent",
      )}
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent">
        <module.icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{module.label}</p>
        <p className="truncate text-xs text-muted-foreground">{module.description}</p>
      </div>
    </Link>
  );
}
