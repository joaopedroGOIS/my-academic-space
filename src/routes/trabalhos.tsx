import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus, CalendarClock } from "lucide-react";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import { Button } from "@/components/ui/button";
import { tasks } from "@/data/mockData";

export const Route = createFileRoute("/trabalhos")({
  head: () => ({
    meta: [
      { title: "Trabalhos e Tarefas — Meu Espaço Acadêmico" },
      { name: "description", content: "Acompanhe entregas, prazos e o progresso dos seus trabalhos da faculdade." },
      { property: "og:title", content: "Trabalhos e Tarefas — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Acompanhe entregas, prazos e o progresso dos seus trabalhos da faculdade." },
    ],
  }),
  component: TrabalhosPage,
});

function TrabalhosPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={ClipboardList}
        title="Trabalhos e Tarefas"
        description="Entregas e prazos"
        action={
          <Button className="shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nova tarefa</span>
          </Button>
        }
      />

      <div className="space-y-3">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-foreground">{task.title}</h2>
                <p className="truncate text-xs text-muted-foreground">{task.subject}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="size-4" />
                {task.deadline}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={task.progress} />
              <span className="w-10 shrink-0 text-right text-xs font-semibold text-primary">
                {task.progress}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </PageContainer>
  );
}
