import { useEffect, useState } from "react";

export interface Faculdade { id: string; nome: string; }
export interface Curso { id: string; nome: string; faculdadeId: string; }
export interface Semestre { id: string; nome: string; cursoId: string; }
export interface Materia { id: string; nome: string; semestreId: string; }

function useLocalList<T>(key: string) {
  const [items, setItems] = useState<T[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(items)); } catch {}
  }, [key, items]);
  return [items, setItems] as const;
}

export function useFaculdades() {
  const [items, setItems] = useLocalList<Faculdade>("acad_faculdades");
  const add = (nome: string) => {
    const f: Faculdade = { id: crypto.randomUUID(), nome: nome.trim() };
    setItems((p) => [...p, f]);
  };
  const update = (id: string, nome: string) => setItems((p) => p.map((x) => x.id === id ? { ...x, nome: nome.trim() } : x));
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  return { items, add, update, remove };
}

export function useCursos() {
  const [items, setItems] = useLocalList<Curso>("acad_cursos");
  const add = (nome: string, faculdadeId: string) => {
    const c: Curso = { id: crypto.randomUUID(), nome: nome.trim(), faculdadeId };
    setItems((p) => [...p, c]);
  };
  const update = (id: string, nome: string, faculdadeId: string) => setItems((p) => p.map((x) => x.id === id ? { ...x, nome: nome.trim(), faculdadeId } : x));
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  return { items, add, update, remove };
}

export function useSemestres() {
  const [items, setItems] = useLocalList<Semestre>("acad_semestres");
  const add = (nome: string, cursoId: string) => {
    const s: Semestre = { id: crypto.randomUUID(), nome: nome.trim(), cursoId };
    setItems((p) => [...p, s]);
  };
  const update = (id: string, nome: string, cursoId: string) => setItems((p) => p.map((x) => x.id === id ? { ...x, nome: nome.trim(), cursoId } : x));
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  return { items, add, update, remove };
}

export function useMaterias() {
  const [items, setItems] = useLocalList<Materia>("acad_materias");
  const add = (nome: string, semestreId: string) => {
    const m: Materia = { id: crypto.randomUUID(), nome: nome.trim(), semestreId };
    setItems((p) => [...p, m]);
  };
  const update = (id: string, nome: string, semestreId: string) => setItems((p) => p.map((x) => x.id === id ? { ...x, nome: nome.trim(), semestreId } : x));
  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));
  return { items, add, update, remove };
}
export type TrabalhoTipo = "Trabalho" | "Tarefa";
export type TrabalhoStatus = "Não iniciado" | "Em andamento" | "Concluído";

export interface Material {
  id: string;
  nome: string;
  tipo: "pdf" | "imagem";
  mime: string;
  dataUrl: string;
}

export interface Trabalho {
  id: string;
  nome: string;
  tipo: TrabalhoTipo;
  materiaId: string;
  materiaNome: string;
  prazo?: string;
  progresso: number;
  createdAt: string;
  materiais?: Material[];
}

export function statusDoProgresso(progresso: number): TrabalhoStatus {
  if (progresso >= 100) return "Concluído";
  if (progresso <= 0) return "Não iniciado";
  return "Em andamento";
}

export function clampProgresso(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function useTrabalhos() {
  const [items, setItems] = useLocalList<Trabalho>("acad_trabalhos");

  const add = (data: Omit<Trabalho, "id" | "createdAt">): Trabalho => {
    const t: Trabalho = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      materiais: [],
      ...data,
      progresso: clampProgresso(data.progresso),
    };
    setItems((p) => [...p, t]);
    return t;
  };

  const update = (id: string, patch: Partial<Omit<Trabalho, "id" | "createdAt">>) =>
    setItems((p) =>
      p.map((x) =>
        x.id === id
          ? { ...x, ...patch, progresso: patch.progresso === undefined ? x.progresso : clampProgresso(patch.progresso) }
          : x,
      ),
    );

  const remove = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  const addMaterial = (id: string, material: Material) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, materiais: [...(x.materiais ?? []), material] } : x)));

  const removeMaterial = (id: string, materialId: string) =>
    setItems((p) =>
      p.map((x) => (x.id === id ? { ...x, materiais: (x.materiais ?? []).filter((m) => m.id !== materialId) } : x)),
    );

  return { items, add, update, remove, addMaterial, removeMaterial };
}

