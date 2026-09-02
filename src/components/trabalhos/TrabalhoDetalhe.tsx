import { ArrowLeft, Calendar, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { MateriaisSection } from "@/components/trabalhos/MateriaisSection";
import { StatusBadge } from "@/components/trabalhos/StatusBadge";
import { ProgressBar } from "@/components/ui-kit/ProgressBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { clampProgresso, type Material, type Trabalho } from "@/lib/academicStorage";
import { formatPrazo } from "@/lib/trabalhosUtils";

interface TrabalhoDetalheProps {
  trabalho: Trabalho;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onProgressChange: (value: number) => void;
  onAddMaterial: (material: Material) => void;
  onRemoveMaterial: (materialId: string) => void;
}

export function TrabalhoDetalhe({
  trabalho,
  onBack,
  onEdit,
  onDelete,
  onProgressChange,
  onAddMaterial,
  onRemoveMaterial,
}: TrabalhoDetalheProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const prazo = formatPrazo(trabalho.prazo);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar para a lista"
            className="mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground break-words">{trabalho.nome}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {trabalho.tipo} • {trabalho.materiaNome}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge progresso={trabalho.progresso} />
              {prazo && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" aria-hidden />
                  Entrega: {prazo}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
            Excluir
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Progresso</h2>
          <span className="text-2xl font-semibold text-primary">{trabalho.progresso}%</span>
        </div>
        <ProgressBar value={trabalho.progresso} className="mt-4" />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="progresso-range" className="text-xs text-muted-foreground">
            Ajustar progresso
          </label>
          <input
            id="progresso-range"
            type="range"
            min={0}
            max={100}
            step={5}
            value={trabalho.progresso}
            onChange={(e) => onProgressChange(clampProgresso(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-primary"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              aria-label="Progresso em porcentagem"
              value={trabalho.progresso}
              onChange={(e) => onProgressChange(clampProgresso(e.target.value))}
              className="h-9 w-20 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </section>

      <MateriaisSection materiais={trabalho.materiais ?? []} onAdd={onAddMaterial} onRemove={onRemoveMaterial} />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir item</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir este trabalho ou tarefa?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDelete(false);
                onDelete();
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
