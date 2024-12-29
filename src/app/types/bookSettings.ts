export interface GlobalSettingsType {
  gapRules: {
    enabled: boolean;
    daysForGap: {
      days: number;
      dayType: "working" | "calendar";
    };
    minimumDaysForGap: {
      days: number;
      dayType: "working" | "calendar";
    };
    bypassGapRules: boolean | null;
    canIgnoreGapsof: string[] | null;
  };
  bookingRules: {
    enabled: boolean;
    overdraftRules: {
      useStrict: boolean;
      maximumOverdraftDays: number;
    };
    maxDaysPerBooking: {
      days: number;
      dayType: "working" | "calendar";
    };
    maxDaysPerYear: {
      days: number;
      dayType: "working" | "calendar";
    };
    maxAdvanceBookingDays: {
      days: number;
      dayType: "working" | "calendar";
    };
    minDaysNotice: {
      days: number;
      dayType: "working" | "calendar";
    };
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
