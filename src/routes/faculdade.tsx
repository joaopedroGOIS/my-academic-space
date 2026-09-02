import { createFileRoute } from "@tanstack/react-router";
import { Landmark, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceCard } from "@/components/ui-kit/SurfaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFaculdades } from "@/lib/academicStorage";

export const Route = createFileRoute("/faculdade")({
  head: () => ({
    meta: [
      { title: "Faculdade — Meu Espaço Acadêmico" },
      { name: "description", content: "Cadastre e organize as instituições de ensino em que você estuda." },
      { property: "og:title", content: "Faculdade — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Cadastre e organize as instituições de ensino em que você estuda." },
    ],
  }),
  component: FaculdadePage,
});

function FaculdadePage() {
  const { items, add, update, remove } = useFaculdades();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState("");

  const openCreate = () => { setEditingId(null); setNome(""); setOpen(true); };
  const openEdit = (id: string, current: string) => { setEditingId(id); setNome(current); setOpen(true); };
  const handleSave = () => {
    if (!nome.trim()) return;
    if (editingId) update(editingId, nome);
    else add(nome);
    setOpen(false); setNome(""); setEditingId(null);
  };
  const handleClose = () => { setOpen(false); setNome(""); setEditingId(null); };

  return (
    <PageContainer>
      <PageHeader
        icon={Landmark}
        title="Faculdade"
        description="Instituições de ensino"
        action={
          <Button onClick={openCreate} size="icon" aria-label="Nova faculdade" className="rounded-full size-10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm">
            <Plus className="size-5" />
          </Button>
        }
      />
      <SurfaceCard bodyClassName="p-4">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">Nenhuma faculdade cadastrada</p>
            <p className="mt-1 text-sm text-muted-foreground">Aqui você poderá listar as instituições em que estuda, com dados de contato e período.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 ease-out hover:-translate-y-[1px] hover:border-[#EDE9FE] hover:shadow-sm hover:bg-accent/30">
                <span className="truncate text-sm font-medium text-foreground">{f.nome}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEdit(f.id, f.nome)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary hover:shadow-sm cursor-pointer" aria-label={`Editar ${f.nome}`}><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => remove(f.id)} className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label={`Excluir ${f.nome}`}><Trash2 className="size-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SurfaceCard>
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-[420px] bg-card">
          <DialogHeader><DialogTitle>{editingId ? "Editar faculdade" : "Nova faculdade"}</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="faculdade-nome">Nome da faculdade</Label>
            <Input id="faculdade-nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Universidade Federal" autoFocus />
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!nome.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
