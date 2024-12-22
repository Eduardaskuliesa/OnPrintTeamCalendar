import { GlobalSettingsType } from "@/app/types/bookSettings";

function getTotalDays(
  startDate: Date,
  endDate: Date,
  holidays: string[] = []
): number {
  let total =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Subtract holidays that fall within the date range
  for (const holiday of holidays) {
    const holidayDate = new Date(holiday);
    if (startDate <= holidayDate && endDate >= holidayDate) {
      total--;
    }
  }

  return total;
}

export async function checkVacationConflicts(
  startDate: string,
  endDate: string,
  settings: GlobalSettingsType,
  existingVacations: any[]
) {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const totalDays = getTotalDays(
    startDateObj,
    endDateObj,
    settings.restrictedDays.holidays
  );

  console.log(settings);

  if (settings.bookingRules.enabled) {
    // Max days per booking - only check if greater than 0
    if (
      settings.bookingRules.maxDaysPerBooking > 0 &&
      totalDays > settings.bookingRules.maxDaysPerBooking
    ) {
      return {
        hasConflict: true,
        error: {
          type: "MAX_DAYS_PER_BOOKING",
          message: `Vacation cannot exceed ${settings.bookingRules.maxDaysPerBooking} days`,
        },
      };
    }

    // Max advance booking days - only check if greater than 0
    const daysInAdvance = Math.ceil(
      (startDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (
      settings.bookingRules.maxAdvanceBookingDays > 0 &&
      daysInAdvance > settings.bookingRules.maxAdvanceBookingDays
    ) {
      return {
        hasConflict: true,
        error: {
          type: "ADVANCE_BOOKING",
          message: `Cannot book more than ${settings.bookingRules.maxAdvanceBookingDays} days in advance`,
        },
      };
    }

    // Minimum notice days - only check if greater than 0
    if (
      settings.bookingRules.minDaysNotice > 0 &&
      daysInAdvance < settings.bookingRules.minDaysNotice
    ) {
      return {
        hasConflict: true,
        error: {
          type: "MIN_NOTICE",
          message: `Must book at least ${settings.bookingRules.minDaysNotice} days in advance`,
        },
      };
    }

    if (settings.bookingRules.maxDaysPerYear > 0) {
      // Using user.totalYearlyVacationDays instead of calculating from existingVacations

      const totalYearDays = settings.bookingRules.maxDaysPerYear + totalDays;

      if (totalYearDays > settings.bookingRules.maxDaysPerYear) {
        return {
          hasConflict: true,
          error: {
            type: "MAX_DAYS_PER_YEAR",
            message: `Cannot exceed ${settings.bookingRules.maxDaysPerYear} vacation days per year`,
          },
        };
      }
    }
  }

  // Overlap Rules
  if (settings.overlapRules.enabled) {
    // Only check for overlaps if enabled is true
    const overlappingVacations = existingVacations.filter((vacation) => {
      const vacStart = new Date(vacation.startDate);
      const vacEnd = new Date(vacation.endDate);
      return startDateObj <= vacEnd && endDateObj >= vacStart;
    });

    // If maxSimultaneousBookings > 0, check if we exceed the limit
    if (
      settings.overlapRules.maxSimultaneousBookings > 0 &&
      overlappingVacations.length >=
        settings.overlapRules.maxSimultaneousBookings
    ) {
      return {
        hasConflict: true,
        error: {
          type: "MAX_SIMULTANEOUS",
          message: `Cannot have more than ${settings.overlapRules.maxSimultaneousBookings} overlapping vacations`,
          dates: overlappingVacations.map((v) => ({
            start: v.startDate,
            end: v.endDate,
          })),
        },
      };
    }
  }
  // Restricted Days
  if (settings.restrictedDays.enabled) {
    // Weekend restrictions (unchanged)
    const current = new Date(startDateObj);
    while (current <= endDateObj) {
      const day = current.getDay();
      const restriction = settings.restrictedDays.weekends.restriction;

      if (
        (restriction === "all" && (day === 0 || day === 6)) ||
        (restriction === "saturday-only" && day === 6) ||
        (restriction === "sunday-only" && day === 0)
      ) {
        return {
          hasConflict: true,
          error: {
            type: "WEEKEND_RESTRICTION",
            message: "Selected dates include restricted weekend days",
          },
        };
      }
      current.setDate(current.getDate() + 1);
    }

    // Holiday restrictions
    for (const holiday of settings.restrictedDays.holidays) {
      const holidayDate = new Date(holiday);
      if (startDateObj <= holidayDate && endDateObj >= holidayDate) {
        return {
          hasConflict: true,
          error: {
            type: "HOLIDAY_RESTRICTION",
            message: "Selected dates include restricted holiday",
          },
        };
      }
    }

    // Custom restricted days
    for (const restrictedDay of settings.restrictedDays.customRestricted) {
      const restrictedDate = new Date(restrictedDay);
      if (startDateObj <= restrictedDate && endDateObj >= restrictedDate) {
        return {
          hasConflict: true,
          error: {
            type: "CUSTOM_RESTRICTION",
            message: "Selected dates include custom restricted days",
          },
        };
      }
    }
  }

  // Seasonal Rules
  if (settings.seasonalRules.enabled) {
    // Blackout periods
    for (const blackout of settings.seasonalRules.blackoutPeriods) {
      const blackoutStart = new Date(blackout.start);
      const blackoutEnd = new Date(blackout.end);

      if (startDateObj <= blackoutEnd && endDateObj >= blackoutStart) {
        return {
          hasConflict: true,
          error: {
            type: "BLACKOUT_PERIOD",
            message: `Selected dates fall within blackout period: ${blackout.name}`,
          },
        };
      }
    }
  }

  // Gap Rules
  if (settings.gapRules.enabled) {
    for (const vacation of existingVacations) {
      // Only check if this vacation has gap days stored
      if (vacation.gapDays > 0) {
        const vacEnd = new Date(vacation.endDate);

        const gapStart = new Date(
          new Date(vacEnd).setDate(new Date(vacEnd).getDate() + 1)
        ).toISOString();

        const gapEnd = new Date(
          new Date(vacEnd).setDate(
            new Date(vacEnd).getDate() + Number(vacation.gapDays)
          )
        ).toISOString();

        if (
          startDateObj <= new Date(gapEnd) &&
          endDateObj >= new Date(gapStart)
        ) {
          return {
            hasConflict: true,
            error: {
              type: "GAP_RULE",
              message: `Must maintain ${vacation.gapDays} days gap after vacation from ${vacation.startDate} to ${vacation.endDate}`,
              dates: [{ start: gapStart, end: gapEnd }],
            },
          };
        }
      }
    }
  }

  return { hasConflict: false };
}
