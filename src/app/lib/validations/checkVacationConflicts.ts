import { GlobalSettingsType } from "@/app/types/bookSettings";

function isWorkingDay(
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

function calculateDaysInAdvance(
  startDate: Date,
  settings: GlobalSettingsType
): number {
  const today = new Date();
  const weekendRestriction = settings.restrictedDays.weekends.restriction;
  const dayType = settings.bookingRules.maxAdvanceBookingDays.dayType;

  let daysInAdvance = 0;
  const currentDate = new Date(today);

  while (currentDate < startDate) {
    if (dayType === "working") {
      if (isWorkingDay(currentDate, weekendRestriction)) {
        daysInAdvance++;
      }
    } else {
      daysInAdvance++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return daysInAdvance;
}

// Function to calculate vacation days considering different constraints
function calculateVacationDays(
  startDate: Date,
  endDate: Date,
  settings: GlobalSettingsType
): { workingDays: number; calendarDays: number; totalVacationDays: number } {
  let workingDays = 0;
  let calendarDays = 0;
  let totalVacationDays = 0;
  const current = new Date(startDate);
  const weekendRestriction = settings.restrictedDays.weekends.restriction;
  const holidays = settings.restrictedDays.holidays || [];
  const dayType = settings.bookingRules.maxDaysPerBooking.dayType;

  while (current <= endDate) {
    calendarDays++;

    const isValidWorkingDay = isWorkingDay(current, weekendRestriction);
    const isHoliday = holidays.some((holiday) => {
      const holidayDate = new Date(holiday);
      return (
        holidayDate.getFullYear() === current.getFullYear() &&
        holidayDate.getMonth() === current.getMonth() &&
        holidayDate.getDate() === current.getDate()
      );
    });
    if (isValidWorkingDay && !isHoliday) {
      workingDays++;
    }
    if (dayType === "working") {
      if (isValidWorkingDay && !isHoliday) {
        totalVacationDays++;
      }
    } else {
      totalVacationDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return { workingDays, calendarDays, totalVacationDays };
}

export async function checkVacationConflicts(
  startDate: string,
  endDate: string,
  settings: GlobalSettingsType,
  existingVacations: any[],
  userEmail: string
) {
  const userVacations = existingVacations.filter(
    (vacation) => vacation.userEmail === userEmail
  );

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const { workingDays, calendarDays, totalVacationDays } =
    calculateVacationDays(startDateObj, endDateObj, settings);

  const daysInAdvance = calculateDaysInAdvance(startDateObj, settings);

  console.log("Vacation Days Used:", {
    totalVacationDays,
    workingDays,
    calendarDays,
    daysInAdvance,
    startDate,
    endDate,
    weekendRestriction: settings.restrictedDays.weekends.restriction,
    dayType: settings.bookingRules.maxDaysPerBooking.dayType,
    advanceDayType: settings.bookingRules.maxAdvanceBookingDays.dayType,
  });

  if (!settings.bookingRules.enabled) {
    return { hasConflict: false, vacationDaysUsed: totalVacationDays };
  }

  if (settings.bookingRules.maxDaysPerYear.days > 0) {
    const currentYear = new Date().getFullYear();
    const yearBookings = userVacations.filter((vacation) => {
      const vacationYear = new Date(vacation.startDate).getFullYear();
      return vacationYear === currentYear;
    });

    const bookedDays = yearBookings.reduce((total, booking) => {
      const bookingDays = calculateVacationDays(
        new Date(booking.startDate),
        new Date(booking.endDate),
        settings
      );
      return total + bookingDays.totalVacationDays;
    }, 0);

    if (
      bookedDays + totalVacationDays >
      settings.bookingRules.maxDaysPerYear.days
    ) {
      return {
        hasConflict: true,
        vacationDaysUsed: totalVacationDays,
        error: {
          type: "MAX_BOOKINGS_PER_YEAR",
          message: `Cannot exceed ${settings.bookingRules.maxDaysPerYear.days} vacation bookings per year (Current: ${bookedDays})`,
        },
      };
    }
  }

  // Check max days per booking
  if (settings.bookingRules.maxDaysPerBooking.days > 0) {
    const maxDays = settings.bookingRules.maxDaysPerBooking.days;

    if (totalVacationDays > maxDays) {
      return {
        hasConflict: true,
        vacationDaysUsed: totalVacationDays,
        error: {
          type: "MAX_DAYS_PER_BOOKING",
          message: `Vacation cannot exceed ${maxDays} ${settings.bookingRules.maxDaysPerBooking.dayType} days`,
        },
      };
    }
  }

  // Check max advance booking days
  if (
    settings.bookingRules.maxAdvanceBookingDays.days > 0 &&
    daysInAdvance > settings.bookingRules.maxAdvanceBookingDays.days
  ) {
    return {
      hasConflict: true,
      vacationDaysUsed: totalVacationDays,
      error: {
        type: "ADVANCE_BOOKING",
        message: `Cannot book more than ${settings.bookingRules.maxAdvanceBookingDays.days} days in advance`,
      },
    };
  }

  // Minimum notice days
  const minNoticeDays = calculateDaysInAdvance(startDateObj, {
    ...settings,
    bookingRules: {
      ...settings.bookingRules,
      maxAdvanceBookingDays: settings.bookingRules.minDaysNotice,
    },
  });

  if (
    settings.bookingRules.minDaysNotice.days > 0 &&
    minNoticeDays < settings.bookingRules.minDaysNotice.days
  ) {
    return {
      hasConflict: true,
      vacationDaysUsed: totalVacationDays,
      error: {
        type: "MIN_NOTICE",
        message: `Must book at least ${settings.bookingRules.minDaysNotice.days} days in advance`,
      },
    };
  }

  return {
    hasConflict: false,
    vacationDaysUsed: totalVacationDays,
  };
}
