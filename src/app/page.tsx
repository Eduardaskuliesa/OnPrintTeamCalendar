import React from "react";
import Calendar from "./components/Calendar";
import { vacationsAction } from "./lib/actions/vacations";
import { usersActions } from "./lib/actions/users";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth";
import { getGlobalSettings } from "./lib/actions/settings/global/getGlobalSettings";
import { getUserSettings } from "./lib/actions/settings/user/getUserSettings";
import { User } from "./types/api";
import { GlobalSettingsType } from "./types/bookSettings";
import { sanitizeSettings } from "./lib/actions/settings/sanitizeSettings";

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

const Home = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const fetchTimestamp = new Date().toISOString();

  const user = await usersActions.getUser(session.user.userId);
  const isGlobalSettings = user.data.useGlobal;

  // Fetch both settings
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
      initialFetchTimestamp={fetchTimestamp}
      isGlobalSettings={isGlobalSettings}
    />
  );
};

export default Home;
