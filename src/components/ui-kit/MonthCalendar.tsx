import { cn } from "@/lib/utils";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface MonthCalendarProps {
  year: number;
  month: number;
  today?: Date;
  selectedDay?: number | null;
  onSelectDay?: (day: number) => void;
  eventDays?: number[];
  size?: "compact" | "full";
}

export function MonthCalendar({
  year,
  month,
  today = new Date(),
  selectedDay = null,
  onSelectDay,
  eventDays = [],
  size = "compact",
}: MonthCalendarProps) {
  const cells = buildMonthMatrix(year, month);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const full = size === "full";

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-3">
        {WEEKDAYS.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-1 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className={full ? "min-h-[96px] sm:min-h-[110px]" : "h-9"} />;
          const isToday = isCurrentMonth && today.getDate() === day;
          const isSelected = selectedDay === day;
          const hasEvent = eventDays.includes(day);

          if (full) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectDay?.(day)}
                className={cn(
                  "flex min-h-[96px] flex-col items-start gap-1 rounded-xl border bg-card p-2 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[110px]",
                  isToday ? "border-primary/30 bg-accent/50" : "border-border",
                  isSelected && "border-primary bg-accent ring-1 ring-primary/20",
                )}
              >
                <span
                  className={cn(
                    "inline-grid size-7 place-items-center rounded-full text-xs font-medium transition-colors",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground",
                  )}
                >
                  {day}
                </span>
              <div className="min-h-6 w-full">
                  {hasEvent && (
                    <p className="mt-1 truncate rounded-md bg-accent px-1.5 py-1 text-[11px] font-medium text-accent-foreground">
                      Evento
                    </p>
                  )}
                </div>
              </button>
            );
          }

          return (
            <div key={i} className="flex h-9 flex-col items-center justify-center">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-xs font-medium",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {day}
              </span>
              <span
                className={cn(
                  "mt-0.5 size-1 rounded-full",
                  hasEvent && !isToday ? "bg-primary" : "bg-transparent",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
