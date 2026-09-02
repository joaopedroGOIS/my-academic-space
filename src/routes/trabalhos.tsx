import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMaterias, useTrabalhos } from "@/lib/academicStorage";

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
  const { items: trabalhos, add } = useTrabalhos();
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"Trabalho" | "Tarefa">("Trabalho");
  const [materiaId, setMateriaId] = useState("");
  const [prazo, setPrazo] = useState("");
  const [progresso, setProgresso] = useState<number>(0);
  const [errors, setErrors] = useState<{ nome?: string; materia?: string }>({});

  const resetForm = () => {
    setNome("");
    setTipo("Trabalho");
    setMateriaId("");
    setPrazo("");
    setProgresso(0);
    setErrors({});
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) resetForm();
  };

  const handleCreate = () => {
    const nextErrors: { nome?: string; materia?: string } = {};
    if (!nome.trim()) nextErrors.nome = "Informe o nome";
    if (!materiaId) nextErrors.materia = "Selecione a matéria";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const materiaNome = materias.find((m) => m.id === materiaId)?.nome ?? "";
    const prog = Math.min(100, Math.max(0, Number(progresso) || 0));
    add({
      nome: nome.trim(),
      tipo,
      materiaId,
      materiaNome,
      prazo: prazo ? prazo : undefined,
      progresso: prog,
    });
    setOpen(false);
    resetForm();
  };

  return (
    <PageContainer>
      <PageHeader
        icon={ClipboardList}
        title="Trabalhos e Tarefas"
        description="Entregas e prazos"
        action={
          <Button type="button" className="shrink-0" aria-label="Novo trabalho ou tarefa" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            <span>+ Novo</span>
          </Button>
        }
      />

      {trabalhos.length > 0 ? (
        <div className="space-y-3">
          {trabalhos.map((task) => {
            const formatted = task.prazo ? new Date(task.prazo + "T12:00:00").toLocaleDateString("pt-BR") : null;
            return (
              <article
                key={task.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[15px] font-semibold text-foreground">{task.nome}</h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{task.tipo} • {task.materiaNome}</p>
                  </div>
                  {formatted && (
                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <span aria-hidden>📅</span>
                      <span>Entrega: {formatted}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={task.progresso} />
                  <span className="w-[88px] shrink-0 text-right text-xs font-semibold text-primary">{task.progresso}% concluído</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-xl">📌</div>
          <p className="mt-4 text-sm font-semibold text-foreground">Nenhum trabalho ou tarefa encontrado.</p>
          <p className="mt-1 text-sm text-muted-foreground">Clique em &quot;+ Novo&quot; para adicionar seu primeiro item.</p>
        </div>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Novo trabalho ou tarefa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="trab-nome">Nome</Label>
              <Input id="trab-nome" placeholder="Ex: Trabalho de Marketing" value={nome} onChange={(e) => setNome(e.target.value)} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as "Trabalho" | "Tarefa")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Trabalho">Trabalho</SelectItem><SelectItem value="Tarefa">Tarefa</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Matéria</Label>
              <Select value={materiaId} onValueChange={setMateriaId}>
                <SelectTrigger><SelectValue placeholder="Selecione a matéria" /></SelectTrigger>
                <SelectContent>
                  {materias.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Nenhuma matéria cadastrada</div>
                  ) : (
                    materias.map((m) => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
              {errors.materia && <p className="text-xs text-destructive">{errors.materia}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trab-prazo">Prazo de entrega</Label>
              <Input id="trab-prazo" type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} />
              <p className="text-xs text-muted-foreground">Opcional — pode criar sem prazo</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trab-progresso">Progresso inicial</Label>
              <div className="flex items-center gap-2">
                <Input id="trab-progresso" type="number" min={0} max={100} value={progresso} onChange={(e) => setProgresso(Number(e.target.value))} className="flex-1" />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
            <Button type="button" onClick={handleCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
