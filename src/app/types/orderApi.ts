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
  userSurname: string;
  companyName: string;
  phoneNumber: string;
  city: string;
  country: string;
  productName: string;
  subTotal: number;
  paymentDetails: string;
  salesAgentId: string;
  customerId: string;
  productId: string;
  jobs: Job[];
}

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
}

export interface TagType {
  id: number;
  tagName: string;
  scheduledFor: number;
  jobCounts: number;
  createdAt: string;
  updateAt: string;
  isActive: boolean;
}
