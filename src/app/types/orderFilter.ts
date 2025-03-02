export type BullMQStatus =
  | "delayed"
  | "active"
  | "completed"
  | "failed"
  | "paused";
export type TagStatus =
  | "QUEUED"
  | "FAILED"
  | "SENT"
  | "PENDING"
  | "INACTIVE"
  | "PAUSED";
export type PaymentMethod =
  | "BUSINESS_CARD"
  | "ADVANCE_PAYMENT"
  | "E_PAYMENT"
  | "CASH"
  | "BANK_TRANSFER"
  | "CREDIT_CARD";

export interface Location {
  country: string;
  city: string | null;
}

export interface FilterState {
  searchTerm: string;
  tagIds: number[] | null;
  tagStatuses: TagStatus[] | null;
  location: Location | null;
  agent: number | null;
  paymentMethod: PaymentMethod | null;
  companyName: string;
  product: string | null;
  dateRange: {
    from: string | null;
    to: string | null;
  };
  priceRange: {
    min: string;
    max: string;
  };
  isNot: boolean;
}
