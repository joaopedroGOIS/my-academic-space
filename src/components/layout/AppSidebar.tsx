import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { modules } from "@/data/modules";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  showCollapseButton?: boolean;
}

export function AppSidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  showCollapseButton = true,
}: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary">
          <GraduationCap className="size-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">Meu Espaço</p>
            <p className="truncate text-xs text-muted-foreground">Acadêmico</p>
          </div>
        )}
        {!collapsed && showCollapseButton && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Recolher menu"
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <PanelLeftClose className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {modules.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.key}
              to={item.to}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
                collapsed && "justify-center px-0",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:-translate-y-[1px] hover:border hover:border-[#EDE9FE] hover:bg-muted hover:text-foreground hover:shadow-sm border border-transparent",
              )}
            >
              <item.icon className={cn("size-5 shrink-0", active && "text-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {collapsed && showCollapseButton && (
        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expandir menu"
            className="mx-auto flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
