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


interface VacationType {
  userEmail: string;
  startDate: string | Date;
  endDate: string | Date;
}

export function checkGapRuleConflict(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType,
  existingVacations: VacationType[],
  userEmail: string
): { hasConflict: boolean; conflictingVacation?: VacationType; totalGapDays?: number } {
  // Early returns for disabled rules
  if (!settings.gapRules.enabled) {
    return { hasConflict: false };
  }

  // Bypass all gap rules if the setting is enabled
  if (settings.gapRules.bypassGapRules) {
    return { hasConflict: false };
  }

  // Filter out vacations that should be checked
  const vacationsToCheck = existingVacations.filter((vacation) => {
    // Skip self bookings if gap rules are bypassed
    if (vacation.userEmail === userEmail) {
      return !settings.gapRules.bypassGapRules;
    }

    // Skip vacations from users in the ignore list
    if (settings.gapRules.canIgnoreGapsof?.includes(vacation.userEmail)) {
      return false;
    }

    return true;
  });

  // Calculate minimum duration for gap rules to apply
  const minimumDaysForGap = settings.gapRules.minimumDaysForGap.days;
  const newBookingDuration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check each existing vacation for conflicts
  for (const vacation of vacationsToCheck) {
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

    // Calculate gap requirements
    const { gapEndDate: existingVacationGapEnd, totalGapDays: existingGapDays } = calculateGapDays(
      vacationEndDate,
      settings,
      vacationStartDate
    );

    const { gapEndDate: newBookingGapEnd, totalGapDays: newGapDays } = calculateGapDays(
      endDate,
      settings,
      startDate
    );

    // Check if there's an overlap first
    const hasOverlap = (
      (startDate <= vacationEndDate && startDate >= vacationStartDate) ||
      (endDate <= vacationEndDate && endDate >= vacationStartDate) ||
      (startDate <= vacationStartDate && endDate >= vacationEndDate)
    );

    // If there's an overlap, let the overlap rules handle it
    if (hasOverlap) {
      continue;
    }

    // Now check gap violations
    // Case 1: New booking starts too soon after existing vacation
    if (startDate > vacationEndDate && startDate <= existingVacationGapEnd) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays: existingGapDays
      };
    }

    // Case 2: Existing vacation starts too soon after new booking
    if (vacationStartDate > endDate && vacationStartDate <= newBookingGapEnd) {
      return {
        hasConflict: true,
        conflictingVacation: vacation,
        totalGapDays: newGapDays
      };
    }
  }

  // No conflicts found
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
