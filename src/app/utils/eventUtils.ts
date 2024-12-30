import { VacationData, Event } from "../types/event";

export const createVacationEvents = (vacationData: VacationData): Event[] => {
  const events: Event[] = [];

  // Create main vacation event
  const endDate = new Date(vacationData.endDate);
  endDate.setDate(endDate.getDate());

  const vacationEvent: Event = {
    id: vacationData.id,
    title: vacationData.userName,
    start: vacationData.startDate,
    end: endDate.toISOString(),
    backgroundColor: vacationData.userColor,
    extendedProps: {
      status: vacationData.status,
      userId: vacationData.userId,
      email: vacationData.userEmail,
      totalVacationDays: vacationData.totalVacationDays,
    },
  };
  events.push(vacationEvent);

  // Create gap event if needed
  if (vacationData.gapDays && vacationData.gapDays > 0) {
    const gapStartDate = new Date(vacationData.endDate);
    gapStartDate.setDate(gapStartDate.getDate() + 1);

    const gapEndDate = new Date(vacationData.endDate);
    gapEndDate.setDate(gapEndDate.getDate() + vacationData.gapDays);

    const gapEvent: Event = {
      id: `gap-${vacationData.id}`,
      title: `Tarpas - ${vacationData.userName}`,
      start: gapStartDate.toISOString(),
      end: gapEndDate.toISOString(),
      backgroundColor: "#808080",
      extendedProps: {
        status: "GAP",
        userId: vacationData.userId,
        email: vacationData.userEmail,
        totalVacationDays: 0,
      },
    };
    events.push(gapEvent);
  }

  return events;
};
