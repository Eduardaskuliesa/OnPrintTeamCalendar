// src/app/validations/rules/index.ts

import { GlobalSettingsType } from "@/app/types/bookSettings";
import { calculateGapDays } from "../helpers";

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
  if (!settings.gapRules.enabled || settings.gapRules.bypassGapRules) {
    return { hasConflict: false };
  }

  // Filter vacations
  const vacationsToCheck = existingVacations.filter((vacation) => {
    if (vacation.userEmail === userEmail) {
      return !settings.gapRules.bypassGapRules;
    }

    if (settings.gapRules.canIgnoreGapsof?.includes(vacation.userEmail)) {
      return false;
    }

    return vacation.userEmail !== userEmail;
  });

  for (const vacation of vacationsToCheck) {
    const vacationStartDate = new Date(vacation.startDate);
    const vacationEndDate = new Date(vacation.endDate);

    // Calculate gap days including the vacation's start date
    const { gapEndDate, totalGapDays } = calculateGapDays(
      vacationEndDate,
      settings,
      vacationStartDate // Pass the vacation's start date
    );

    // If there are no gap days required, skip this vacation
    if (totalGapDays === 0) {
      continue;
    }

    // Check if new booking conflicts with the gap period
    if (
      (startDate <= gapEndDate && startDate >= vacationEndDate) ||
      (endDate <= gapEndDate && endDate >= vacationEndDate) ||
      (startDate <= vacationEndDate && endDate >= gapEndDate)
    ) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays,
      };
    }

    // Check if existing vacation conflicts with the new booking's gap period
    const newBookingGap = calculateGapDays(
      endDate,
      settings,
      startDate // Pass the start date for the new booking
    );

    // Skip if no gap days are required for the new booking
    if (newBookingGap.totalGapDays === 0) {
      continue;
    }

    if (
      (vacationStartDate >= endDate &&
        vacationStartDate <= newBookingGap.gapEndDate) ||
      (vacationEndDate >= endDate &&
        vacationEndDate <= newBookingGap.gapEndDate) ||
      (vacationStartDate <= endDate &&
        vacationEndDate >= newBookingGap.gapEndDate)
    ) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays: newBookingGap.totalGapDays,
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
