// src/app/validations/helpers/index.ts
import { GlobalSettingsType } from "@/app/types/bookSettings";

// Helper to check if a date matches a holiday (comparing only month and day, ignoring year)
function isHolidayMatch(holiday: string, date: Date): boolean {
  // Holiday can be in "MM-DD" or "YYYY-MM-DD" format
  const parts = holiday.split("-");
  let holidayMonth: number;
  let holidayDay: number;

  if (parts.length === 2) {
    // MM-DD format
    holidayMonth = parseInt(parts[0], 10) - 1; // JS months are 0-indexed
    holidayDay = parseInt(parts[1], 10);
  } else if (parts.length === 3) {
    // YYYY-MM-DD format - ignore year
    holidayMonth = parseInt(parts[1], 10) - 1;
    holidayDay = parseInt(parts[2], 10);
  } else {
    return false;
  }

  return date.getMonth() === holidayMonth && date.getDate() === holidayDay;
}

export function isWorkingDay(
  date: Date,
  weekendRestriction: GlobalSettingsType["restrictedDays"]["weekends"]["restriction"]
): boolean {
  const day = date.getDay();

  switch (weekendRestriction) {
    case "none":
      return day >= 1 && day <= 5;
    case "all":
      return true;
    case "saturday-only":
      return day !== 6;
    case "sunday-only":
      return day !== 0;
    default:
      return true;
  }
}

export function calculateBookedDaysForYear(
  yearBookings: any[],
  year: string,
  settings: GlobalSettingsType
) {
  return yearBookings.reduce((total, booking) => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);

    const effectiveStart =
      bookingStart.getFullYear().toString() === year
        ? bookingStart
        : new Date(parseInt(year), 0, 1);

    const effectiveEnd =
      bookingEnd.getFullYear().toString() === year
        ? bookingEnd
        : new Date(parseInt(year), 11, 31);

    const bookingDays = calculateVacationDays(
      effectiveStart,
      effectiveEnd,
      settings
    );

    return total + bookingDays.totalVacationDays;
  }, 0);
}

export function calculateDaysInAdvance(
  startDate: Date,
  settings: GlobalSettingsType
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingStart = new Date(startDate);
  bookingStart.setHours(0, 0, 0, 0);

  // If start date is today or in the past, return 0
  if (bookingStart <= today) {
    return 0;
  }

  const weekendRestriction = settings.restrictedDays.weekends.restriction;
  const dayType = settings.bookingRules.maxAdvanceBookingDays.dayType;

  let daysInAdvance = 0;
  const currentDate = new Date(today);

  if (dayType === "working") {
    if (isWorkingDay(currentDate, weekendRestriction)) {
      daysInAdvance++;
    }
  } else {
    daysInAdvance++;
  }


  while (currentDate < bookingStart) {
    currentDate.setDate(currentDate.getDate() + 1);

    if (dayType === "working") {
      if (isWorkingDay(currentDate, weekendRestriction)) {
        daysInAdvance++;
      }
    } else {
      daysInAdvance++;
    }
  }

  return daysInAdvance;
}

function calculateDuration(
  startDate: Date,
  endDate: Date,
  dayType: "working" | "calendar",
  weekendRestriction: "all" | "none" | "saturday-only" | "sunday-only",
  holidays: string[]
): number {
  let duration = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (dayType === "working") {
      const isValidWorkingDay = isWorkingDay(currentDate, weekendRestriction);
      const isHoliday = holidays.some((holiday) => isHolidayMatch(holiday, currentDate));

      if (isValidWorkingDay && !isHoliday) {
        duration++;
      }
    } else {
      duration++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return duration;
}

export function calculateGapDays(
  endDate: Date,
  settings: GlobalSettingsType,
  startDate?: Date
): { gapEndDate: Date; totalGapDays: number } {
  const gapDays = settings.gapRules.daysForGap.days;
  const dayType = settings.gapRules.daysForGap.dayType;
  const weekendRestriction = settings.restrictedDays.weekends.restriction;
  const holidays = settings.restrictedDays.holidays || [];
  const minGapDays = settings.gapRules.minimumDaysForGap.days;
  const minGapDayType = settings.gapRules.minimumDaysForGap.dayType;

  if (startDate) {
    const vacationDuration = calculateDuration(
      startDate,
      endDate,
      minGapDayType,
      weekendRestriction,
      holidays
    );

    if (vacationDuration <= minGapDays) {
      return {
        gapEndDate: new Date(endDate),
        totalGapDays: 0,
      };
    }
  }

  const currentDate = new Date(endDate);
  currentDate.setDate(currentDate.getDate() + 1);

  let gapDaysCount = 0;
  let totalDays = 0;

  while (gapDaysCount < gapDays) {
    if (dayType === "working") {
      const isValidWorkingDay = isWorkingDay(currentDate, weekendRestriction);
      const isHoliday = holidays.some((holiday) => isHolidayMatch(holiday, currentDate));

      if (isValidWorkingDay && !isHoliday) {
        gapDaysCount++;
      }
    } else {
      gapDaysCount++;
    }

    totalDays++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const gapEndDate = new Date(endDate);
  gapEndDate.setDate(gapEndDate.getDate() + totalDays);

  return {
    gapEndDate,
    totalGapDays: totalDays,
  };
}

export function calculateVacationDays(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType
): {
  workingDays: number;
  calendarDays: number;
  totalVacationDays: number;
  yearlyBreakdown: Record<number, number>;
} {
  let workingDays = 0;
  let calendarDays = 0;
  let totalVacationDays = 0;
  const yearlyBreakdown: Record<number, number> = {};

  const current = new Date(startDate);
  const weekendRestriction = settings.restrictedDays.weekends.restriction;
  const holidays = settings.restrictedDays.holidays || [];
  const dayType = settings.bookingRules.maxDaysPerYear.dayType;

  while (current <= endDate) {
    const currentYear = current.getFullYear();
    calendarDays++;

    const isValidWorkingDay = isWorkingDay(current, weekendRestriction);
    const isHoliday = holidays.some((holiday) => isHolidayMatch(holiday, current));

    if (isValidWorkingDay && !isHoliday) {
      workingDays++;
    }

    if (dayType === "working") {
      if (isValidWorkingDay && !isHoliday) {
        totalVacationDays++;
        yearlyBreakdown[currentYear] = (yearlyBreakdown[currentYear] || 0) + 1;
      }
    } else {
      totalVacationDays++;
      yearlyBreakdown[currentYear] = (yearlyBreakdown[currentYear] || 0) + 1;
    }

    current.setDate(current.getDate() + 1);
  }

  return { workingDays, calendarDays, totalVacationDays, yearlyBreakdown };
}
