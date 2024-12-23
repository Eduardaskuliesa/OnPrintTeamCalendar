import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Ban, Settings2 } from "lucide-react";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import {
  handleMutationResponse,
  ErrorMessages,
} from "@/app/utils/errorHandling";
import { StatusToggle } from "./StatusTogle";
import RestrictedDaysModal from "./RestrictedDaysModal";

import { useUpdateSettingEnabled } from "@/app/lib/actions/settings/global/hooks";
import {
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import { toast } from "react-toastify";
import SettingsSourceIndicator from "./SettingsSourceIndicator";

const restrictedDaysExplanations = {
  holidays:
    "Dates that are designated as holidays and don't count as vacation days.",
  weekends: "Weekend handling settings for vacations.",
  customDates: "Additional dates that are restricted for vacation bookings.",
};

interface RestrictedDaysCardProps {
  userData: GlobalSettingsType;
  globalData: GlobalSettingsType;
  selectedUserId: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const getWeekendText = (
  restriction: "all" | "none" | "saturday-only" | "sunday-only"
) => {
  switch (restriction) {
    case "all":
      return "All Weekends";
    case "saturday-only":
      return "Saturdays Only";
    case "sunday-only":
      return "Sundays Only";
    case "none":
      return "No Restrictions";
    default:
      return "Not Set";
  }
};

const RestrictedDaysCard = ({
  userData,
  globalData,
  selectedUserId,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: RestrictedDaysCardProps) => {
  const isGlobalSettings = userData?.useGlobalSettings?.restrictedDays;
  const currentData = isGlobalSettings ? globalData : userData;
  const [localEnabled, setLocalEnabled] = useState(
    currentData?.restrictedDays?.enabled || false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  const handleToggleEnabled = async () => {
    const newEnabledState = !localEnabled;
    setLocalEnabled(newEnabledState);

    if (selectedUserId === "global") {
      updateEnabled.mutate(
        { settingKey: "restrictedDays", enabled: newEnabledState },
        {
          onSuccess: () => {
            handleMutationResponse(true, ErrorMessages.UPDATE_STATUS);
          },
          onError: () => {
            setLocalEnabled(!newEnabledState);
            handleMutationResponse(false, ErrorMessages.UPDATE_STATUS);
          },
        }
      );
    } else {
      updateUserEnabled.mutate(
        {
          userId: selectedUserId,
          settingKey: "restrictedDays",
          enabled: newEnabledState,
        },
        {
          onSuccess: () => {
            handleMutationResponse(true, ErrorMessages.UPDATE_STATUS);
          },
          onError: () => {
            setLocalEnabled(!newEnabledState);
            handleMutationResponse(false, ErrorMessages.UPDATE_STATUS);
          },
        }
      );
    }
  };

  React.useEffect(() => {
    setLocalEnabled(currentData?.restrictedDays?.enabled || false);
  }, [currentData]);

  const handleSettingsSourceToggle = async () => {
    if (isEditing) {
      toast.warn(
        "Please save or cancel your changes before switching settings source"
      );
      return;
    }

    const newGlobalState = !userData?.useGlobalSettings?.restrictedDays;

    try {
      await updateGlobalSettingsPreference.mutateAsync({
        userId: selectedUserId,
        settingKey: "restrictedDays",
        useGlobal: newGlobalState,
      });

      toast.success(
        newGlobalState
          ? "Switched to global settings"
          : "Switched to user settings"
      );
    } catch (error) {
      toast.error("Failed to update settings source");
      console.error("Error updating settings source:", error);
    }
  };

  return (
    <>
      <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ban className="w-5 h-5 text-red-500" />
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Restricted Days
                </CardTitle>
                <StatusToggle
                  isGlobalSettings={isGlobalSettings}
                  enabled={localEnabled}
                  isPending={updateEnabled.isPending}
                  onToggle={handleToggleEnabled}
                />
                {selectedUserId !== "global" && (
                  <SettingsSourceIndicator
                    isPending={updateGlobalSettingsPreference.isPending}
                    onToggle={handleSettingsSourceToggle}
                    isGlobalSettings={isGlobalSettings}
                  />
                )}
              </div>
            </div>
            {!isGlobalSettings && (
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
                onClick={() => onEdit()}
              >
                <Settings2 className="w-4 h-4 mr-1" />
                Configure
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <HoverCard openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900">
                    Holidays
                  </div>
                  <div className="text-lg font-bold text-db mt-1">
                    {currentData?.restrictedDays?.holidays?.length || 0} days
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                side="bottom"
                className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Holiday Restrictions:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {restrictedDaysExplanations.holidays}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900">
                    Custom Restricted
                  </div>
                  <div className="text-lg font-bold text-db mt-1">
                    {currentData?.restrictedDays?.customRestricted?.length || 0}{" "}
                    days
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                align="start"
                side="bottom"
                className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-700">
                    Custom Restricted Days:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {restrictedDaysExplanations.customDates}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 mt-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                <div className="text-sm font-semibold text-gray-900">
                  Weekend Restrictions
                </div>
                <div className="font-semibold text-db mt-1">
                  {getWeekendText(
                    currentData?.restrictedDays?.weekends?.restriction || "none"
                  )}
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              side="bottom"
              className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  Weekend Policy:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {restrictedDaysExplanations.weekends}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>

      {isEditing && (
        <RestrictedDaysModal
          selectedUserId={selectedUserId}
          isOpen={isEditing}
          onClose={onCancel}
          initialData={{
            enabled: localEnabled,
            holidays: currentData?.restrictedDays?.holidays || [],
            weekends: currentData?.restrictedDays?.weekends || {
              restriction: "none",
            },
            customRestricted:
              currentData?.restrictedDays?.customRestricted || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default RestrictedDaysCard;
