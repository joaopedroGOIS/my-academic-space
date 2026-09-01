import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";

import { ListModulePage } from "@/components/layout/ListModulePage";

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
  return (
    <ListModulePage
      icon={CalendarRange}
      title="Semestres"
      description="Períodos letivos"
      actionLabel="Novo semestre"
      emptyTitle="Nenhum semestre cadastrado"
      emptyDescription="Aqui você poderá organizar cada período letivo com datas de início, fim e matérias."
    />
  );
}
