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
        message: `Nepakanka atostogų dienų
        Reikalinga: ${workingDays}, Turite: ${availableBalance}, Maksimalus kreditas: ${maxOverdraftDays}`,
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
    userEmail
  );

  if (gapConflict.hasConflict) {
    return {
      hasConflict: true,
      vacationDaysUsed: 0,
      error: {
        type: "GAP_RULE_CONFLICT",
        message: `Rezervacija negalima. Privalomas ${gapConflict.totalGapDays} dienų tarpas tarp atostogaujančių`,
        conflictingVacation: gapConflict.hasConflict,
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
    const dayTypeText = settings.bookingRules.maxDaysPerBooking.dayType === "working"
      ? "darbo dienų"
      : "kalendorinių dienų";

    return {
      hasConflict: true,
      vacationDaysUsed: totalVacationDays,
      error: {
        type: "MAX_DAYS_PER_BOOKING",
        message: `Atostogos negali viršyti ${settings.bookingRules.maxDaysPerBooking.days} ${dayTypeText}`,
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
        const dayTypeText = settings.bookingRules.maxDaysPerYear.dayType === "working"
          ? "darbo dienų"
          : "kalendorinių dienų";

        return {
          hasConflict: true,
          vacationDaysUsed: totalVacationDays,
          error: {
            type: "MAX_BOOKINGS_PER_YEAR",
            message: `Negalima viršyti ${settings.bookingRules.maxDaysPerYear.days} ${dayTypeText} per ${year} metus (Dabartinis: ${bookedDays}, Bandoma užregistruoti: ${daysInYear})`,
            year,
            currentBookedDays: bookedDays,
            attemptingToBook: daysInYear,
          },
        };
      }
    }

    if (settings.bookingRules.maxAdvanceBookingDays.days > 0) {
      const maxDays = settings.bookingRules.maxAdvanceBookingDays.days;
      const dayTypeText = settings.bookingRules.maxAdvanceBookingDays.dayType === "working"
        ? "darbo dienų"
        : "kalendorinių dienų";

      if (daysInAdvance > maxDays) {
        return {
          hasConflict: true,
          vacationDaysUsed: totalVacationDays,
          error: {
            type: "ADVANCE_BOOKING",
            message: `Negalima registruoti atostogų anksčiau nei ${maxDays} ${dayTypeText} į priekį (Dabartinis: ${daysInAdvance} dienų)`,
            currentDays: daysInAdvance,
            maxDays: maxDays,
            dayType: settings.bookingRules.maxAdvanceBookingDays.dayType,
          },
        };
      }
    }
  }

  if (settings.bookingRules.minDaysNotice.days > 0) {
    const minDays = settings.bookingRules.minDaysNotice.days;
    const dayTypeText = settings.bookingRules.minDaysNotice.dayType === "working"
      ? "darbo dienas"
      : "kalendorines dienas";

    if (daysInAdvance < minDays) {
      return {
        hasConflict: true,
        vacationDaysUsed: totalVacationDays,
        error: {
          type: "MIN_NOTICE",
          message: `Atostogas reikia registruoti bent prieš ${minDays} ${dayTypeText} (Dabartinis: ${daysInAdvance} dienų)`,
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
