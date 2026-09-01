import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Star,
  LayoutGrid,
  Zap,
  History,
  CalendarDays,
  Target,
  Plus,
  Paperclip,
  Play,
  NotebookPen,
  FileText,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { SurfaceCard } from "@/components/ui-kit/SurfaceCard";
import { ModuleTile } from "@/components/ui-kit/ModuleTile";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import { MonthCalendar, MONTHS } from "@/components/ui-kit/MonthCalendar";
import { Button } from "@/components/ui/button";
import { modules, favoriteKeys, getModule } from "@/data/modules";
import { recentActivities, inProgress, eventDays } from "@/data/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meu Espaço Acadêmico — Painel de estudos" },
      {
        name: "description",
        content:
          "Painel pessoal para organizar faculdade, matérias, anotações, trabalhos e sessões de estudo.",
      },
      { property: "og:title", content: "Meu Espaço Acadêmico — Painel de estudos" },
      {
        property: "og:description",
        content:
          "Painel pessoal para organizar faculdade, matérias, anotações, trabalhos e sessões de estudo.",
      },
    ],
  }),
  component: HomePage,
});

const quickActions = [
  { label: "Nova anotação", icon: Plus, to: "/anotacoes", primary: true },
  { label: "Adicionar material", icon: Paperclip, to: "/materias", primary: false },
  { label: "Iniciar estudo", icon: Play, to: "/cronometro", primary: false },
];

const activityIcon = {
  nota: NotebookPen,
  material: FileText,
  tarefa: ClipboardList,
};

function HomePage() {
  const today = new Date();
  const favorites = favoriteKeys.map(getModule);
  const otherModules = modules.filter((m) => m.key !== "home");

  return (
    <PageContainer>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Meu Espaço Acadêmico
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo o que você precisa para a faculdade em um só lugar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        {/* Coluna esquerda */}
        <div className="space-y-6">
          <SurfaceCard title="Favoritos" icon={Star} bodyClassName="p-3 space-y-2">
            {favorites.map((m) => (
              <ModuleTile key={m.key} module={m} />
            ))}
          </SurfaceCard>

          <SurfaceCard title="Todos os módulos" icon={LayoutGrid} bodyClassName="p-3">
            <div className="grid grid-cols-3 gap-2 xl:grid-cols-2">
              {otherModules.map((m) => (
                <ModuleTile key={m.key} module={m} variant="tile" />
              ))}
            </div>
          </SurfaceCard>
        </div>

        {/* Área central */}
        <div className="space-y-6">
          <SurfaceCard title="Ações rápidas" icon={Zap}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  asChild
                  variant={action.primary ? "default" : "outline"}
                  className="h-auto justify-start gap-3 py-3"
                >
                  <Link to={action.to}>
                    <action.icon className="size-4 shrink-0" />
                    <span className="truncate">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard title="Atividades recentes" icon={History} bodyClassName="p-2">
            <ul className="divide-y divide-border">
              {recentActivities.map((item) => {
                const Icon = activityIcon[item.type];
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent">
                      <Icon className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </li>
                );
              })}
            </ul>
          </SurfaceCard>
        </div>

        {/* Coluna direita */}
        <div className="space-y-6">
          <SurfaceCard
            title={`${MONTHS[today.getMonth()]} ${today.getFullYear()}`}
            icon={CalendarDays}
            bodyClassName="p-4"
          >
            <MonthCalendar
              year={today.getFullYear()}
              month={today.getMonth()}
              today={today}
              eventDays={eventDays}
            />
            <Link
              to="/calendario"
              className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
            >
              Ver calendário completo
              <ChevronRight className="size-4" />
            </Link>
          </SurfaceCard>

          <SurfaceCard title="Em progresso" icon={Target} bodyClassName="space-y-5 p-5">
            {inProgress.map((item) => (
              <div key={item.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <span className="shrink-0 text-xs font-semibold text-primary">
                    {item.progress}%
                  </span>
                </div>
                <ProgressBar value={item.progress} className="mt-2" />
                {item.deadline && (
                  <p className="mt-1.5 text-xs text-muted-foreground">{item.deadline}</p>
                )}
              </div>
            ))}
          </SurfaceCard>
        </div>
      </div>
    </PageContainer>
  );
}
