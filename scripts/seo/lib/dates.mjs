const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export function shiftDays(date, days) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function stableEndDate(lagDays = 3, now = new Date()) {
  const utcMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return shiftDays(utcMidnight, -Math.max(0, lagDays));
}

export function comparisonRange(days, lagDays = 3, now = new Date()) {
  const currentEnd = stableEndDate(lagDays, now);
  const currentStart = shiftDays(currentEnd, -(days - 1));
  const previousEnd = shiftDays(currentStart, -1);
  const previousStart = shiftDays(previousEnd, -(days - 1));

  return {
    current: { startDate: formatDate(currentStart), endDate: formatDate(currentEnd) },
    previous: { startDate: formatDate(previousStart), endDate: formatDate(previousEnd) }
  };
}
