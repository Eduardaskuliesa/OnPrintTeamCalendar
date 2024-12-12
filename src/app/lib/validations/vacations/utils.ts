export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getTotalDays(startDate: Date, endDate: Date): number {
  return (
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

export function getDaysInAdvance(startDate: Date): number {
  return Math.ceil(
    (startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
}
