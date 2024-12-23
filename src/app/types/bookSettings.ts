export interface GlobalSettingsType {
  gapRules: {
    enabled: boolean;
    days: number;
    bypassGapRules: boolean | null;
    canIgnoreGapsof: string[] | null;
  };
  bookingRules: {
    enabled: boolean;
    maxDaysPerBooking: number;
    maxDaysPerYear: number;
    maxAdvanceBookingDays: number;
    minDaysNotice: number;
  };
  overlapRules: {
    enabled: boolean;
    maxSimultaneousBookings: number;
    bypassOverlapRules: boolean | null;
    canIgnoreOverlapRulesOf: string[] | null;
  };
  restrictedDays: {
    enabled: boolean;
    holidays: string[];
    weekends: {
      restriction: "all" | "none" | "saturday-only" | "sunday-only";
    };
    customRestricted: string[];
  };
  seasonalRules: {
    enabled: boolean;
    blackoutPeriods: Array<{
      start: string;
      end: string;
      reason: string;
      name: string;
    }>;
    preferredPeriods: Array<{
      start: string;
      end: string;
      reason: string;
      name: string;
    }>;
  };
  useGlobalSettings: {
    gapRules: boolean;
    bookingRules: boolean;
    overlapRules: boolean;
    restrictedDays: boolean;
    seasonalRules: boolean;
  };
}
