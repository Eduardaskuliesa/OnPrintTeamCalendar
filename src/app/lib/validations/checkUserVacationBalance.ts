import { GlobalSettingsType } from "@/app/types/bookSettings";
import { User } from "@/app/types/api";
import { calculateVacationDays } from "./helpers";

const formatNumber = (value: number) => {
  const withThreeDecimals = Number(value).toFixed(3);
  return withThreeDecimals.replace(/\.?0+$/, "");
};

export function checkUserVacationBalance(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType,
  existingVacations: any[],
  user: User
): { hasConflict: boolean; error?: any } {
  const { workingDays } = calculateVacationDays(startDate, endDate, settings);

  // Calculate already used vacation days
  const usedVacationDays = existingVacations
    .filter((vacation) => vacation.userEmail === user.email)
    .reduce((total, vacation) => {
      const { workingDays: vacationWorkingDays } = calculateVacationDays(
        new Date(vacation.startDate),
        new Date(vacation.endDate),
        settings
      );
      return total + vacationWorkingDays;
    }, 0);

  // Check if user has enough vacation days
  if (workingDays > user.vacationDays - usedVacationDays) {
    return {
      hasConflict: true,
      error: {
        type: "INSUFFICIENT_VACATION_DAYS",
        message: `Nepakankamas atostogų balansas. Reikia: ${formatNumber(workingDays)}, Turitę: ${
          formatNumber(user.vacationDays - usedVacationDays)
        }`,
        details: {
          required: formatNumber(workingDays),
          available: formatNumber(user.vacationDays - usedVacationDays),
          totalBalance: formatNumber(user.vacationDays),
          used: formatNumber(usedVacationDays),
        },
      },
    };
  }

  return { hasConflict: false };
}