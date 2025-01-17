// src/app/validations/checkUserVacationBalance.ts
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { User } from "@/app/types/api";
import { calculateVacationDays } from "./helpers";

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
        message: `Nepakankamas atostogų balansas. Reikia: ${workingDays}, Turitę: ${
          user.vacationDays - usedVacationDays
        }`,
        details: {
          required: workingDays,
          available: user.vacationDays - usedVacationDays,
          totalBalance: user.vacationDays,
          used: usedVacationDays,
        },
      },
    };
  }

  return { hasConflict: false };
}
