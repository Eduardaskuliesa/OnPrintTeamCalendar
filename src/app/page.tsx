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

const Home = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const fetchTimestamp = new Date().toISOString();

  const user = await usersActions.getUser(session.user.email);
  const isGlobalSettings = user.data.useGlobal;

  const settings = isGlobalSettings
    ? await getGlobalSettings()
    : await getUserSettings(session.user.email);

  const initialVacations = await vacationsAction.getVacations();

  return (
    <Calendar
      user={user.data as User}
      initialVacations={initialVacations}
      settings={settings.data as GlobalSettingsType}
      initialFetchTimestamp={fetchTimestamp}
      isGlobalSettings={isGlobalSettings}
    />
  );
};

export default Home;
