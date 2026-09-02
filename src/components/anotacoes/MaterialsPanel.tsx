import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Eye, Trash2 } from "lucide-react";
import type { MaterialAnexo, MaterialTipo } from "@/lib/notesStorage";

interface Props {
  materiais: MaterialAnexo[];
  onAdd: (novos: MaterialAnexo[]) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

function getTipoFromMime(mime: string, name: string): MaterialTipo {
  if (mime === "application/pdf" || name.toLowerCase().endsWith(".pdf")) return "pdf";
  if (mime.startsWith("image/")) return "image";
  return "other";
}

function tipoLabel(tipo: MaterialTipo): string {
  if (tipo === "pdf") return "PDF";
  if (tipo === "image") return "Imagem";
  return "Arquivo";
}

function tipoIcon(tipo: MaterialTipo): string {
  if (tipo === "pdf") return "📄";
  if (tipo === "image") return "🖼️";
  return "📎";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MaterialsPanel({ materiais, onAdd, onRemove, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as { isFocus?: boolean } | undefined;
      if (d && typeof d.isFocus === "boolean") setIsFocus(d.isFocus);
    };
    window.addEventListener("anotacoes:focus", handler as EventListener);
    return () => window.removeEventListener("anotacoes:focus", handler as EventListener);
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const novos: MaterialAnexo[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      novos.push({
        id: crypto.randomUUID(),
        nome: file.name,
        tipo: getTipoFromMime(file.type, file.name),
        mime: file.type || "application/octet-stream",
        size: file.size,
        dataUrl,
        createdAt: new Date().toISOString(),
      });
    }
    onAdd(novos);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpen = (m: MaterialAnexo) => {
    const win = window.open();
    if (!win) return;
    if (m.tipo === "image" || m.mime.startsWith("image/")) {
      win.document.write(`<html><head><title>${m.nome}</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#f3f4f6"><img src="${m.dataUrl}" alt="${m.nome}" style="max-width:100%;max-height:100vh;object-fit:contain" /></body></html>`);
    } else if (m.tipo === "pdf" || m.mime === "application/pdf") {
      win.document.write(`<html><head><title>${m.nome}</title></head><body style="margin:0"><iframe src="${m.dataUrl}" style="border:0;width:100vw;height:100vh"></iframe></body></html>`);
    } else {
      const a = document.createElement("a");
      a.href = m.dataUrl;
      a.download = m.nome;
      a.click();
      win.close();
    }
  };

  return (
    <aside
      id="materials-panel"
      className={`flex w-[340px] max-w-[88vw] shrink-0 flex-col border-l border-border bg-card shadow-sm transition-all duration-200 ${isFocus ? "hidden" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">📎 Materiais</h3>
          <p className="text-xs text-muted-foreground">{materiais.length} {materiais.length === 1 ? "arquivo" : "arquivos"} vinculado(s)</p>
        </div>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Fechar materiais">
          <X className="size-4" />
        </Button>
      </div>

      <div className="p-3">
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => inputRef.current?.click()}>
          + Adicionar material
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">PDF, imagens ou outros arquivos</p>
      </div>

      <div className="flex-1 overflow-auto px-3 pb-3">
        {materiais.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-sm text-muted-foreground">Nenhum material anexado</p>
            <p className="mt-1 text-xs text-muted-foreground">Adicione PDFs, imagens ou arquivos relacionados a esta anotação.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {materiais.map((m) => (
              <li key={m.id} className="group flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-2.5 transition-colors hover:bg-accent/40">
                <span className="mt-0.5 text-base leading-none" aria-hidden>{tipoIcon(m.tipo)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground" title={m.nome}>{m.nome}</p>
                  <p className="text-xs text-muted-foreground">{tipoLabel(m.tipo)} • {formatSize(m.size)} • {m.mime || "arquivo"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7" onClick={() => handleOpen(m)} aria-label={`Abrir ${m.nome}`} title="Abrir / Visualizar">
                    <Eye className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" onClick={() => onRemove(m.id)} aria-label={`Remover ${m.nome}`} title="Remover">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
