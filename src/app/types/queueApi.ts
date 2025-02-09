export interface QueuePayload {
  message: string;
}
export interface DynamoQueueItem {
  payload: QueuePayload;
  scheduledFor: number;
  updatedAt: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  jobId: string;
  attempts: number;
  tag: "EMAIL" | "NOTIFICATION" | "REMINDER"; // add other possible tags
  email: string;
}

export interface BullQueue {
  bullJobCount: number;
  bullJobIds: string[];
}

export interface DynamoQueue {
  dynamoJobCount: number;
  items: DynamoQueueItem[];
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
