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

  // Check if working days exceeds user's available vacation days
  if (workingDays > user.vacationDays) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: {
        type: "INSUFFICIENT_VACATION_DAYS",
        message: `Not enough vacation days. Required: ${workingDays}, Available: ${user.vacationDays}`,
      },
    };
  }

  // First check overlap (including self-overlap)
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

  // Check gap rules
  const gapConflict = checkGapRuleConflict(
    startDateObj,
    endDateObj,
    settings,
    existingVacations,
    userEmail
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

  // Skip other rules if booking rules are disabled
  if (!settings.bookingRules.enabled) {
    return {
      hasConflict: false,
      vacationDaysUsed: totalVacationDays,
      gapDays: settings.gapRules.enabled
        ? calculateGapDays(endDateObj, settings).totalGapDays
        : 0,
    };
  }

  // Check max days per booking
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

  // Check yearly limits
  if (settings.bookingRules.maxDaysPerYear.days > 0) {
    // Get yearly breakdown of new booking
    const { yearlyBreakdown } = calculateVacationDays(
      startDateObj,
      endDateObj,
      settings
    );

    // Check each year independently
    for (const [year, daysInYear] of Object.entries(yearlyBreakdown)) {
      // Only get vacations for this specific year
      const yearBookings = userVacations.filter((vacation) => {
        const vacationStart = new Date(vacation.startDate);
        return vacationStart.getFullYear().toString() === year;
      });

      // Calculate days used in this year
      const bookedDays = yearBookings.reduce((total, booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        // Only count days that fall within this year
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

      // Check if adding new vacation would exceed the limit for this year
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

  // Check advance booking limits
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

  // Check minimum notice period
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

  // Check seasonal and custom restricted days last
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
      ? calculateGapDays(endDateObj, settings).totalGapDays
      : 0,
  };
}
