import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen, Plus, Search } from "lucide-react";

import { BackButton } from "@/components/layout/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { noteSubjects } from "@/data/mockData";

export const Route = createFileRoute("/anotacoes")({
  head: () => ({
    meta: [
      { title: "Anotações — Meu Espaço Acadêmico" },
      { name: "description", content: "Escreva e organize suas anotações de aula por matéria e por encontro." },
      { property: "og:title", content: "Anotações — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Escreva e organize suas anotações de aula por matéria e por encontro." },
    ],
  }),
  component: AnotacoesPage,
});

function AnotacoesPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:h-screen lg:flex-row">
      {/* Barra lateral interna */}
      <aside className="flex shrink-0 flex-col border-b border-border bg-card lg:h-full lg:w-72 lg:border-b-0 lg:border-r">
        <div className="space-y-3 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <BackButton label="Anotações" />
            <NotebookPen className="size-4 shrink-0 text-primary" />
            <h1 className="text-sm font-semibold text-foreground">Anotações</h1>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Pesquisar anotações" className="pl-9" />
          </div>
          <Button className="w-full">
            <Plus className="size-4" />
            Nova anotação
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {noteSubjects.map((subject) => (
            <div key={subject.id}>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {subject.subject}
              </p>
              <ul className="mt-2 space-y-1">
                {subject.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent"
                    >
                      <span className="truncate text-sm text-foreground">{lesson.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{lesson.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Área do editor */}
      <section className="flex flex-1 flex-col bg-card">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-semibold text-foreground">Administração Científica</h2>
          <p className="text-xs text-muted-foreground">Administração · Editada há 2 horas</p>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent">
              <NotebookPen className="size-6 text-primary" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Editor de anotações</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta área receberá o editor completo na próxima etapa. Por enquanto, ela apenas
              reserva o espaço da escrita.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
