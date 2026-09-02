import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clampProgresso, type Materia, type TrabalhoTipo } from "@/lib/academicStorage";

export interface TrabalhoFormValues {
  nome: string;
  tipo: TrabalhoTipo;
  materiaId: string;
  materiaNome: string;
  prazo: string;
  progresso: number;
}

interface TrabalhoFormProps {
  open: boolean;
  mode: "create" | "edit";
  materias: Materia[];
  initial?: TrabalhoFormValues | undefined;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TrabalhoFormValues) => void;
}

const EMPTY: TrabalhoFormValues = {
  nome: "",
  tipo: "Trabalho",
  materiaId: "",
  materiaNome: "",
  prazo: "",
  progresso: 0,
};

export function TrabalhoForm({ open, mode, materias, initial, onOpenChange, onSubmit }: TrabalhoFormProps) {
  const [values, setValues] = useState<TrabalhoFormValues>(initial ?? EMPTY);
  const [errors, setErrors] = useState<{ nome?: string; materia?: string }>({});

  useEffect(() => {
    if (open) {
      setValues(initial ?? EMPTY);
      setErrors({});
    }
  }, [open, initial]);

  const handleSubmit = () => {
    const nextErrors: { nome?: string; materia?: string } = {};
    if (!values.nome.trim()) nextErrors.nome = "Informe o nome";
    if (!values.materiaId) nextErrors.materia = "Selecione a matéria";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    const materiaNome = materias.find((m) => m.id === values.materiaId)?.nome ?? values.materiaNome;
    onSubmit({
      ...values,
      nome: values.nome.trim(),
      materiaNome,
      progresso: clampProgresso(values.progresso),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Novo trabalho ou tarefa" : "Editar trabalho ou tarefa"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="trab-nome">Nome</Label>
            <Input
              id="trab-nome"
              placeholder="Ex: Trabalho de Marketing"
              value={values.nome}
              onChange={(e) => setValues((v) => ({ ...v, nome: e.target.value }))}
            />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select value={values.tipo} onValueChange={(v) => setValues((s) => ({ ...s, tipo: v as TrabalhoTipo }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Tarefa">Tarefa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Matéria</Label>
            <Select value={values.materiaId} onValueChange={(v) => setValues((s) => ({ ...s, materiaId: v }))}>
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
            <Input
              id="trab-prazo"
              type="date"
              value={values.prazo ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, prazo: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">Opcional — pode criar sem prazo</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trab-progresso">Progresso</Label>
            <div className="flex items-center gap-2">
              <Input
                id="trab-progresso"
                type="number"
                min={0}
                max={100}
                value={values.progresso}
                onChange={(e) => setValues((v) => ({ ...v, progresso: clampProgresso(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button type="button" onClick={handleSubmit}>{mode === "create" ? "Criar" : "Salvar alterações"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
