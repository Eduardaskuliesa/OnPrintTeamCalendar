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
  existingVacations: Vacation[],
  userEmail: string
): { hasConflict: boolean; totalGapDays: number } {
  // 1. Early return if gap rules are disabled or globally bypassed
  if (!settings.gapRules.enabled || settings.gapRules.bypassGapRules) {
    return { hasConflict: false, totalGapDays: 0 };
  }

  // 2. Calculate the total gap days for THIS new vacation
  //    (You mentioned you only want them so you can return/ display them.)
  //    Assume your `calculateGapDays` uses gapRules.daysForGap and 
  //    gapRules.minimumDaysForGap and returns { totalGapDays } or something similar.
  //    If your `calculateGapDays` helper requires endDate, you can pass your new booking’s end.
  const { totalGapDays } = calculateGapDays(endDate, settings, startDate);

  // 3. If totalGapDays is purely for “showing,” we keep it. 
  //    Next, we must check if your NEW vacation overlaps the gap range of ANY existing vacation.

  // Filter out (skip) any existing vacations belonging to users in `canIgnoreGapsof`
  // because we do NOT want to enforce gap for those users.
  const canIgnoreEmails = settings.gapRules.canIgnoreGapsof ?? [];
  const vacationsToCheck = existingVacations.filter((vac) => {
    // If the existing vacation belongs to an email we can ignore, skip it
    if (canIgnoreEmails.includes(vac.userEmail)) {
      return false;
    }
    // Otherwise, keep it
    return true;
  });

  // 4. Loop through the filtered vacations to see if our NEW booking
  //    starts inside their “gap range”.
  for (const vacation of vacationsToCheck) {
    // Convert string to Date if needed
    const vacationEnd = new Date(vacation.endDate);

    // Example “gap range”: from day after vacationEnd to `vacationEnd + <someNumber> of days`.
    // For demonstration, let’s say we always want to use `daysForGap.days` 
    // or whichever your logic is for that existing user’s gap. 
    // If you want to do the same logic as `calculateGapDays`, you can also call it again 
    // to figure out that existing user’s total gap. It depends on your business logic.

    // A very simple approach: 
    //   let gap = settings.gapRules.daysForGap.days; // e.g. 4
    //   let gapStart = addDays(vacationEnd, 1);
    //   let gapEnd   = addDays(vacationEnd, gap);

    // But if you want “working days”, your `calculateGapDays` might handle it. 
    // In that case, we can do something like:
    const { totalGapDays: existingVacationGap } = calculateGapDays(
      vacationEnd,
      settings,
      // Possibly pass vacation.startDate or the same vacationEnd 
      // if your function only needs one range for that user. 
      new Date(vacation.startDate) 
    );
    // In your example, if this returns 4, that means 4-day gap after vacationEnd.

    // gap range => from vacationEnd+1 day up to vacationEnd + existingVacationGap
    const gapStartDate = new Date(vacationEnd);
    gapStartDate.setDate(gapStartDate.getDate() + 1); // day after vacation ends

    const gapEndDate = new Date(vacationEnd);
    gapEndDate.setDate(gapEndDate.getDate() + existingVacationGap);

    // Now check if the new vacation’s start is within that range
    // i.e., startDate >= gapStartDate and startDate <= gapEndDate
    if (startDate >= gapStartDate && startDate <= gapEndDate) {
      return { hasConflict: true, totalGapDays };
    }
  }

  // 5. If we got here, no conflict => return
  return { hasConflict: false, totalGapDays };
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
