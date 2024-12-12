export interface GlobalSettings {
  gapRules: {
    enabled: boolean;
    days: number;
  };
  bookingRules: {
    maxDaysPerBooking: number; // Maximum days per single vacation
    maxDaysPerYear: number; // Maximum vacation days per year
    maxAdvanceBookingDays: number; // How far in advance can book (e.g., 180 days)
    minDaysNotice: {
      enabled: boolean;
      days: number;
    }; // Minimum days before vacation can start
  };
  overlapRules: {
    enabled: boolean;
    maxSimultaneousBookings: number; // How many people can be on vacation at once
  };
  restrictedDays: {
    holidays: string[]; // Array of holiday dates that don't count as vacation
    weekends: boolean; // Whether weekends count as vacation days
    customRestricted: string[]; // Additional restricted dates
  };
  seasonalRules: {
    blackoutPeriods: Array<{
      start: string;
      end: string;
      reason: string;
    }>;
    preferredPeriods: Array<{
      start: string;
      end: string;
      reason: string;
    }>;
  };
}
