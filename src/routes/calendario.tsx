import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthCalendar, MONTHS } from "@/components/ui-kit/MonthCalendar";
import { Button } from "@/components/ui/button";
import { eventDays } from "@/data/mockData";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário — Meu Espaço Acadêmico" },
      { name: "description", content: "Visualize aulas, provas e prazos de entrega em um calendário mensal." },
      { property: "og:title", content: "Calendário — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Visualize aulas, provas e prazos de entrega em um calendário mensal." },
    ],
  }),
  component: CalendarioPage,
});

function CalendarioPage() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const shift = (delta: number) => {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const isCurrentMonth =
    cursor.year === today.getFullYear() && cursor.month === today.getMonth();

  return (
    <PageContainer>
      <PageHeader
        icon={CalendarDays}
        title="Calendário"
        description="Aulas, provas e entregas"
        action={
          <Button className="shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Novo evento</span>
          </Button>
        }
      />

      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {MONTHS[cursor.month]} {cursor.year}
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="outline" size="icon" aria-label="Mês anterior" onClick={() => shift(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}
            >
              Hoje
            </Button>
            <Button variant="outline" size="icon" aria-label="Próximo mês" onClick={() => shift(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[640px]">
            <MonthCalendar
              year={cursor.year}
              month={cursor.month}
              today={today}
              eventDays={isCurrentMonth ? eventDays : []}
              size="full"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
