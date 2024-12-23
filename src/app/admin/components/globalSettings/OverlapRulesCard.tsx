/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { toast } from "react-toastify";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  useUpdateOverlapRules,
  useUpdateSettingEnabled,
} from "@/app/lib/actions/settings/global/hooks";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { useNumericInput } from "@/app/hooks/useNumericInput";
import EditableControls from "./EditableControls";
import { StatusToggle } from "./StatusTogle";
import {
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserOverlapRules,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import SettingsSourceIndicator from "./SettingsSourceIndicator";

const overlapRulesExplanations = {
  maxSimultaneous:
    "Maximum number of employees that can be on vacation at the same time.",
};

interface OverlapRulesCardProps {
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

const OverlapRulesCard = ({
  selectedUserId,
  userData,
  globalData,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: OverlapRulesCardProps) => {
  const isGlobalSettings = userData?.useGlobalSettings?.overlapRules;
  const currentData = isGlobalSettings ? globalData : userData;

  const [localEnabled, setLocalEnabled] = useState(
    currentData?.overlapRules?.enabled || false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateOverlapRules = useUpdateOverlapRules();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateUserOveralpRules = useUpdateUserOverlapRules();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  const {
    value: localMaxSimultaneous,
    setValue: setLocalMaxSimultaneous,
    parseValue: parseLocalMaxSimultaneous,
  } = useNumericInput(currentData?.overlapRules?.maxSimultaneousBookings ?? 0);

  useEffect(() => {
    const initialValue =
      currentData?.overlapRules?.maxSimultaneousBookings ?? 0;
    const hasChanges = parseLocalMaxSimultaneous() !== initialValue;

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, [
    localMaxSimultaneous,
    currentData?.overlapRules?.maxSimultaneousBookings,
  ]);

  React.useEffect(() => {
    setLocalEnabled(currentData?.overlapRules?.enabled || false);
    setLocalMaxSimultaneous(
      String(currentData?.overlapRules?.maxSimultaneousBookings ?? 0)
    );
  }, [currentData]);

  const handleToggleEnabled = async () => {
    const newEnabledState = !localEnabled;
    setLocalEnabled(newEnabledState);
    if (selectedUserId === "global") {
      updateEnabled.mutate(
        { settingKey: "overlapRules", enabled: newEnabledState },
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
          settingKey: "overlapRules",
          enabled: newEnabledState,
          userId: selectedUserId,
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

  const handleSave = async () => {
    const currentValue = parseLocalMaxSimultaneous();
    const initialValue =
      currentData?.overlapRules?.maxSimultaneousBookings || 0;
    toast.dismiss();
    if (currentValue === initialValue) {
      handleNoChanges(ErrorMessages.OVERLAP_RULES.NO_CHANGES);
      onCancel();
      return;
    }

    return new Promise<void>((resolve, reject) => {
      if (selectedUserId === "global") {
        updateOverlapRules.mutate(currentValue, {
          onSuccess: () => {
            handleMutationResponse(true, ErrorMessages.OVERLAP_RULES, {
              onSuccess: () => {
                setLocalMaxSimultaneous(String(currentValue));
                onCancel();
                resolve();
              },
            });
          },
          onError: (error) => {
            handleMutationResponse(false, ErrorMessages.OVERLAP_RULES, {
              onError: () => {
                setLocalMaxSimultaneous(String(initialValue));
                console.error("Error updating overlap rules:", error);
                reject(error);
              },
            });
          },
        });
      } else {
        updateUserOveralpRules.mutate(
          {
            userId: selectedUserId,
            people: currentValue,
          },
          {
            onSuccess: () => {
              handleMutationResponse(true, ErrorMessages.OVERLAP_RULES, {
                onSuccess: () => {
                  setLocalMaxSimultaneous(String(currentValue));
                  onCancel();
                  resolve();
                },
              });
            },
            onError: (error) => {
              handleMutationResponse(false, ErrorMessages.OVERLAP_RULES, {
                onError: () => {
                  setLocalMaxSimultaneous(String(initialValue));
                  console.error("Error updating overlap rules:", error);
                  reject(error);
                },
              });
            },
          }
        );
      }
    });
  };

  const handleCancel = () => {
    toast.dismiss();
    const initialValue =
      currentData?.overlapRules?.maxSimultaneousBookings ?? 0;
    setLocalMaxSimultaneous(String(initialValue));
    onCancel();
  };

  const handleSettingsSourceToggle = async () => {
    if (isEditing) {
      toast.warn(
        "Please save or cancel your changes before switching settings source"
      );
      return;
    }

    const newGlobalState = !userData?.useGlobalSettings?.overlapRules;

    try {
      // Only update the useGlobalSettings flag
      await updateGlobalSettingsPreference.mutateAsync({
        userId: selectedUserId,
        settingKey: "overlapRules",
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

  useKeyboardShortcuts(isEditing, handleSave, handleCancel);

  return (
    <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Overlap Rules
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
            <EditableControls
              isEditing={isEditing}
              isPending={updateOverlapRules.isPending}
              onEdit={onEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
              <div className="text-sm font-semibold text-gray-900">
                Maximum Simultaneous
              </div>
              <div className="font-semibold text-db mt-1 flex items-center">
                {isEditing ? (
                  <div className="flex items-center">
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={localMaxSimultaneous}
                      onChange={(e) => setLocalMaxSimultaneous(e.target.value)}
                      className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                    />
                  </div>
                ) : (
                  parseLocalMaxSimultaneous()
                )}
                <span className="ml-1">people</span>
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
                Overlap Rule:
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {overlapRulesExplanations.maxSimultaneous}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardContent>
    </Card>
  );
};

export default OverlapRulesCard;
