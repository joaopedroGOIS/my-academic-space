import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { ListModulePage } from "@/components/layout/ListModulePage";

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Curso — Meu Espaço Acadêmico" },
      { name: "description", content: "Organize os cursos e graduações que você está realizando." },
      { property: "og:title", content: "Curso — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Organize os cursos e graduações que você está realizando." },
    ],
  }),
  component: CursoPage,
});

function CursoPage() {
  return (
    <ListModulePage
      icon={GraduationCap}
      title="Curso"
      description="Seus cursos e graduações"
      actionLabel="Novo curso"
      emptyTitle="Nenhum curso cadastrado"
      emptyDescription="Aqui você poderá listar seus cursos, com duração, turno e faculdade vinculada."
    />
  );
}
