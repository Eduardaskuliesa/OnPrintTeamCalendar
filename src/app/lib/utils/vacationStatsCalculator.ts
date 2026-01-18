import { User, Vacation } from "@/app/types/api";

export interface VacationStats {
  realCurrentBalance: number;
  totalFutureVacationDays: number;
  currentVacationDays: number;
}

export function calculateVacationStats(
  user: User,
  vacations: Vacation[]
): VacationStats {
  const now = new Date();
  const currentYear = now.getFullYear();

  const futureVacationDays = vacations
    .filter(
      (vacation) =>
        (vacation.status === "APPROVED" || vacation.status === "PENDING") &&
        new Date(vacation.startDate) > now &&
        new Date(vacation.startDate).getFullYear() === currentYear
    )
    .reduce((total, vacation) => total + vacation.totalVacationDays, 0);

  return {
    realCurrentBalance: user.vacationDays + futureVacationDays,
    totalFutureVacationDays: futureVacationDays,
    currentVacationDays: user.vacationDays,
  };
}
