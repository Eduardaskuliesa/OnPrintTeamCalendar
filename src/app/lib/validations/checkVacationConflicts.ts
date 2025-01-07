"use server";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { User } from "@/app/types/api";
import {
  calculateDaysInAdvance,
  calculateGapDays,
  calculateVacationDays,
} from "./helpers";
import {
  checkSeasonalConflict,
  checkGapRuleConflict,
  checkOverlapConflict,
  checkCustomRestrictedDays,
} from "./rules";

export async function checkVacationConflicts(
  startDate: string,
  endDate: string,
  settings: GlobalSettingsType,
  existingVacations: any[],
  userEmail: string,
  user: User
) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const userVacations = existingVacations.filter(
    (vacation) => vacation.userEmail === userEmail
  );

  const { workingDays, totalVacationDays } = calculateVacationDays(
    startDateObj,
    endDateObj,
    settings
  );

  const daysInAdvance = calculateDaysInAdvance(startDateObj, settings);

  const overdraftRules = settings.bookingRules.overdraftRules;
  const availableBalance = user.vacationDays;
  const maxOverdraftDays = overdraftRules.useStrict
    ? 0
    : overdraftRules.maximumOverdraftDays;
  const totalAvailableDays = availableBalance + maxOverdraftDays;

  if (workingDays > totalAvailableDays) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: {
        type: "INSUFFICIENT_VACATION_DAYS",
        message: `Not enough vacation days. Required: ${workingDays}, Available: ${availableBalance}, Allowed overdraft: ${maxOverdraftDays}`,
      },
    };
  }

  const newBalance = Math.max(
    availableBalance - workingDays,
    -maxOverdraftDays
  );

  const overlapConflict = checkOverlapConflict(
    startDateObj,
    endDateObj,
    settings,
    existingVacations,
    userEmail
  );

  if (overlapConflict.hasConflict) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: overlapConflict.error,
    };
  }

  const gapConflict = checkGapRuleConflict(
    startDateObj,
    endDateObj,
    settings,
    existingVacations,
  );

  if (gapConflict.hasConflict) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: {
        type: "GAP_RULE_CONFLICT",
        message: `Cannot book within ${gapConflict.totalGapDays} days of another team member's vacation`,
        conflictingVacation: gapConflict.conflictingVacation,
      },
    };
  }

  if (!settings.bookingRules.enabled) {
    return {
      hasConflict: false,
      vacationDaysUsed: totalVacationDays,
      gapDays: settings.gapRules.enabled
        ? calculateGapDays(endDateObj, settings).totalGapDays
        : 0,
    };
  }

  if (
    settings.bookingRules.maxDaysPerBooking.days > 0 &&
    totalVacationDays > settings.bookingRules.maxDaysPerBooking.days
  ) {
    return {
      hasConflict: true,
      vacationDaysUsed: totalVacationDays,
      error: {
        type: "MAX_DAYS_PER_BOOKING",
        message: `Vacation cannot exceed ${settings.bookingRules.maxDaysPerBooking.days} ${settings.bookingRules.maxDaysPerBooking.dayType} days`,
      },
    };
  }

  if (settings.bookingRules.maxDaysPerYear.days > 0) {
    const { yearlyBreakdown } = calculateVacationDays(
      startDateObj,
      endDateObj,
      settings
    );

    for (const [year, daysInYear] of Object.entries(yearlyBreakdown)) {
      const yearBookings = userVacations.filter((vacation) => {
        const vacationStart = new Date(vacation.startDate);
        return vacationStart.getFullYear().toString() === year;
      });

      const bookedDays = yearBookings.reduce((total, booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        const effectiveStart = bookingStart;
        const effectiveEnd =
          bookingEnd.getFullYear().toString() === year
            ? bookingEnd
            : new Date(parseInt(year), 11, 31);

        const { workingDays } = calculateVacationDays(
          effectiveStart,
          effectiveEnd,
          settings
        );

        return total + workingDays;
      }, 0);

      if (bookedDays + daysInYear > settings.bookingRules.maxDaysPerYear.days) {
        return {
          hasConflict: true,
          vacationDaysUsed: totalVacationDays,
          error: {
            type: "MAX_BOOKINGS_PER_YEAR",
            message: `Cannot exceed ${settings.bookingRules.maxDaysPerYear.days} vacation bookings for year ${year} (Current: ${bookedDays}, Attempting to book: ${daysInYear})`,
            year,
            currentBookedDays: bookedDays,
            attemptingToBook: daysInYear,
          },
        };
      }
    }
  }

  if (settings.bookingRules.maxAdvanceBookingDays.days > 0) {
    const maxDays = settings.bookingRules.maxAdvanceBookingDays.days;

    if (daysInAdvance > maxDays) {
      return {
        hasConflict: true,
        vacationDaysUsed: totalVacationDays,
        error: {
          type: "ADVANCE_BOOKING",
          message: `Cannot book more than ${maxDays} ${settings.bookingRules.maxAdvanceBookingDays.dayType} days in advance (Current: ${daysInAdvance} days)`,
          currentDays: daysInAdvance,
          maxDays: maxDays,
          dayType: settings.bookingRules.maxAdvanceBookingDays.dayType,
        },
      };
    }
  }

  if (settings.bookingRules.minDaysNotice.days > 0) {
    const minDays = settings.bookingRules.minDaysNotice.days;

    if (daysInAdvance < minDays) {
      return {
        hasConflict: true,
        vacationDaysUsed: totalVacationDays,
        error: {
          type: "MIN_NOTICE",
          message: `Must book at least ${minDays} ${settings.bookingRules.minDaysNotice.dayType} days in advance (Current: ${daysInAdvance} days)`,
          currentDays: daysInAdvance,
          requiredDays: minDays,
          dayType: settings.bookingRules.minDaysNotice.dayType,
        },
      };
    }
  }

  const seasonalConflict = checkSeasonalConflict(
    startDateObj,
    endDateObj,
    settings
  );
  if (seasonalConflict.hasConflict) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: seasonalConflict.error,
    };
  }

  const customRestrictedConflict = checkCustomRestrictedDays(
    startDateObj,
    endDateObj,
    settings
  );
  if (customRestrictedConflict.hasConflict) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: customRestrictedConflict.error,
    };
  }

  return {
    hasConflict: false,
    vacationDaysUsed: totalVacationDays,
    gapDays: settings.gapRules.enabled
      ? calculateGapDays(endDateObj, settings, startDateObj).totalGapDays
      : 0,
    newBalance: newBalance,
  };
}
