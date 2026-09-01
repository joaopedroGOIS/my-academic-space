import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cronometro")({
  head: () => ({
    meta: [
      { title: "Cronômetro — Meu Espaço Acadêmico" },
      { name: "description", content: "Defina blocos de tempo e mantenha o foco durante suas sessões de estudo." },
      { property: "og:title", content: "Cronômetro — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Defina blocos de tempo e mantenha o foco durante suas sessões de estudo." },
    ],
  }),
  component: CronometroPage,
});

const presets = [15, 25, 45, 60, 90];

function CronometroPage() {
  const [minutes, setMinutes] = useState(25);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-card px-6 py-16 lg:min-h-screen">
      <p className="text-sm text-muted-foreground">Defina seu tempo de estudo</p>

      <p className="mt-6 font-semibold tabular-nums leading-none tracking-tight text-foreground text-[5rem] sm:text-[8rem]">
        {String(minutes).padStart(2, "0")}:00
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setMinutes(preset)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              minutes === preset
                ? "border-primary bg-accent text-primary"
                : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {preset} min
          </button>
        ))}
      </div>

      <Button size="lg" className="mt-10 gap-2 rounded-full px-10 tracking-wide">
        <Play className="size-4 fill-current" />
        INICIAR
      </Button>
    </div>
  );
}
