import {
  Home,
  Landmark,
  GraduationCap,
  CalendarRange,
  BookOpen,
  NotebookPen,
  ClipboardList,
  CalendarDays,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type ModuleKey =
  | "home"
  | "faculdade"
  | "curso"
  | "semestres"
  | "materias"
  | "anotacoes"
  | "trabalhos"
  | "calendario"
  | "cronometro";

export interface AppModule {
  key: ModuleKey;
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
}

export const modules: AppModule[] = [
  { key: "home", label: "Home", to: "/", icon: Home, description: "Painel principal" },
  {
    key: "faculdade",
    label: "Faculdade",
    to: "/faculdade",
    icon: Landmark,
    description: "Instituições",
  },
  {
    key: "curso",
    label: "Curso",
    to: "/curso",
    icon: GraduationCap,
    description: "Seus cursos",
  },
  {
    key: "semestres",
    label: "Semestres",
    to: "/semestres",
    icon: CalendarRange,
    description: "Períodos letivos",
  },
  {
    key: "materias",
    label: "Matérias",
    to: "/materias",
    icon: BookOpen,
    description: "Disciplinas",
  },
  {
    key: "anotacoes",
    label: "Anotações",
    to: "/anotacoes",
    icon: NotebookPen,
    description: "Notas de aula",
  },
  {
    key: "trabalhos",
    label: "Trabalhos e Tarefas",
    to: "/trabalhos",
    icon: ClipboardList,
    description: "Entregas e prazos",
  },
  {
    key: "calendario",
    label: "Calendário",
    to: "/calendario",
    icon: CalendarDays,
    description: "Sua agenda",
  },
  {
    key: "cronometro",
    label: "Cronômetro",
    to: "/cronometro",
    icon: Timer,
    description: "Sessões de estudo",
  },
];

export const favoriteKeys: ModuleKey[] = ["anotacoes", "cronometro", "trabalhos"];

export const getModule = (key: ModuleKey) => modules.find((m) => m.key === key)!;
