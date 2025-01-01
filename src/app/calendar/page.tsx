import Calendar from "../components/Calendar";
import { getServerSession } from "next-auth";
import { User } from "../types/api";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { getGlobalSettings } from "../lib/actions/settings/global/getGlobalSettings";
import { sanitizeSettings } from "../lib/actions/settings/sanitizeSettings";
import { getUserSettings } from "../lib/actions/settings/user/getUserSettings";
import { usersActions } from "../lib/actions/users";
import { vacationsAction } from "../lib/actions/vacations";
import { GlobalSettingsType } from "../types/bookSettings";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  extendedProps: {
    status: "PENDING" | "APPROVED" | "REJECTED" | "GAP";
    email: string;
    userId: string;
    totalVacationDays: number;
  };
}

const CalendarPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await usersActions.getUser(session.user.userId);
  const isGlobalSettings = user.data.useGlobal;

  const globalSettings = await getGlobalSettings();
  const userSettings = await getUserSettings(session.user.userId);

  const sanitizedSettings = sanitizeSettings(
    userSettings.data as GlobalSettingsType,
    globalSettings.data as GlobalSettingsType,
    user.data.useGlobal
  );

  const initialVacations =
    (await vacationsAction.getVacations()) as CalendarEvent[];

  return (
    <Calendar
      user={user.data as User}
      initialVacations={initialVacations}
      settings={sanitizedSettings}
      isGlobalSettings={isGlobalSettings}
    />
  );
};

export default CalendarPage;
