
export interface Job {
  id: string;
  orderId: number;
  tagId: number;
  tagName: string;
  status: string;
  scheduledFor: number;
  attempts: number;
  error: string | null;
  processedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  orderDate: string;
  userSurname: string;
  companyName: string;
  phoneNumber: string;
  city: string;
  country: string;
  productNames: string[];
  productIds: string[];
  totalAmount: number;
  paymentMethodName: string;
  salesAgentId: number;
  customerId: string;
  email: string;
  jobs: Job[];
}

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

export type tagType = "Global" | "Subscriber" | "All"
export interface TagType {
  id: number;
  tagName: string;
  scheduledFor: number;
  jobsCount: number;
  tagType: tagType,
  createdAt: string;
  updateAt: string;
  isActive: boolean;
}

export interface SalesAgent {
  id: number;
  name: string;
  phoneNumber: string;
  fullText: string;
  orderCount: number;
}
