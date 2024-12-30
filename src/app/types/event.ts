export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  extendedProps: {
    status: "PENDING" | "APPROVED" | "REJECTED" | "GAP";
    userId: string;
    email: string;
    totalVacationDays: number;
  };
}

export interface VacationData {
  id: string;
  userName: string;
  startDate: string;
  endDate: string;
  userColor: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: string;
  userEmail: string;
  totalVacationDays: number;
  gapDays?: number;
}
