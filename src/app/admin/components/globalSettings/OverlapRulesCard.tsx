/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings2, Users } from "lucide-react";
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
import { useNumericInput } from "@/app/hooks/useNumericInput";
import EditableControls from "./EditableControls";
import { StatusToggle } from "./StatusTogle";
import {
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import SettingsSourceIndicator from "./SettingsSourceIndicator";
import { Button } from "@/components/ui/button";
import OverlapRulesModal from "./OverlapRulesModal";
import { User } from "@/app/types/api";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

const overlapRulesExplanations = {
  maxSimultaneous:
    "Maximum number of employees that can be on vacation at the same time.",
};

interface OverlapRulesCardProps {
  userData: GlobalSettingsType;
  globalData: GlobalSettingsType;
  selectedUserId: string;
  isEditing: boolean;
  users: User[];
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
  users,
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

  useKeyboardShortcuts(isEditing, onCancel, handleSave);

  return (
    <>
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
            <div className="flex gap-2">
              {!isGlobalSettings &&
                (selectedUserId === "global" ? (
                  <EditableControls
                    isEditing={isEditing}
                    isPending={updateOverlapRules.isPending}
                    onEdit={onEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
                    onClick={() => onEdit()}
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
                    Maximum Simultaneous
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {selectedUserId === "global" && isEditing ? (
                      <div className="flex items-center">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={localMaxSimultaneous}
                          onChange={(e) =>
                            setLocalMaxSimultaneous(e.target.value)
                          }
                          className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                        />
                      </div>
                    ) : (
                      currentData.overlapRules.maxSimultaneousBookings
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

            {!isGlobalSettings && selectedUserId !== "global" && (
              <HoverCard openDelay={300} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                    <div className="text-sm font-semibold text-gray-900">
                      Ignoring User
                    </div>
                    <div>{currentData.overlapRules.bypassOverlapRules}</div>
                    <div className="font-semibold text-db mt-1">
                      {currentData.overlapRules.bypassOverlapRules
                        ? "All"
                        : `${
                            currentData?.overlapRules?.canIgnoreOverlapRulesOf
                              ?.length || 0
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
                      Users That Can Be Ignored:
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Select users whose bookings can be ignored when checking
                      overlap rules.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedUserId !== "global" && isEditing && (
        <OverlapRulesModal
          isOpen={isEditing}
          onClose={onCancel}
          selectedUserId={selectedUserId}
          users={users}
          initialData={{
            enabled: localEnabled,
            maxSimultaneousBookings:
              currentData.overlapRules.maxSimultaneousBookings,
            bypassOverlapRules:
              currentData.overlapRules.bypassOverlapRules || false,
            canIgnoreOverlapRulesOf:
              currentData.overlapRules.canIgnoreOverlapRulesOf || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default OverlapRulesCard;
