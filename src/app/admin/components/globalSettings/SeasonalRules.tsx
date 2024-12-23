import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sunset, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { useUpdateSettingEnabled } from "../../../lib/actions/settings/global/hooks";
import {
  handleMutationResponse,
  ErrorMessages,
} from "@/app/utils/errorHandling";
import { StatusToggle } from "./StatusTogle";
import SeasonalRulesModal from "./SeasonalRulesModal";

import {
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import { toast } from "react-toastify";
import SettingsSourceIndicator from "./SettingsSourceIndicator";

const seasonalRulesExplanations = {
  blackoutPeriods: "Time periods when vacations cannot be booked.",
  preferredPeriods: "Suggested time periods for taking vacations.",
};

interface SeasonalRulesCardProps {
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

const SeasonalRulesCard = ({
  userData,
  globalData,
  selectedUserId,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: SeasonalRulesCardProps) => {
  const isGlobalSettings = userData?.useGlobalSettings?.seasonalRules;
  const currentData = isGlobalSettings ? globalData : userData;
  const [localEnabled, setLocalEnabled] = useState(
    currentData?.seasonalRules?.enabled || false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  React.useEffect(() => {
    setLocalEnabled(currentData?.seasonalRules?.enabled || false);
  }, [currentData]);

  const handleToggleEnabled = async () => {
    const newEnabledState = !localEnabled;
    setLocalEnabled(newEnabledState);

    if (selectedUserId === "global") {
      updateEnabled.mutate(
        { settingKey: "seasonalRules", enabled: newEnabledState },
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
          settingKey: "seasonalRules",
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

  const handleSettingsSourceToggle = async () => {
    if (isEditing) {
      toast.warn(
        "Please save or cancel your changes before switching settings source"
      );
      return;
    }

    const newGlobalState = !userData?.useGlobalSettings?.seasonalRules;

    try {
      await updateGlobalSettingsPreference.mutateAsync({
        userId: selectedUserId,
        settingKey: "seasonalRules",
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
              <Sunset className="w-5 h-5 text-yellow-500" />
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Seasonal Rules
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
                    Blackout Periods
                  </div>
                  <div className="text-lg font-bold text-db mt-1">
                    {currentData?.seasonalRules?.blackoutPeriods?.length || 0}{" "}
                    periods
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
                    Blackout Periods:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {seasonalRulesExplanations.blackoutPeriods}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900">
                    Preferred Periods
                  </div>
                  <div className="font-semibold text-db mt-1">
                    {currentData?.seasonalRules?.preferredPeriods?.length || 0}{" "}
                    periods
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
                    Preferred Periods:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {seasonalRulesExplanations.preferredPeriods}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <SeasonalRulesModal
          selectedUserId={selectedUserId}
          isOpen={isEditing}
          onClose={onCancel}
          initialData={{
            enabled: localEnabled,
            blackoutPeriods: currentData?.seasonalRules?.blackoutPeriods || [],
            preferredPeriods:
              currentData?.seasonalRules?.preferredPeriods || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default SeasonalRulesCard;
