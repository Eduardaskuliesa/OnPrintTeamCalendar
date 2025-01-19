export const calculateTotalHours = (
  records: any[] | undefined,
  types: string[]
): string => {
  if (!records) return "00:00";

  const totalHours = records
    .filter((record) => types.includes(record.type))
    .reduce((acc, record) => {
      const [accHours, accMinutes] = acc.split(":");
      const [recHours, recMinutes] = record.time.split(":");

      const totalHours = Number(accHours) + Number(recHours);
      const totalMinutes = Number(accMinutes) + Number(recMinutes);

      const finalHours = totalHours + Math.floor(totalMinutes / 60);
      const finalMinutes = totalMinutes % 60;

      return `${finalHours.toString().padStart(2, "0")}:${finalMinutes
        .toString()
        .padStart(2, "0")}`;
    }, "00:00");

  return totalHours;
};

export const calculateOvertimeBalance = (
  overtimeHours: string,
  absentHours: string
): {
  value: string;
  isPositive: boolean;
} => {
  const [overtimeHour, overtimeMinute] = (overtimeHours ?? "00:00")
    .split(":")
    .map(Number);
  const [absentHour, absentMinute] = (absentHours ?? "00:00")
    .split(":")
    .map(Number);

  const totalOvertimeMinutes = overtimeHour * 60 + overtimeMinute;
  const totalAbsentMinutes = absentHour * 60 + absentMinute;

  const balanceMinutes = totalOvertimeMinutes - totalAbsentMinutes;

  const balanceHours = Math.floor(Math.abs(balanceMinutes) / 60);
  const balanceMinutesRemainder = Math.abs(balanceMinutes) % 60;

  return {
    value: `${balanceHours}:${balanceMinutesRemainder
      .toString()
      .padStart(2, "0")}`,
    isPositive: balanceMinutes >= 0,
  };
};
