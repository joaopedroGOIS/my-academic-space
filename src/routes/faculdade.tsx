import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";

import { ListModulePage } from "@/components/layout/ListModulePage";

export const Route = createFileRoute("/faculdade")({
  head: () => ({
    meta: [
      { title: "Faculdade — Meu Espaço Acadêmico" },
      { name: "description", content: "Cadastre e organize as instituições de ensino em que você estuda." },
      { property: "og:title", content: "Faculdade — Meu Espaço Acadêmico" },
      { property: "og:description", content: "Cadastre e organize as instituições de ensino em que você estuda." },
    ],
  }),
  component: FaculdadePage,
});

function FaculdadePage() {
  return (
    <ListModulePage
      icon={Landmark}
      title="Faculdade"
      description="Instituições de ensino"
      actionLabel="Nova faculdade"
      emptyTitle="Nenhuma faculdade cadastrada"
      emptyDescription="Aqui você poderá listar as instituições em que estuda, com dados de contato e período."
    />
  );
}
