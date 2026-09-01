import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { ListModulePage } from "@/components/layout/ListModulePage";

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
  return (
    <ListModulePage
      icon={BookOpen}
      title="Matérias"
      description="Disciplinas do semestre"
      actionLabel="Nova matéria"
      emptyTitle="Nenhuma matéria cadastrada"
      emptyDescription="Aqui você poderá listar suas disciplinas, com professor, horário e materiais."
    />
  );
}
