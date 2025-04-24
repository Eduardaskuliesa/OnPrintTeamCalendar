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

export interface Location {
  country: string;
  city: string | null;
}

export interface FilterState {
  searchTerm: string;
  email: string;
  tagIds: number[] | null;
  tagStatuses: TagStatus[] | null;
  location: Location | null;
  agent: number[] | null;
  paymentMethod: string[] | null;
  companyName: string;
  products: string[] | null;
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
