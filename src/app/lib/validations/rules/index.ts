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
  if (!settings.gapRules.enabled) {
    return { hasConflict: false };
  }

  if (settings.gapRules.bypassGapRules) {
    return { hasConflict: false };
  }

  const vacationsToCheck = existingVacations.filter((vacation) => {
    if (vacation.userEmail === userEmail && !settings.gapRules.bypassGapRules) {
      return true;
    }

    if (
      vacation.userEmail !== userEmail &&
      settings.gapRules.canIgnoreGapsof?.includes(vacation.userEmail)
    ) {
      return false;
    }

    return vacation.userEmail !== userEmail;
  });

  for (const vacation of vacationsToCheck) {
    const vacationEndDate = new Date(vacation.endDate);
    const { gapEndDate, totalGapDays } = calculateGapDays(
      vacationEndDate,
      settings
    );

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

    const newBookingGap = calculateGapDays(endDate, settings);

    if (
      (new Date(vacation.startDate) >= endDate &&
        new Date(vacation.startDate) <= newBookingGap.gapEndDate) ||
      (new Date(vacation.endDate) >= endDate &&
        new Date(vacation.endDate) <= newBookingGap.gapEndDate) ||
      (new Date(vacation.startDate) <= endDate &&
        new Date(vacation.endDate) >= newBookingGap.gapEndDate)
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
