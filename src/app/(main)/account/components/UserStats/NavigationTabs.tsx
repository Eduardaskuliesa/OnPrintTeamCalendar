import { useState } from "react";
import { getGlobalSettings } from "@/app/lib/actions/settings/global/getGlobalSettings";
import { sanitizeSettings } from "@/app/lib/actions/settings/sanitizeSettings";
import { getUserSettings } from "@/app/lib/actions/settings/user/getUserSettings";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { useQueryClient } from "@tanstack/react-query";
import { Home, ScrollText, CalendarHeart, Bell } from "lucide-react";
import { User } from "@/app/types/api";
import WorkRecordButton from "../WorkRecord/WorkRecordButton";
import NavButton from "./NavigationTabButton";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userData: User;
  useGlobal: boolean;
}

const NavigationTabs = ({
  activeTab,
  setActiveTab,
  useGlobal,
  userData,
}: NavigationProps) => {
  const queryClient = useQueryClient();
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);

  const handleHoverSettings = () => {
    queryClient.prefetchQuery({
      queryKey: ["sanitizedSettings"],
      queryFn: async () => {
        console.log("Fetching new data");
        setIsSettingsLoading(true);
        const [globalSettings, userSettings] = await Promise.all([
          getGlobalSettings(),
          getUserSettings(userData.userId),
        ]);

        const sanitizedData = sanitizeSettings(
          userSettings.data as GlobalSettingsType,
          globalSettings.data as GlobalSettingsType,
          useGlobal
        );

        setIsSettingsLoading(false);
        return sanitizedData;
      },
      staleTime: 1000 * 60 * 60,
    });
  };

  return (
    <div className="h-auto w-14 bg-[#EADBC8] border-2 border-blue-50 rounded-xl flex flex-col gap-3 py-4 items-center justify-start">
      <NavButton
        icon={Home}
        isActive={activeTab === "dashboard"}
        onClick={() => setActiveTab("dashboard")}
        actionColor="bg-yellow-100"
      />
      <NavButton
        isActive={activeTab === "customDays"}
        onClick={() => setActiveTab("customDays")}
        actionColor="bg-emerald-100"
        icon={CalendarHeart}
      />
      <NavButton
        actionColor="bg-red-100"
        onClick={() => setActiveTab("settings")}
        disabled={isSettingsLoading}
        isLoading={isSettingsLoading}
        isActive={activeTab === "settings"}
        onMouseEnter={handleHoverSettings}
        icon={ScrollText}
      />

      <div className="h-1 w-full bg-db"></div>
      <WorkRecordButton userId={userData.userId}></WorkRecordButton>
      <div className="p-2 bg-[#fefaf6] hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer">
        <Bell size={24} className="text-gray-800" />
      </div>
    </div>
  );
};

export default NavigationTabs;
