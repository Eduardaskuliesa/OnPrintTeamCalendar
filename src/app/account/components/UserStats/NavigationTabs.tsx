import { useState } from "react";
import { getGlobalSettings } from "@/app/lib/actions/settings/global/getGlobalSettings";
import { sanitizeSettings } from "@/app/lib/actions/settings/sanitizeSettings";
import { getUserSettings } from "@/app/lib/actions/settings/user/getUserSettings";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { useQueryClient } from "@tanstack/react-query";
import { Home, ScrollText, Loader2 } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userId: string;
  useGlobal: boolean;
}

const NavigationTabs = ({
  activeTab,
  setActiveTab,
  useGlobal,
  userId,
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
          getUserSettings(userId),
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
      <button
        onClick={() => setActiveTab("dashboard")}
        className={`p-2 rounded-lg transition-colors ${
          activeTab === "dashboard"
            ? "bg-green-100"
            : "bg-[#fefaf6] hover:bg-green-100"
        }`}
      >
        <Home size={24} className="text-gray-800" />
      </button>
      <button
        onMouseEnter={handleHoverSettings}
        onClick={() => setActiveTab("settings")}
        disabled={isSettingsLoading}
        className={`p-2 rounded-lg transition-colors relative ${
          activeTab === "settings"
            ? "bg-blue-100"
            : "bg-[#fefaf6] hover:bg-blue-100"
        } ${isSettingsLoading ? "opacity-50" : ""}`}
      >
        {isSettingsLoading ? (
          <Loader2 size={24} className="text-gray-800 animate-spin " />
        ) : (
          <ScrollText size={24} className="text-gray-800" />
        )}
      </button>
      {/* <button
        onClick={() => setActiveTab("actions")}
        className={`p-2 rounded-lg transition-colors ${
          activeTab === "actions"
            ? "bg-pink-100"
            : "bg-[#fefaf6] hover:bg-pink-100"
        }`}
      >
        <CalendarRange size={24} className="text-gray-800" />
      </button> */}
    </div>
  );
};

export default NavigationTabs;
