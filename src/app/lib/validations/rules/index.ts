// src/app/validations/rules/index.ts

import { GlobalSettingsType } from "@/app/types/bookSettings";


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
          message: `Cannot book vacation during blackout period: ${period.name} (${period.start} to ${period.end})`,
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
  existingVacations: any[],
  userEmail: string
): { hasConflict: boolean; conflictingVacation?: any; totalGapDays?: number } {
  // Early returns for disabled rules
  if (!settings.gapRules.enabled) {
    return { hasConflict: false };
  }

  // Calculate minimum duration for gap rules to apply
  const minimumDaysForGap = settings.gapRules.minimumDaysForGap.days;
  const newBookingDuration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check each existing vacation for conflicts
  for (const vacation of existingVacations) {
    // Skip if the requesting user can bypass this vacation's gap rules
    if (settings.gapRules.canIgnoreGapsof?.includes(userEmail)) {
      continue;
    }

    const vacationStartDate = new Date(vacation.startDate);
    const vacationEndDate = new Date(vacation.endDate);

    // Calculate existing vacation duration
    const existingVacationDuration = Math.ceil(
      (vacationEndDate.getTime() - vacationStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Skip gap check if both vacations are shorter than minimum duration
    if (existingVacationDuration < minimumDaysForGap && newBookingDuration < minimumDaysForGap) {
      continue;
    }

    // Skip if vacation has no gap days
    if (!vacation.gapDays || vacation.gapDays === 0) {
      continue;
    }

    // Calculate the gap end date for this vacation
    const gapEndDate = new Date(vacationEndDate);
    let workingDaysAdded = 0;
    let daysToAdd = 0;

    while (workingDaysAdded < vacation.gapDays) {
      daysToAdd++;
      const currentDate = new Date(vacationEndDate);
      currentDate.setDate(currentDate.getDate() + daysToAdd);
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        workingDaysAdded++;
      }
    }
    gapEndDate.setDate(gapEndDate.getDate() + daysToAdd);

    // Check if new booking overlaps with gap period
    const overlapsGap = (
      // New booking starts during gap period
      (startDate <= gapEndDate && startDate > vacationEndDate) ||
      // New booking ends during gap period
      (endDate <= gapEndDate && endDate > vacationEndDate) ||
      // New booking completely spans gap period
      (startDate <= vacationEndDate && endDate >= gapEndDate)
    );

    if (overlapsGap) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays: vacation.gapDays
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
          message: `Cannot book vacation including restricted date: ${restrictedDay}`,
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
  existingVacations: any[],
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
        message:
          "Cannot book vacation that overlaps with your existing vacations",
      },
    };
  }

  if (!settings.overlapRules.enabled) {
    return { hasConflict: false };
  }

  if (settings.overlapRules.bypassOverlapRules) {
    return { hasConflict: false };
  }

  const vacationsToCheck = existingVacations.filter((vacation) => {
    if (
      settings.overlapRules.canIgnoreOverlapRulesOf?.includes(
        vacation.userEmail
      )
    ) {
      return false;
    }
    if (vacation.userEmail === userEmail) {
      return false;
    }
    return true;
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
          message: `Cannot exceed ${settings.overlapRules.maxSimultaneousBookings} simultaneous bookings`,
        },
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { hasConflict: false };
}
