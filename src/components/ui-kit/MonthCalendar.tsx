import { cn } from "@/lib/utils";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
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
  eventDays?: number[];
  size?: "compact" | "full";
}

export function MonthCalendar({
  year,
  month,
  today = new Date(),
  eventDays = [],
  size = "compact",
}: MonthCalendarProps) {
  const cells = buildMonthMatrix(year, month);
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const full = size === "full";

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="text-center text-[11px] font-medium uppercase text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className={full ? "min-h-24" : "h-9"} />;
          const isToday = isCurrentMonth && today.getDate() === day;
          const hasEvent = eventDays.includes(day);

          if (full) {
            return (
              <div
                key={i}
                className={cn(
                  "min-h-24 rounded-xl border border-border p-2 transition-colors hover:bg-muted",
                  isToday && "border-primary/40 bg-accent",
                )}
              >
                <span
                  className={cn(
                    "inline-grid size-6 place-items-center rounded-full text-xs font-medium",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {day}
                </span>
                {hasEvent && (
                  <p className="mt-2 truncate rounded-md bg-accent px-1.5 py-1 text-[11px] font-medium text-accent-foreground">
                    Evento
                  </p>
                )}
              </div>
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
