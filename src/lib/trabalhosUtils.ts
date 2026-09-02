export function formatPrazo(prazo?: string): string | null {
  if (!prazo) return null;
  const date = new Date(`${prazo}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("pt-BR");
}
