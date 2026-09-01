import { Plus, type LucideIcon } from "lucide-react";

import { PageContainer } from "./PageContainer";
import { PageHeader } from "./PageHeader";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Button } from "@/components/ui/button";

interface ListModulePageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function ListModulePage({
  icon,
  title,
  description,
  actionLabel,
  emptyTitle,
  emptyDescription,
}: ListModulePageProps) {
  return (
    <PageContainer>
      <PageHeader
        icon={icon}
        title={title}
        description={description}
        action={
          <Button className="shrink-0">
            <Plus className="size-4" />
            <span className="hidden sm:inline">{actionLabel}</span>
          </Button>
        }
      />
      <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} />
    </PageContainer>
  );
}
