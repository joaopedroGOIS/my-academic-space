import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { statusDoProgresso } from "@/lib/academicStorage";

export function StatusBadge({ progresso, className }: { progresso: number; className?: string }) {
  const status = statusDoProgresso(progresso);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        status === "Concluído" && "border-primary/20 bg-accent text-primary",
        status === "Em andamento" && "border-border bg-muted text-foreground",
        status === "Não iniciado" && "border-border bg-card text-muted-foreground",
        className,
      )}
    >
      {status === "Concluído" && <Check className="size-3" aria-hidden />}
      {status}
    </span>
  );
}
