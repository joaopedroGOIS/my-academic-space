import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Highlighter,
  Undo2,
  Redo2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolbarAction {
  icon: LucideIcon;
  label: string;
  command: string;
  value?: string;
}

const groups: ToolbarAction[][] = [
  [
    { icon: Undo2, label: "Desfazer", command: "undo" },
    { icon: Redo2, label: "Refazer", command: "redo" },
  ],
  [
    { icon: Bold, label: "Negrito", command: "bold" },
    { icon: Italic, label: "Itálico", command: "italic" },
    { icon: Underline, label: "Sublinhado", command: "underline" },
    { icon: Highlighter, label: "Destacar", command: "hiliteColor", value: "#EDE9FE" },
  ],
  [
    { icon: Heading1, label: "Título", command: "formatBlock", value: "h2" },
    { icon: Heading2, label: "Subtítulo", command: "formatBlock", value: "h3" },
    { icon: Quote, label: "Citação", command: "formatBlock", value: "blockquote" },
  ],
  [
    { icon: List, label: "Lista com marcadores", command: "insertUnorderedList" },
    { icon: ListOrdered, label: "Lista numerada", command: "insertOrderedList" },
  ],
];

export function EditorToolbar({ onCommand }: { onCommand: (command: string, value?: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-card px-4 py-2 sm:px-6">
      {groups.map((group, groupIndex) => (
        <div key={group[0].command} className="flex items-center gap-1">
          {groupIndex > 0 ? <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" /> : null}
          {group.map(({ icon: Icon, label, command, value }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              title={label}
              onMouseDown={(event) => {
                event.preventDefault();
                onCommand(command, value);
              }}
              className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:-translate-y-[1px] hover:bg-accent hover:text-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
