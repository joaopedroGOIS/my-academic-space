# Meu Espaço Acadêmico — Etapa 1 (estrutura visual)

Aplicação de organização acadêmica com navegação lateral, Home em painel e páginas estruturais dos módulos. Foco desktop/notebook, responsiva no celular. Dados fictícios, sem backend nesta etapa.

## Identidade visual

Design minimalista e profissional, muito espaço em branco, ícones bem visíveis (Lucide), sem gradientes.

Tokens no design system (`src/styles.css`, em oklch):
- Roxo principal `#4C1D95` (primary), roxo secundário `#6D28D9`, roxo claro `#EDE9FE` (accent/estado ativo)
- Fundo geral `#F3F4F6`, cards `#FFFFFF`, texto `#18181B`, texto secundário `#737373`
- Roxo apenas em botões primários, item ativo da navegação, ícones ativos e barras de progresso

## Layout

- Sidebar fixa no desktop com logo/nome, lista de módulos com ícone + rótulo, item ativo com fundo roxo claro e ícone roxo, botão de recolher
- No celular vira menu deslizante acionado por botão no topo
- Cabeçalho de página reutilizável (título + ação `+`)

## Módulos e rotas

`/` Home, `/faculdade`, `/curso`, `/semestres`, `/materias`, `/anotacoes`, `/trabalhos`, `/calendario`, `/cronometro` — todas criadas nesta etapa, cada uma com metadados próprios de título/descrição.

## Home (três áreas no desktop, empilhadas no celular)

- Esquerda: **Favoritos** (Anotações, Cronômetro, Trabalhos) e **Todos os módulos** em grade de ícones
- Centro: **Ações rápidas** (Nova anotação, Adicionar material, Iniciar estudo) e **Atividades recentes** com itens fictícios
- Direita: **Calendário compacto** do mês atual com dia de hoje destacado, pontos indicando eventos e link "Ver calendário completo"; **Em progresso** com nome, porcentagem, barra roxa e prazo

## Páginas dos módulos

- Faculdade, Curso, Semestres, Matérias: título, botão `+` e estado vazio preparado para listagem
- Anotações: barra lateral interna com pesquisa, lista fictícia de matérias/aulas, botão "Nova anotação" e área principal do editor (placeholder)
- Trabalhos e Tarefas: título, botão `+` e lista com nome, prazo, porcentagem e barra de progresso
- Calendário: grade mensal com navegação Mês anterior / Hoje / Próximo mês (apenas troca de mês)
- Cronômetro: página branca minimalista, tempo grande `25:00`, texto "Defina seu tempo de estudo", presets 15/25/45/60/90 min e botão ▶ INICIAR (sem lógica de contagem)

## Organização técnica

```text
src/components/layout/    AppSidebar, AppLayout, PageHeader
src/components/ui-kit/    Card, ProgressBar, ModuleTile, MiniCalendar, IconButton
src/data/                 modules.ts, mockData.ts (atividades, progresso, notas, tarefas)
src/routes/               uma rota por módulo
```

Componentes shadcn existentes (sidebar, button, card, progress) reutilizados; nenhuma cor escrita à mão nos componentes — só tokens semânticos.

## Fora do escopo desta etapa

Persistência de dados, editor de anotações funcional, lógica do cronômetro, eventos reais no calendário, personalização de favoritos.
