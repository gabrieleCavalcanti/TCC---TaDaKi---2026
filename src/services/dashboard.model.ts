export function monthPeriod(input: unknown, now = new Date()) {
  const current = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const fallback = `${current.find((p) => p.type === "year")!.value}-${current.find((p) => p.type === "month")!.value}`;
  const month = input === undefined ? fallback : String(input);
  if (
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    Number(month.slice(0, 4)) < 2000 ||
    Number(month.slice(0, 4)) > 2100
  )
    throw new Error("Escolha um mês válido entre 2000 e 2100 (AAAA-MM).");
  const year = Number(month.slice(0, 4));
  const m = Number(month.slice(5));
  return {
    month,
    start: `${month}-01 00:00:00`,
    end: `${m === 12 ? year + 1 : year}-${String(m === 12 ? 1 : m + 1).padStart(2, "0")}-01 00:00:00`,
  };
}
