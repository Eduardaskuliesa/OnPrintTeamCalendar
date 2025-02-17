export interface Job {
  id: number;
  status: string;
  tagName: string;
  processedAt?: string;
  attempts: number;
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
