import { useEffect, useRef } from "react";
import { Check, Loader2 } from "lucide-react";

import { EditorToolbar } from "./EditorToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Nota } from "@/lib/notesStorage";

export type SaveStatus = "idle" | "saving" | "saved";

interface Materia {
  id: string;
  nome: string;
}

interface NoteEditorProps {
  nota: Nota;
  materias: Materia[];
  status: SaveStatus;
  onChange: (patch: Partial<Omit<Nota, "id">>) => void;
}

export function NoteEditor({ nota, materias, status, onChange }: NoteEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Sincroniza o HTML apenas quando a anotação selecionada muda:
  // reescrever a cada tecla destruiria o cursor do usuário.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = nota.conteudo;
  }, [nota.id]);

  const runCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    try {
      document.execCommand(command, false, value);
    } catch {
      return;
    }
    if (editorRef.current) onChange({ conteudo: editorRef.current.innerHTML });
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-card">
      <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <input
            value={nota.titulo}
            onChange={(event) => onChange({ titulo: event.target.value })}
            aria-label="Título da anotação"
            placeholder="Título da anotação"
            className="w-full bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <div className="mt-1 flex items-center gap-2">
            <Select
              value={nota.materiaId ?? "none"}
              onValueChange={(value) => onChange({ materiaId: value === "none" ? null : value })}
            >
              <SelectTrigger
                aria-label="Matéria relacionada"
                className="h-7 w-auto gap-1 border-0 bg-transparent px-1 text-xs text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-primary"
              >
                <SelectValue placeholder="Sem matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem matéria</SelectItem>
                {materias.map((materia) => (
                  <SelectItem key={materia.id} value={materia.id}>
                    {materia.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <span
          aria-live="polite"
          className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
        >
          {status === "saving" ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Salvando...
            </>
          ) : status === "saved" ? (
            <>
              <Check className="size-3.5 text-primary" /> Salvo
            </>
          ) : null}
        </span>
      </header>

      <EditorToolbar onCommand={runCommand} />

      <div className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Conteúdo da anotação"
          onInput={(event) => onChange({ conteudo: event.currentTarget.innerHTML })}
          data-placeholder="Comece a escrever sua anotação..."
          className="note-surface mx-auto min-h-[60vh] w-full max-w-3xl rounded-2xl border border-border bg-card px-6 py-8 text-[15px] leading-8 text-foreground shadow-sm outline-none transition-shadow duration-200 focus-visible:shadow-md sm:px-10"
        />
      </div>
    </section>
  );
}
