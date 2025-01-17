import { GlobalSettingsType } from "@/app/types/bookSettings";
import { Vacation } from "@/app/types/api";
import { format } from "date-fns";
import { lt } from "date-fns/locale";

export function checkSeasonalConflict(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType
): { hasConflict: boolean; error?: any } {
  if (!settings.seasonalRules.enabled) {
    return { hasConflict: false };
  }

  const blackoutPeriods = settings.seasonalRules.blackoutPeriods;

  for (const period of blackoutPeriods) {
    const blackoutStart = new Date(period.start);
    const blackoutEnd = new Date(period.end);
    if (startDate <= blackoutEnd && endDate >= blackoutStart) {
      return {
        hasConflict: true,
        error: {
          type: "BLACKOUT_PERIOD",
          message: `Rezervacija apribota: ${period.name
            } nuo ${format(new Date(period.start), "MMM d, yyyy",{ locale: lt })} iki ${format(new Date(period.end), "MMM d, yyyy", { locale: lt })}`,
          details: {
            periodName: period.name,
            periodReason: period.reason,
            periodStart: period.start,
            periodEnd: period.end,
          },
        },
      };
    }
  }

  return { hasConflict: false };
}

export function checkGapRuleConflict(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType,
  existingVacations: Vacation[],
  userEmail: string
): {
  hasConflict: boolean;
  conflictingVacation?: Vacation;
  totalGapDays?: number;
} {
  if (!settings.gapRules.enabled || settings.gapRules.bypassGapRules) {
    return { hasConflict: false };
  }

  const vacationsToCheck = existingVacations
    .filter(
      (vacation) =>
        vacation.userEmail !== userEmail &&
        !settings.gapRules.canIgnoreGapsof?.includes(vacation.userId)
    )
    .map((vacation) => ({
      ...vacation,
      totalGapDays: vacation.gapDays,
    }));

  for (const vacation of vacationsToCheck) {
    const vacationEndDate = new Date(vacation.endDate);

    if (!vacation.totalGapDays) {
      continue;
    }

    const gapEndDate = addDays(vacationEndDate, vacation.totalGapDays);
    const isStartInGap = startDate > vacationEndDate && startDate <= gapEndDate;
    const isEndInGap = endDate > vacationEndDate && endDate <= gapEndDate;
    const isSpanningGap = startDate <= vacationEndDate && endDate >= gapEndDate;

    if (isStartInGap || isEndInGap || isSpanningGap) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays: vacation.totalGapDays,
      };
    }
  }

  return { hasConflict: false };
}

export function checkCustomRestrictedDays(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType
): { hasConflict: boolean; error?: any } {
  if (
    !settings.restrictedDays.enabled ||
    !settings.restrictedDays.customRestricted?.length
  ) {
    return { hasConflict: false };
  }

  for (const restrictedDay of settings.restrictedDays.customRestricted) {
    const restrictedDate = new Date(restrictedDay);

    if (restrictedDate >= startDate && restrictedDate <= endDate) {
      return {
        hasConflict: true,
        error: {
          type: "CUSTOM_RESTRICTED_DAY",
          message: `Pasirinktas laikotarpis įeina į apribotą datą: ${new Date(
            restrictedDay
          ).toLocaleDateString()}`,
          restrictedDate: restrictedDay,
        },
      };
    }
  }

  return { hasConflict: false };
}

export function checkOverlapConflict(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType,
  existingVacations: Vacation[],
  userEmail: string
): { hasConflict: boolean; error?: any } {
  const userVacations = existingVacations.filter(
    (v) => v.userEmail === userEmail
  );

  const hasSelfOverlap = userVacations.some((vacation) => {
    const vacationStart = new Date(vacation.startDate);
    const vacationEnd = new Date(vacation.endDate);
    return (
      (startDate <= vacationEnd && startDate >= vacationStart) ||
      (endDate <= vacationEnd && endDate >= vacationStart) ||
      (startDate <= vacationStart && endDate >= vacationEnd)
    );
  });

  if (hasSelfOverlap) {
    return {
      hasConflict: true,
      error: {
        type: "SELF_OVERLAP",
        message: "Pasirinkta data sutampa su viena iš jūsų esamų atostogų",
      },
    };
  }

  if (
    !settings.overlapRules.enabled ||
    settings.overlapRules.bypassOverlapRules
  ) {
    return { hasConflict: false };
  }

  const vacationsToCheck = existingVacations.filter((vacation) => {
    const canIgnoreUser =
      settings.overlapRules.canIgnoreOverlapRulesOf?.includes(vacation.userId);
    return !canIgnoreUser && vacation.userEmail !== userEmail;
  });

  if (settings.overlapRules.maxSimultaneousBookings === 0) {
    return { hasConflict: false };
  }

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const simultaneousBookings = vacationsToCheck.filter((vacation) => {
      const vacationStart = new Date(vacation.startDate);
      const vacationEnd = new Date(vacation.endDate);
      return currentDate >= vacationStart && currentDate <= vacationEnd;
    }).length;

    if (simultaneousBookings >= settings.overlapRules.maxSimultaneousBookings) {
      return {
        hasConflict: true,
        error: {
          type: "MAX_OVERLAP_EXCEEDED",
          message: `Viršytas maksimalus vienu metu atostogaujančių skaičius: ${settings.overlapRules.maxSimultaneousBookings}.`,
        },
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { hasConflict: false };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
