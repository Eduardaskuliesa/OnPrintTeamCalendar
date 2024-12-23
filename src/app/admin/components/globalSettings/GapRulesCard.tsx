/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Settings2 } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  useUpdateGapDays,
  useUpdateSettingEnabled,
} from "../../../lib/actions/settings/global/hooks";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { StatusToggle } from "./StatusTogle";
import { Button } from "@/components/ui/button";
import {
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import { User } from "@/app/types/api";
import GapRulesModal from "./GapRulesModal";
import EditableControls from "./EditableControls";
import { useNumericInput } from "@/app/hooks/useNumericInput";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { toast } from "react-toastify";
import SettingsSourceIndicator from "./SettingsSourceIndicator";

const gapRulesExplanations = {
  minimumGap:
    "Required waiting period between two vacation bookings to ensure work continuity.",
};

interface GapRulesCardProps {
  userData: GlobalSettingsType;
  globalData: GlobalSettingsType;
  selectedUserId: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  users: User[];
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const GapRulesCard = ({
  userData,
  globalData,
  users,
  isEditing,
  onEdit,
  selectedUserId,
  onCancel,
  onUnsavedChanges,
}: GapRulesCardProps) => {
  const isGlobalSettings = userData?.useGlobalSettings?.gapRules;
  const currentData = isGlobalSettings ? globalData : userData;

  const [localEnabled, setLocalEnabled] = useState(
    currentData?.gapRules?.enabled || false
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateGapRules = useUpdateGapDays();
  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  // Only used for global settings
  const {
    value: localDays,
    setValue: setLocalDays,
    parseValue: parseLocalDays,
  } = useNumericInput(currentData?.gapRules?.days ?? 0);

  const handleToggleEnabled = async () => {
    const newEnabledState = !localEnabled;
    setLocalEnabled(newEnabledState);

    if (selectedUserId === "global") {
      updateEnabled.mutate(
        { settingKey: "gapRules", enabled: newEnabledState },
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
          settingKey: "gapRules",
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

  const handleGlobalSave = async () => {
    const currentValue = parseLocalDays();
    const initialValue = currentData?.gapRules?.days || 0;
    toast.dismiss();

    if (currentValue === initialValue) {
      handleNoChanges(ErrorMessages.GAP_RULES.NO_CHANGES);
      onCancel();
      return;
    }

    return new Promise<void>((resolve, reject) => {
      updateGapRules.mutate(currentValue, {
        onSuccess: () => {
          handleMutationResponse(true, ErrorMessages.GAP_RULES, {
            onSuccess: () => {
              setLocalDays(String(currentValue));
              onCancel();
              resolve();
            },
          });
        },
        onError: (error) => {
          handleMutationResponse(false, ErrorMessages.GAP_RULES, {
            onError: () => {
              setLocalDays(String(initialValue));
              console.error("Error updating gap rules:", error);
              reject(error);
            },
          });
        },
      });
    });
  };

  const handleGlobalCancel = () => {
    toast.dismiss();
    const initialValue = currentData?.gapRules?.days ?? 0;
    setLocalDays(String(initialValue));
    onCancel();
  };

  // Only track changes for global settings
  React.useEffect(() => {
    if (selectedUserId === "global") {
      const initialValue = currentData?.gapRules?.days ?? 0;
      const hasChanges = parseLocalDays() !== initialValue;

      onUnsavedChanges(
        hasChanges,
        hasChanges ? handleGlobalSave : undefined,
        hasChanges ? handleGlobalCancel : undefined
      );
    }
  }, [localDays, currentData?.gapRules?.days, selectedUserId]);

  React.useEffect(() => {
    setLocalEnabled(currentData?.gapRules?.enabled || false);
  }, [currentData]);

  const handleSettingsSourceToggle = async () => {
    if (isEditing) {
      toast.warn(
        "Please save or cancel your changes before switching settings source"
      );
      return;
    }

    const newGlobalState = !userData?.useGlobalSettings?.gapRules;

    try {
      // Only update the useGlobalSettings flag
      await updateGlobalSettingsPreference.mutateAsync({
        userId: selectedUserId,
        settingKey: "gapRules",
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

  useKeyboardShortcuts(isEditing, handleGlobalSave, handleGlobalCancel);

  return (
    <>
      <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Gap Rules
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
            <div className="flex gap-2">
              {!isGlobalSettings &&
                (selectedUserId === "global" ? (
                  <EditableControls
                    isEditing={isEditing}
                    isPending={updateGapRules.isPending}
                    onEdit={onEdit}
                    onSave={handleGlobalSave}
                    onCancel={handleGlobalCancel}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Settings2 className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900">
                    Minimum Gap
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {selectedUserId === "global" && isEditing ? (
                      <div className="flex items-center">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={localDays}
                          onChange={(e) => setLocalDays(e.target.value)}
                          className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                        />
                      </div>
                    ) : (
                      currentData.gapRules.days
                    )}
                    <span className="ml-1">days</span>
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
                    Minimum Gap Rule:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {gapRulesExplanations.minimumGap}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            {selectedUserId !== "global" && (
              <HoverCard openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                    <div className="text-sm font-semibold text-gray-900">
                      Ignoring User
                    </div>
                    <div>{currentData.gapRules.bypassGapRules}</div>
                    <div className="font-semibold text-db mt-1">
                      {currentData.gapRules.bypassGapRules
                        ? "All"
                        : `${
                            currentData?.gapRules?.canIgnoreGapsof?.length || 0
                          } persons`}
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
                    <p className="text-sm text-gray-600 leading-relaxed"></p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedUserId !== "global" && isModalOpen && (
        <GapRulesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedUserId={selectedUserId}
          users={users}
          initialData={{
            enabled: localEnabled,
            days: currentData.gapRules.days,
            bypassGapRules: currentData.gapRules.bypassGapRules || false,
            canIgnoreGapsof: currentData.gapRules.canIgnoreGapsof || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default GapRulesCard;
