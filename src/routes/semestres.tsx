import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceCard } from "@/components/ui-kit/SurfaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSemestres, useCursos } from "@/lib/academicStorage";

export const Route = createFileRoute("/semestres")({
  head: () => ({
    meta: [
      { title: "Semestres — Meu Espaço Acadêmico" },
      { name: "description", content: "Acompanhe seus períodos letivos e as matérias de cada semestre." },
      { property: "og:title", content: "Semestres — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Acompanhe seus períodos letivos e as matérias de cada semestre." },
    ],
  }),
  component: SemestresPage,
});

function SemestresPage() {
  const { items, add, update, remove } = useSemestres();
  const { items: cursos } = useCursos();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [cursoId, setCursoId] = useState("");
  const openCreate = () => { setEditingId(null); setNome(""); setCursoId(cursos[0]?.id ?? ""); setOpen(true); };
  const openEdit = (id: string, n: string, cId: string) => { setEditingId(id); setNome(n); setCursoId(cId); setOpen(true); };
  const handleSave = () => {
    if (!nome.trim() || !cursoId) return;
    if (editingId) update(editingId, nome, cursoId);
    else add(nome, cursoId);
    setOpen(false); setNome(""); setEditingId(null);
  };
  const handleClose = () => { setOpen(false); setNome(""); setEditingId(null); };
  const getCursoNome = (id: string) => cursos.find((c) => c.id === id)?.nome ?? "—";
  return (
    <PageContainer>
      <PageHeader icon={CalendarRange} title="Semestres" description="Períodos letivos" action={<Button onClick={openCreate} size="icon" aria-label="Novo semestre" className="rounded-full size-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"><Plus className="size-5" /></Button>} />
      <SurfaceCard bodyClassName="p-4">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum semestre cadastrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Aqui você poderá organizar cada período letivo com datas de início, fim e matérias.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-[#EDE9FE] hover:shadow-sm hover:bg-accent/30">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{s.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{getCursoNome(s.cursoId)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEdit(s.id, s.nome, s.cursoId)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary hover:shadow-sm cursor-pointer" aria-label={`Editar ${s.nome}`}><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => remove(s.id)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label={`Excluir ${s.nome}`}><Trash2 className="size-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-[420px] bg-card">
          <DialogHeader><DialogTitle>{editingId ? "Editar semestre" : "Novo semestre"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="semestre-nome">Nome do semestre</Label>
              <Input id="semestre-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: 2025/1" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Curso relacionado</Label>
              {cursos.length === 0 ? (<p className="text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted/50">Nenhum curso cadastrado. Cadastre um curso primeiro.</p>) : (
                <Select value={cursoId} onValueChange={setCursoId}><SelectTrigger><SelectValue placeholder="Selecione o curso" /></SelectTrigger><SelectContent>{cursos.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}</SelectContent></Select>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!nome.trim() || !cursoId} className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
