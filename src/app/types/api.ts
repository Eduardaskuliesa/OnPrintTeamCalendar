export interface User {
  email: string;
  name: string;
  surname: string;
  userId: string;
  role: string;
  color: string;
  useGlobal: boolean;
  vacationDays: number;
  updateAmount: number;
  createdAt: string;
  birthday: string;
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
  userId: string;
  userName: string;
  gapDays?: number;
  startDate: string;
  userEmail: string;
  endDate: string;
  userColor: string;
  totalVacationDays: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface WorkRecord {
  userId: string;
  date: string;
  type: "overtime" | "absence" | "vacation";
  hours: number;
  yearMonth: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
}
