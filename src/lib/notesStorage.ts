import { useCallback, useEffect, useState } from "react";

export interface Nota {
  id: string;
  titulo: string;
  materiaId: string | null;
  conteudo: string;
  updatedAt: string;
}

const STORAGE_KEY = "acad_notas";

function readNotes(): Nota[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is Nota => {
      if (typeof n !== "object" || n === null) return false;
      const c = n as Record<string, unknown>;
      return typeof c["id"] === "string" && typeof c["titulo"] === "string" && typeof c["conteudo"] === "string";
    });
  } catch {
    return [];
  }
}

export function useNotas() {
  const [items, setItems] = useState<Nota[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readNotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota ou modo privado: ignora, estado permanece em memória */
    }
  }, [items, hydrated]);

  const add = useCallback((titulo: string, materiaId: string | null): Nota => {
    const nota: Nota = {
      id: crypto.randomUUID(),
      titulo: titulo.trim() || "Sem título",
      materiaId,
      conteudo: "",
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [nota, ...prev]);
    return nota;
  }, []);

  const update = useCallback((id: string, patch: Partial<Omit<Nota, "id">>) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { items, hydrated, add, update, remove };
}
