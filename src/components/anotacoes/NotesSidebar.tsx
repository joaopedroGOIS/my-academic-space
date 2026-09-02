import { BookOpen, NotebookPen, Plus, Search, Trash2 } from "lucide-react";

import { BackButton } from "@/components/layout/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Nota } from "@/lib/notesStorage";

export interface NotesGroup {
  materiaId: string | null;
  materiaNome: string;
  notas: Nota[];
}

interface NotesSidebarProps {
  groups: NotesGroup[];
  query: string;
  onQueryChange: (value: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function NotesSidebar({
  groups,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  onCreate,
  onDelete,
}: NotesSidebarProps) {
  return (
    <aside className="flex shrink-0 flex-col border-b border-border bg-card lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <BackButton label="Anotações" />
          <NotebookPen className="size-4 shrink-0 text-primary" />
          <h1 className="text-sm font-semibold text-foreground">Anotações</h1>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Pesquisar anotações"
            aria-label="Pesquisar anotações"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4 lg:max-h-none max-h-72">
        {groups.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-muted-foreground">
            Nenhuma anotação encontrada.
          </p>
        ) : (
          groups.map((group) => (
            <div key={group.materiaId ?? "sem-materia"}>
              <p className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BookOpen className="size-3.5" />
                {group.materiaNome}
              </p>
              <ul className="mt-2 space-y-1">
                {group.notas.map((nota) => (
                  <li key={nota.id} className="group/item flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onSelect(nota.id)}
                      className={cn(
                        "flex min-w-0 flex-1 items-center rounded-lg px-2.5 py-2 text-left text-sm transition-all duration-200 hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                        selectedId === nota.id
                          ? "bg-accent font-medium text-primary"
                          : "text-foreground",
                      )}
                    >
                      <span className="truncate">{nota.titulo || "Sem título"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(nota.id)}
                      aria-label={`Excluir ${nota.titulo || "anotação"}`}
                      className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 group-hover/item:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border p-4">
        <Button onClick={onCreate} className="w-full transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm">
          <Plus className="size-4" />
          Nova anotação
        </Button>
      </div>
    </aside>
  );
}
