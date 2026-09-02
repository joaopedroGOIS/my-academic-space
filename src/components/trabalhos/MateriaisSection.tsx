import { Eye, FileText, Paperclip, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Material } from "@/lib/academicStorage";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

interface MateriaisSectionProps {
  materiais: Material[];
  onAdd: (material: Material) => void;
  onRemove: (materialId: string) => void;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    reader.readAsDataURL(file);
  });
}

export function MateriaisSection({ materiais, onAdd, onRemove }: MateriaisSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Material | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Material | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setErro(null);
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setErro(`Formato não suportado: ${file.name}. Use PDF, JPG, PNG ou WEBP.`);
        continue;
      }
      try {
        const dataUrl = await readAsDataUrl(file);
        onAdd({
          id: crypto.randomUUID(),
          nome: file.name,
          tipo: file.type === "application/pdf" ? "pdf" : "imagem",
          mime: file.type,
          dataUrl,
        });
      } catch {
        setErro(`Falha ao carregar ${file.name}.`);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Paperclip className="size-4 text-primary" aria-hidden />
          Materiais
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Plus className="size-4" />
          Adicionar material
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {erro && <p className="mt-3 text-xs text-destructive">{erro}</p>}

      {materiais.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Nenhum material adicionado ainda.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {materiais.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors duration-200 hover:border-primary/20 hover:bg-accent/40"
            >
              {m.tipo === "imagem" ? (
                <img src={m.dataUrl} alt={m.nome} className="size-11 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent">
                  <FileText className="size-5 text-primary" aria-hidden />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{m.nome}</p>
                <p className="text-xs uppercase text-muted-foreground">{m.tipo === "pdf" ? "PDF" : "Imagem"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button type="button" variant="ghost" size="icon" aria-label={`Visualizar ${m.nome}`} onClick={() => setViewing(m)}>
                  <Eye className="size-4" />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Remover ${m.nome}`} onClick={() => setPendingRemove(m)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={viewing !== null} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-h-[90vh] w-[95vw] overflow-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">{viewing?.nome}</DialogTitle>
          </DialogHeader>
          {viewing?.tipo === "imagem" ? (
            <img src={viewing.dataUrl} alt={viewing.nome} className="mx-auto max-h-[70vh] w-auto rounded-lg" />
          ) : viewing ? (
            <object data={viewing.dataUrl} type="application/pdf" className="h-[70vh] w-full rounded-lg border border-border">
              <p className="p-4 text-sm text-muted-foreground">
                Não foi possível exibir o PDF aqui.{" "}
                <a href={viewing.dataUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                  Abrir em nova aba
                </a>
              </p>
            </object>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingRemove !== null} onOpenChange={(v) => !v && setPendingRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover material</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja remover este material?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRemove) onRemove(pendingRemove.id);
                setPendingRemove(null);
              }}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
