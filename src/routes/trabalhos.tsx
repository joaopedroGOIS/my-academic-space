import { createFileRoute } from "@tanstack/react-router";
import { Calendar, ClipboardList, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/trabalhos/StatusBadge";
import { TrabalhoDetalhe } from "@/components/trabalhos/TrabalhoDetalhe";
import { TrabalhoForm, type TrabalhoFormValues } from "@/components/trabalhos/TrabalhoForm";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import { Button } from "@/components/ui/button";
import { useMaterias, useTrabalhos } from "@/lib/academicStorage";
import { formatPrazo } from "@/lib/trabalhosUtils";

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
  const { items: materias } = useMaterias();
  const { items: trabalhos, add, update, remove, addMaterial, removeMaterial } = useTrabalhos();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  const selected = useMemo(
    () => trabalhos.find((t) => t.id === selectedId) ?? null,
    [trabalhos, selectedId],
  );

  const initialValues: TrabalhoFormValues | undefined =
    formMode === "edit" && selected
      ? {
          nome: selected.nome,
          tipo: selected.tipo,
          materiaId: selected.materiaId,
          materiaNome: selected.materiaNome,
          prazo: selected.prazo ?? "",
          progresso: selected.progresso,
        }
      : undefined;

  const handleSubmit = (values: TrabalhoFormValues) => {
    if (formMode === "create") {
      const created = add(values);
      setSelectedId(created.id);
    } else if (selected) {
      update(selected.id, values);
    }
    setFormOpen(false);
  };

  if (selected) {
    return (
      <PageContainer>
        <TrabalhoDetalhe
          trabalho={selected}
          onBack={() => setSelectedId(null)}
          onEdit={() => {
            setFormMode("edit");
            setFormOpen(true);
          }}
          onDelete={() => {
            remove(selected.id);
            setSelectedId(null);
          }}
          onProgressChange={(value) => update(selected.id, { progresso: value })}
          onAddMaterial={(material) => addMaterial(selected.id, material)}
          onRemoveMaterial={(materialId) => removeMaterial(selected.id, materialId)}
        />
        <TrabalhoForm
          open={formOpen}
          mode={formMode}
          materias={materias}
          initial={initialValues}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmit}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={ClipboardList}
        title="Trabalhos e Tarefas"
        description="Entregas e prazos"
        action={
          <Button
            type="button"
            className="shrink-0"
            aria-label="Novo trabalho ou tarefa"
            onClick={() => {
              setFormMode("create");
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            <span>Novo</span>
          </Button>
        }
      />

      {trabalhos.length > 0 ? (
        <div className="space-y-3">
          {trabalhos.map((task) => {
            const prazo = formatPrazo(task.prazo);
            return (
              <article key={task.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(task.id)}
                  className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-primary/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[15px] font-semibold text-foreground">{task.nome}</h2>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {task.tipo} • {task.materiaNome}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      {prazo && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="size-3.5" aria-hidden />
                          Entrega: {prazo}
                        </span>
                      )}
                      <StatusBadge progresso={task.progresso} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={task.progresso} />
                    <span className="w-[92px] shrink-0 text-right text-xs font-semibold text-primary">
                      {task.progresso}% concluído
                    </span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-xl">📌</div>
          <p className="mt-4 text-sm font-semibold text-foreground">Nenhum trabalho ou tarefa encontrado.</p>
          <p className="mt-1 text-sm text-muted-foreground">Clique em &quot;Novo&quot; para adicionar seu primeiro item.</p>
        </div>
      )}

      <TrabalhoForm
        open={formOpen}
        mode={formMode}
        materias={materias}
        initial={initialValues}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
