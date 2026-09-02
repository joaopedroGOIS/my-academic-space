import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";

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
          <Button type="button" className="shrink-0" aria-label="Novo trabalho ou tarefa">
            <Plus className="size-4" />
            <span>+ Novo</span>
          </Button>
        }
      />

      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task: any) => {
            const tipo = task.type ?? task.kind ?? (String(task.title).toLowerCase().includes("tarefa") ? "Tarefa" : "Trabalho");
            const materia = task.subject ?? "Marketing";
            const prazo = task.deadline ?? "15/09/2026";
            const progresso = task.progress ?? 70;
            return (
              <article
                key={task.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-semibold text-foreground">{task.title}</h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{tipo} • {materia}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <span aria-hidden>📅</span>
                    <span>Entrega: {prazo}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={progresso} />
                  <span className="w-[88px] shrink-0 text-right text-xs font-semibold text-primary">{progresso}% concluído</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-xl">📌</div>
          <p className="mt-4 text-sm font-semibold text-foreground">Nenhum trabalho ou tarefa encontrado.</p>
          <p className="mt-1 text-sm text-muted-foreground">Clique em "+ Novo" para adicionar seu primeiro item.</p>
        </div>
      )}
    </PageContainer>
  );
}
