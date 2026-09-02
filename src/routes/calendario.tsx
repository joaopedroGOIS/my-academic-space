import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { PageContainer } from "@/components/layout/PageContainer";
import { SurfaceCard } from "@/components/ui-kit/SurfaceCard";
import { MonthCalendar, MONTHS } from "@/components/ui-kit/MonthCalendar";
import { Button } from "@/components/ui/button";

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

function BackButton({ children }: { children: React.ReactNode }) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
    >
      <ChevronLeft className="size-5" />
      {children}
    </Link>
  );
}

function CalendarioPage() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const shift = (delta: number) => {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
    setSelectedDay(null);
  };

    const goToday = () => {
    setCursor({ year: today.getFullYear(), month: today.getMonth() });
    setSelectedDay(today.getDate());
  };

  return (
          <PageContainer className="max-w-5xl">
      <div className="pt-1">
        <BackButton>Calendário</BackButton>
      </div>

      <SurfaceCard className="overflow-hidden" bodyClassName="p-0">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Mês anterior" onClick={() => shift(-1)} className="h-8 w-8 hover:bg-muted">
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="min-w-[140px] text-center text-sm font-semibold capitalize text-foreground sm:min-w-[180px]">
              {MONTHS[cursor.month]} {cursor.year}
            </h2>
            <Button variant="ghost" size="icon" aria-label="Próximo mês" onClick={() => shift(1)} className="h-8 w-8 hover:bg-muted">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToday} className="h-8 px-4 text-xs font-medium">
            Hoje
          </Button>
        </div>
          <div className="bg-card p-4 sm:p-6">
          <MonthCalendar
            year={cursor.year}
            month={cursor.month}
            today={today}
            selectedDay={selectedDay}
            onSelectDay={(day) => setSelectedDay((prev) => (prev === day ? null : day))}
            size="full"
          />
        </div>
      </SurfaceCard>
    </PageContainer>
  );
}
