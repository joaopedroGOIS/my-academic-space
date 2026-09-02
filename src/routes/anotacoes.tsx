import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NoteEditor, type SaveStatus } from "@/components/anotacoes/NoteEditor";
import { NotesSidebar, type NotesGroup } from "@/components/anotacoes/NotesSidebar";
import { useMaterias } from "@/lib/academicStorage";
import { useNotas, type Nota } from "@/lib/notesStorage";

export const Route = createFileRoute("/anotacoes")({
  head: () => ({
    meta: [
      { title: "Anotações — Meu Espaço Acadêmico" },
      { name: "description", content: "Escreva e organize suas anotações de aula por matéria, com editor de texto e salvamento automático." },
      { property: "og:title", content: "Anotações — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Escreva e organize suas anotações de aula por matéria, com editor de texto e salvamento automático." },
    ],
  }),
  component: AnotacoesPage,
});

function AnotacoesPage() {
  const { items: notas, hydrated, add, update, remove } = useNotas();
  const { items: materias } = useMaterias();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [createOpen, setCreateOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftMateriaId, setDraftMateriaId] = useState<string>("none");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (savedTimer.current) clearTimeout(savedTimer.current); }, []);

  const selected = notas.find((n) => n.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notas;
    return notas.filter(
      (n) => n.titulo.toLowerCase().includes(q) || n.conteudo.toLowerCase().includes(q),
    );
  }, [notas, query]);

  const groups = useMemo<NotesGroup[]>(() => {
    const byMateria = new Map<string, Nota[]>();
    for (const nota of filtered) {
      const key = nota.materiaId ?? "sem-materia";
      byMateria.set(key, [...(byMateria.get(key) ?? []), nota]);
    }
    const result: NotesGroup[] = [];
    for (const materia of materias) {
      const list = byMateria.get(materia.id);
      if (list?.length) result.push({ materiaId: materia.id, materiaNome: materia.nome, notas: list });
    }
    const orphans = filtered.filter((n) => !n.materiaId || !materias.some((m) => m.id === n.materiaId));
    if (orphans.length) result.push({ materiaId: null, materiaNome: "Sem matéria", notas: orphans });
    return result;
  }, [filtered, materias]);

  const markSaving = () => {
    setStatus("saving");
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setStatus("saved"), 600);
  };

    const handleCreate = () => {
    setDraftTitle("");
    setDraftMateriaId(materias[0]?.id ?? "none");
    setCreateOpen(true);
  };

  const handleConfirmCreate = () => {
    const materiaId = draftMateriaId === "none" ? null : draftMateriaId;
    const title = draftTitle.trim() || "Nova anotação";
    const nota = add(title, materiaId);
    setSelectedId(nota.id);
    setStatus("saved");
    setCreateOpen(false);
    // foco no editor após abrir
    setTimeout(() => {
      const el = document.querySelector("[contenteditable]") as HTMLElement | null;
      el?.focus();
    }, 100);
  };

  const handleDelete = (id: string) => {
    remove(id);
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:h-screen lg:flex-row">
      <NotesSidebar
        groups={groups}
        query={query}
        onQueryChange={setQuery}
        selectedId={selectedId}
        onSelect={(id) => { setSelectedId(id); setStatus("idle"); }}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      {selected ? (
        <NoteEditor
          nota={selected}
          materias={materias}
          status={status}
          onChange={(patch) => { update(selected.id, patch); markSaving(); }}
        />
      ) : (
        <section className="flex flex-1 items-center justify-center bg-card p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent">
              <NotebookPen className="size-6 text-primary" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {hydrated && notas.length === 0 ? "Nenhuma anotação ainda" : "Selecione uma anotação"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie uma nova anotação para começar a escrever durante a aula. Tudo é salvo
              automaticamente enquanto você digita.
            </p>
          </div>
        </section>
      )}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova anotação</DialogTitle>
            <DialogDescription>Crie uma anotação vinculada a uma matéria.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nota-titulo">Título da anotação</Label>
              <Input id="nota-titulo" placeholder="Ex: Aula 01 - Introdução" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-2">
              <Label>Matéria</Label>
              <Select value={draftMateriaId} onValueChange={setDraftMateriaId}>
                <SelectTrigger><SelectValue placeholder="Selecione a matéria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem matéria</SelectItem>
                  {materias.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {materias.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma matéria cadastrada. Cadastre em Matérias primeiro.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleConfirmCreate}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
