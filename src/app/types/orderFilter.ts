export type BullMQStatus = "delayed" | "active" | "completed" | "failed" | "paused";
export type Tag = "EMAIL" | "NOTIFICATION" | "REMINDER" | "SMS" | "PUSH" | "WHATSAPP";
export type TagStatus = "QUEUED" | "FAILED" | "SENT" | "PENDING" | "CANCELLED";
export type PaymentMethod = "BUSINESS_CARD" | "ADVANCE_PAYMENT" | "E_PAYMENT" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD";


export interface Location {
    country: string;
    city: string | null;
};

export interface FilterState {
    searchTerm: string
    tag: Tag | null;
    tagStatus: TagStatus | null;
    location: Location | null;
    agent: string | null;
    paymentMethod: PaymentMethod | null;
    companyName: string;
    product: string | null;
    dateRange: {
        from: Date | null;
        to: Date | null;
    };
    priceRange: {
        min: string;
        max: string;
    };
}