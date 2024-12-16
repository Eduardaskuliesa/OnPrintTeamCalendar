export interface User {
  email: string;
  name: string;
  role: string;
  color: string;
  useGlobal: boolean;
  vacationDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  color: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface Vacation {
  id: string;
  userEmail: string;
  userName: string;
  userColor: string;
  startDate: string;
  endDate: string;
  status: string;
  gapDays?: number;
  requiresApproval?: boolean;
  createdAt: string;
  updatedAt: string;
}
