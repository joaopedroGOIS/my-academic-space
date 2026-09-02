import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Check,
  CheckSquare,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Palette,
  Strikethrough,
  Underline,
} from "lucide-react";

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
  const [showHighlight, setShowHighlight] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);

  // Sincroniza o HTML apenas quando a anotação selecionada muda:
  // reescrever a cada tecla destruiria o cursor do usuário.
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = nota.conteudo;
  }, [nota.id]);

  const focusEditor = () => editorRef.current?.focus();

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    try {
      // formatBlock precisa de valor com tags
      document.execCommand(command, false, value);
    } catch {
      return;
    }
    if (editorRef.current) onChange({ conteudo: editorRef.current.innerHTML });
  };

  const handleStyleChange = (value: string) => {
    focusEditor();
    try {
      if (value === "p") document.execCommand("formatBlock", false, "<p>");
      else document.execCommand("formatBlock", false, `<${value}>`);
    } catch {}
    if (editorRef.current) onChange({ conteudo: editorRef.current.innerHTML });
  };

  const handleHighlight = (color: string) => {
    focusEditor();
    try {
      document.execCommand("hiliteColor", false, color);
      // fallback para alguns navegadores
      document.execCommand("backColor", false, color);
    } catch {}
    if (editorRef.current) onChange({ conteudo: editorRef.current.innerHTML });
    setShowHighlight(false);
  };

  const handleTextColor = (color: string) => {
    focusEditor();
    try {
      document.execCommand("foreColor", false, color);
    } catch {}
    if (editorRef.current) onChange({ conteudo: editorRef.current.innerHTML });
    setShowTextColor(false);
  };

  const toggleChecklist = () => {
    const editor = editorRef.current;
    if (!editor) return;
    focusEditor();
    const selection = window.getSelection();
    const selectedText = selection?.toString() || "Item da lista";
    try {
      // insere checklist simples com checkbox desabilitado
      document.execCommand(
        "insertHTML",
        false,
        `<ul style=\"list-style:none;padding-left:0;margin:8px 0;\"><li style=\"display:flex;align-items:center;gap:8px;margin:4px 0;\"><input type=\"checkbox\" style=\"width:16px;height:16px;accent-color:hsl(var(--primary));\" /> <span>${selectedText}</span></li></ul>`
      );
    } catch {}
    if (editor) onChange({ conteudo: editor.innerHTML });
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

      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-card px-2 py-2 sm:px-4">
        {/* ESTILOS */}
        <Select onValueChange={handleStyleChange} defaultValue="p">
          <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Estilo do texto">
            <SelectValue placeholder="Normal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Normal</SelectItem>
            <SelectItem value="h1">Título 1</SelectItem>
            <SelectItem value="h2">Título 2</SelectItem>
            <SelectItem value="h3">Título 3</SelectItem>
          </SelectContent>
        </Select>
        <div className="mx-1 h-6 w-px bg-border" />
        {/* FORMATAÇÃO */}
        <button type="button" title="Negrito (Ctrl+B)" aria-label="Negrito" onClick={() => runCommand("bold")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bold className="size-4" />
        </button>
        <button type="button" title="Itálico (Ctrl+I)" aria-label="Itálico" onClick={() => runCommand("italic")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Italic className="size-4" />
        </button>
        <button type="button" title="Sublinhado" aria-label="Sublinhado" onClick={() => runCommand("underline")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Underline className="size-4" />
        </button>
        <button type="button" title="Tachado" aria-label="Tachado" onClick={() => runCommand("strikeThrough")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Strikethrough className="size-4" />
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        {/* DESTAQUE */}
        <div className="relative">
          <button type="button" title="Cor de destaque (marca-texto)" aria-label="Destaque" onClick={() => { setShowHighlight((v) => !v); setShowTextColor(false); }} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Highlighter className="size-4" />
          </button>
          {showHighlight && (
            <div className="absolute left-0 top-9 z-10 flex gap-1.5 rounded-lg border bg-popover p-2 shadow-md">
              <button title="Amarelo" aria-label="Destaque amarelo" onClick={() => handleHighlight("#FEF08A")} className="size-6 rounded-full border shadow-sm" style={{ backgroundColor: "#FEF08A" }} />
              <button title="Verde" aria-label="Destaque verde" onClick={() => handleHighlight("#BBF7D0")} className="size-6 rounded-full border shadow-sm" style={{ backgroundColor: "#BBF7D0" }} />
              <button title="Azul" aria-label="Destaque azul" onClick={() => handleHighlight("#BFDBFE")} className="size-6 rounded-full border shadow-sm" style={{ backgroundColor: "#BFDBFE" }} />
              <button title="Roxo" aria-label="Destaque roxo" onClick={() => handleHighlight("#DDD6FE")} className="size-6 rounded-full border shadow-sm" style={{ backgroundColor: "#DDD6FE" }} />
              <button title="Rosa" aria-label="Destaque rosa" onClick={() => handleHighlight("#FBCFE8")} className="size-6 rounded-full border shadow-sm" style={{ backgroundColor: "#FBCFE8" }} />
              <button title="Remover destaque" aria-label="Remover destaque" onClick={() => handleHighlight("transparent")} className="grid size-6 place-items-center rounded-full border bg-background text-[10px]">✕</button>
            </div>
          )}
        </div>
        {/* COR DO TEXTO */}
        <div className="relative">
          <button type="button" title="Cor do texto" aria-label="Cor do texto" onClick={() => { setShowTextColor((v) => !v); setShowHighlight(false); }} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Palette className="size-4" />
          </button>
          {showTextColor && (
            <div className="absolute left-0 top-9 z-10 flex gap-1.5 rounded-lg border bg-popover p-2 shadow-md">
              <button title="Preto" aria-label="Texto preto" onClick={() => handleTextColor("#111827")} className="size-6 rounded-full border" style={{ backgroundColor: "#111827" }} />
              <button title="Vermelho" aria-label="Texto vermelho" onClick={() => handleTextColor("#DC2626")} className="size-6 rounded-full border" style={{ backgroundColor: "#DC2626" }} />
              <button title="Azul" aria-label="Texto azul" onClick={() => handleTextColor("#2563EB")} className="size-6 rounded-full border" style={{ backgroundColor: "#2563EB" }} />
              <button title="Verde" aria-label="Texto verde" onClick={() => handleTextColor("#16A34A")} className="size-6 rounded-full border" style={{ backgroundColor: "#16A34A" }} />
              <button title="Roxo" aria-label="Texto roxo" onClick={() => handleTextColor("#7C3AED")} className="size-6 rounded-full border" style={{ backgroundColor: "#7C3AED" }} />
              <label title="Escolher cor" className="grid size-6 place-items-center overflow-hidden rounded-full border bg-background cursor-pointer"><input type="color" onChange={(e) => handleTextColor(e.target.value)} className="h-8 w-8 cursor-pointer border-0 p-0" /></label>
            </div>
          )}
        </div>
        <div className="mx-1 h-6 w-px bg-border" />
        {/* LISTAS */}
        <button type="button" title="Lista com marcadores" aria-label="Lista com marcadores" onClick={() => runCommand("insertUnorderedList")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <List className="size-4" />
        </button>
        <button type="button" title="Lista numerada" aria-label="Lista numerada" onClick={() => runCommand("insertOrderedList")} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <ListOrdered className="size-4" />
        </button>
        <button type="button" title="Checklist - lista com caixas de seleção" aria-label="Checklist" onClick={toggleChecklist} className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <CheckSquare className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6 sm:py-8">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Conteúdo da anotação"
          onInput={(event) => onChange({ conteudo: event.currentTarget.innerHTML })}
          onFocus={() => { setShowHighlight(false); setShowTextColor(false); }}
          data-placeholder="Comece a escrever sua anotação..."
          className="note-surface mx-auto min-h-[60vh] w-full max-w-3xl rounded-2xl border border-border bg-card px-6 py-8 text-[15px] leading-8 text-foreground shadow-sm outline-none transition-shadow duration-200 focus-visible:shadow-md sm:px-10"
        />
      </div>
    </section>
  );
}
