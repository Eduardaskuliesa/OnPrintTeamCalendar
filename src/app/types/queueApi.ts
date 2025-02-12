export interface QueuePayload {
  message: string;
}
export interface QueueItem {
  jobId: string;
  tagName: string;
  createdAt: string;
  scheduledFor: number;
  status: string;
  email: string;
  attempts: number;
  updatedAt: string;
}
export interface Tag {
  tagId: string;
  tagName: string;
  isActive: boolean;
  waitDuration: number;
  actionConfig: {
    template: string;
  };
  jobCount: number;
}

export interface BullQueue {
  bullJobCount: number;
  bullJobIds: string[];
}

export interface DynamoQueue {
  dynamoJobCount: number;
  items: QueueItem[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  nextPage: number | null;
  previousPage: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QueueResponse {
  success: boolean;
  data: {
    bull: BullQueue;
    dynamo: DynamoQueue;
  };
  pagination: PaginationInfo;
}

export interface LastEvaluatedKey {
  jobId: string;
  status: string;
}

export interface PaginationState {
  keys: Record<number, LastEvaluatedKey>;
  currentPage: number;
}

export type QueueStatus =
  | "delayed"
  | "active"
  | "completed"
  | "failed"
  | "paused";
