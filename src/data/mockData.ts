export interface RecentActivity {
  id: string;
  title: string;
  meta: string;
  type: "nota" | "material" | "tarefa";
}

export const recentActivities: RecentActivity[] = [
  { id: "1", title: "Administração Científica", meta: "Editada há 2 horas", type: "nota" },
  { id: "2", title: "Slides de Economia", meta: "Adicionado ontem", type: "material" },
  { id: "3", title: "Introdução ao Marketing", meta: "Editada ontem", type: "nota" },
  { id: "4", title: "Resumo de Contabilidade", meta: "Editada há 3 dias", type: "nota" },
];

export interface ProgressItem {
  id: string;
  title: string;
  progress: number;
  deadline?: string;
  type: "tarefa" | "estudo";
}

export const inProgress: ProgressItem[] = [
  { id: "1", title: "Trabalho de Marketing", progress: 80, deadline: "Entrega em 5 dias", type: "tarefa" },
  { id: "2", title: "Estudar Economia", progress: 50, type: "estudo" },
  { id: "3", title: "Fichamento de Sociologia", progress: 25, deadline: "Entrega em 12 dias", type: "tarefa" },
];

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  progress: number;
}

export const tasks: TaskItem[] = [
  { id: "1", title: "Trabalho de Marketing", subject: "Marketing I", deadline: "06/09/2026", progress: 80 },
  { id: "2", title: "Lista de exercícios", subject: "Economia", deadline: "10/09/2026", progress: 40 },
  { id: "3", title: "Fichamento de artigo", subject: "Sociologia", deadline: "13/09/2026", progress: 25 },
  { id: "4", title: "Apresentação em grupo", subject: "Administração", deadline: "22/09/2026", progress: 0 },
];

export interface NoteSubject {
  id: string;
  subject: string;
  lessons: { id: string; title: string; date: string }[];
}

export const noteSubjects: NoteSubject[] = [
  {
    id: "adm",
    subject: "Administração",
    lessons: [
      { id: "adm-1", title: "Administração Científica", date: "28/08" },
      { id: "adm-2", title: "Teoria Clássica", date: "21/08" },
    ],
  },
  {
    id: "eco",
    subject: "Economia",
    lessons: [
      { id: "eco-1", title: "Oferta e demanda", date: "27/08" },
      { id: "eco-2", title: "Elasticidade", date: "20/08" },
    ],
  },
  {
    id: "mkt",
    subject: "Marketing",
    lessons: [{ id: "mkt-1", title: "Introdução ao Marketing", date: "26/08" }],
  },
];

/** Dias do mês atual com eventos fictícios. */
export const eventDays = [3, 8, 12, 15, 21, 27];
