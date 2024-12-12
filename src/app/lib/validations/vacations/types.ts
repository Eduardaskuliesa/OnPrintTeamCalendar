import { GlobalSettings } from "@/app/types/bookSettings";

export type ValidationError = {
  type:
    | "OVERLAP"
    | "GAP_CONFLICT"
    | "MAX_DAYS_EXCEEDED"
    | "YEAR_LIMIT_EXCEEDED"
    | "ADVANCE_BOOKING_EXCEEDED"
    | "MINIMUM_NOTICE_NOT_MET"
    | "BLACKOUT_PERIOD"
    | "RESTRICTED_DAYS"
    | "MAX_SIMULTANEOUS_BOOKINGS";
  message: string;
  dates?: Array<{ start: string; end: string }>;
};

export type ValidationResult = {
  isValid: boolean;
  error?: ValidationError;
};

export interface VacationValidationParams {
  startDate: string;
  endDate: string;
  userEmail: string;
  globalSettings: GlobalSettings;
}
