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
import {StatusToggle} from "./StatusTogle";
import SeasonalRulesModal from "./SeasonalRulesModal";

import { useUpdateUserSettingEnabled } from "@/app/lib/actions/settings/user/hooks";

const seasonalRulesExplanations = {
  blackoutPeriods: "Time periods when vacations cannot be booked.",
  preferredPeriods: "Suggested time periods for taking vacations.",
};

interface SeasonalRulesCardProps {
  data: GlobalSettingsType;
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
  data,
  selectedUserId,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: SeasonalRulesCardProps) => {
  const [localEnabled, setLocalEnabled] = useState(
    data?.seasonalRules?.enabled || false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();

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
                  enabled={localEnabled}
                  isPending={
                    selectedUserId === "global"
                      ? updateEnabled.isPending
                      : updateUserEnabled.isPending
                  }
                  onToggle={handleToggleEnabled}
                />
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
              onClick={() => onEdit()}
            >
              <Settings2 className="w-4 h-4 mr-1" />
              Configure
            </Button>
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
                    {data?.seasonalRules?.blackoutPeriods?.length || 0} periods
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
                    {data?.seasonalRules?.preferredPeriods?.length || 0} periods
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
            blackoutPeriods: data?.seasonalRules?.blackoutPeriods || [],
            preferredPeriods: data?.seasonalRules?.preferredPeriods || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default SeasonalRulesCard;
