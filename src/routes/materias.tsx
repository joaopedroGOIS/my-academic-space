import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceCard } from "@/components/ui-kit/SurfaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMaterias, useSemestres } from "@/lib/academicStorage";

export const Route = createFileRoute("/materias")({
  head: () => ({
    meta: [
      { title: "Matérias — Meu Espaço Acadêmico" },
      { name: "description", content: "Gerencie suas disciplinas, professores e horários de aula." },
      { property: "og:title", content: "Matérias — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Gerencie suas disciplinas, professores e horários de aula." },
    ],
  }),
  component: MateriasPage,
});

function MateriasPage() {
  const { items, add, update, remove } = useMaterias();
  const { items: semestres } = useSemestres();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const openCreate = () => { setEditingId(null); setNome(""); setSemestreId(semestres[0]?.id ?? ""); setOpen(true); };
  const openEdit = (id: string, n: string, sId: string) => { setEditingId(id); setNome(n); setSemestreId(sId); setOpen(true); };
  const handleSave = () => {
    if (!nome.trim() || !semestreId) return;
    if (editingId) update(editingId, nome, semestreId);
    else add(nome, semestreId);
    setOpen(false); setNome(""); setEditingId(null);
  };
  const handleClose = () => { setOpen(false); setNome(""); setEditingId(null); };
  const getSemestreNome = (id: string) => semestres.find((s) => s.id === id)?.nome ?? "—";
  return (
    <PageContainer>
      <PageHeader icon={BookOpen} title="Matérias" description="Disciplinas do semestre" action={<Button onClick={openCreate} size="icon" aria-label="Nova matéria" className="rounded-full size-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"><Plus className="size-5" /></Button>} />
      <SurfaceCard bodyClassName="p-4">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">Nenhuma matéria cadastrada</p>
            <p className="mt-1 text-sm text-muted-foreground">Aqui você poderá listar suas disciplinas, com professor, horário e materiais.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-[#EDE9FE] hover:shadow-sm hover:bg-accent/30">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{m.nome}</p>
                  <p className="truncate text-xs text-muted-foreground">{getSemestreNome(m.semestreId)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEdit(m.id, m.nome, m.semestreId)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary hover:shadow-sm cursor-pointer" aria-label={`Editar ${m.nome}`}><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => remove(m.id)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label={`Excluir ${m.nome}`}><Trash2 className="size-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-[420px] bg-card">
          <DialogHeader><DialogTitle>{editingId ? "Editar matéria" : "Nova matéria"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="materia-nome">Nome da matéria</Label>
              <Input id="materia-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Economia I" autoFocus />
            </div>
            <div className="space-y-2">
              <Label>Semestre relacionado</Label>
              {semestres.length === 0 ? (<p className="text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted/50">Nenhum semestre cadastrado. Cadastre um semestre primeiro.</p>) : (
                <Select value={semestreId} onValueChange={setSemestreId}><SelectTrigger><SelectValue placeholder="Selecione o semestre" /></SelectTrigger><SelectContent>{semestres.map((s) => (<SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>))}</SelectContent></Select>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!nome.trim() || !semestreId} className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
