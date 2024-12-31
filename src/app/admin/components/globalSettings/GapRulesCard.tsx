/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Clock, Settings2 } from "lucide-react";
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
import { toast } from "react-toastify";
import SettingsSourceIndicator from "./SettingsSourceIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";

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
  const [dayTypes, setDayTypes] = useState({
    daysForGap: currentData?.gapRules?.daysForGap?.dayType || "working",
    minimumDaysForGap:
      currentData?.gapRules?.minimumDaysForGap?.dayType || "working",
  });

  const {
    value: daysForGapValue,
    setValue: setDaysForGapValue,
    parseValue: parseDaysForGap,
  } = useNumericInput(currentData?.gapRules?.daysForGap?.days ?? 0);

  const {
    value: minimumDaysForGapValue,
    setValue: setMinimumDaysForGapValue,
    parseValue: parseMinimumDaysForGap,
  } = useNumericInput(currentData?.gapRules?.minimumDaysForGap?.days ?? 0);

  const updateGapRules = useUpdateGapDays();
  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  const toggleDayType = (key: string) => {
    if (!isEditing) return;

    setDayTypes((prev) => ({
      ...prev,
      [key]:
        prev[key as keyof typeof prev] === "working" ? "calendar" : "working",
    }));
  };

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
    const newValues = {
      daysForGap: {
        days: parseDaysForGap(),
        dayType: dayTypes.daysForGap,
      },
      minimumDaysForGap: {
        days: parseMinimumDaysForGap(),
        dayType: dayTypes.minimumDaysForGap,
      },
    };

    const hasChanges =
      parseDaysForGap() !== (currentData?.gapRules?.daysForGap?.days ?? 0) ||
      parseMinimumDaysForGap() !==
        (currentData?.gapRules?.minimumDaysForGap?.days ?? 0) ||
      dayTypes.daysForGap !== currentData?.gapRules?.daysForGap?.dayType ||
      dayTypes.minimumDaysForGap !==
        currentData?.gapRules?.minimumDaysForGap?.dayType;

    toast.dismiss();
    if (!hasChanges) {
      handleNoChanges(ErrorMessages.GAP_RULES.NO_CHANGES);
      onCancel();
      return;
    }

    return new Promise<void>((resolve, reject) => {
      updateGapRules.mutate(newValues, {
        onSuccess: () => {
          handleMutationResponse(true, ErrorMessages.GAP_RULES, {
            onSuccess: () => {
              onCancel();
              resolve();
            },
          });
        },
        onError: (error) => {
          handleMutationResponse(false, ErrorMessages.GAP_RULES, {
            onError: () => {
              setDaysForGapValue(
                String(currentData?.gapRules?.daysForGap?.days ?? 0)
              );
              setMinimumDaysForGapValue(
                String(currentData?.gapRules?.minimumDaysForGap?.days ?? 0)
              );
              setDayTypes({
                daysForGap:
                  currentData?.gapRules?.daysForGap?.dayType || "working",
                minimumDaysForGap:
                  currentData?.gapRules?.minimumDaysForGap?.dayType ||
                  "working",
              });
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
    setDaysForGapValue(String(currentData?.gapRules?.daysForGap?.days ?? 0));
    setMinimumDaysForGapValue(
      String(currentData?.gapRules?.minimumDaysForGap?.days ?? 0)
    );
    setDayTypes({
      daysForGap: currentData?.gapRules?.daysForGap?.dayType || "working",
      minimumDaysForGap:
        currentData?.gapRules?.minimumDaysForGap?.dayType || "working",
    });
    onCancel();
  };

  React.useEffect(() => {
    if (selectedUserId === "global") {
      const hasChanges =
        parseDaysForGap() !== (currentData?.gapRules?.daysForGap?.days ?? 0) ||
        parseMinimumDaysForGap() !==
          (currentData?.gapRules?.minimumDaysForGap?.days ?? 0) ||
        dayTypes.daysForGap !== currentData?.gapRules?.daysForGap?.dayType ||
        dayTypes.minimumDaysForGap !==
          currentData?.gapRules?.minimumDaysForGap?.dayType;

      onUnsavedChanges(
        hasChanges,
        hasChanges ? handleGlobalSave : undefined,
        hasChanges ? handleGlobalCancel : undefined
      );
    }
  }, [
    daysForGapValue,
    minimumDaysForGapValue,
    dayTypes,
    currentData?.gapRules,
    selectedUserId,
  ]);

  React.useEffect(() => {
    setLocalEnabled(currentData?.gapRules?.enabled || false);
    setDayTypes({
      daysForGap: currentData?.gapRules?.daysForGap?.dayType || "working",
      minimumDaysForGap:
        currentData?.gapRules?.minimumDaysForGap?.dayType || "working",
    });
    setDaysForGapValue(String(currentData?.gapRules?.daysForGap?.days ?? 0));
    setMinimumDaysForGapValue(
      String(currentData?.gapRules?.minimumDaysForGap?.days ?? 0)
    );
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

 useKeyboardShortcuts(isEditing, handleGlobalCancel, handleGlobalSave);

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
            {/* Gap Days Card */}
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                    <span>Gap Days</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`pr-2 h-auto ${
                              !isEditing &&
                              "cursor-default disabled:opacity-100"
                            }`}
                            onClick={() => toggleDayType("daysForGap")}
                            disabled={!isEditing}
                          >
                            {dayTypes.daysForGap === "working" ? (
                              <Briefcase
                                size={16}
                                className="text-orange-700"
                              />
                            ) : (
                              <Calendar size={16} className="text-blue-700" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle between w.d. / c.d.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {isEditing ? (
                      <div className="flex items-center">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={daysForGapValue}
                          onChange={(e) => setDaysForGapValue(e.target.value)}
                          className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                        />
                        <span className="ml-1">
                          {dayTypes.daysForGap === "working"
                            ? "working days"
                            : "calendar days"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>
                          {currentData?.gapRules?.daysForGap?.days ?? 0}
                        </span>
                        <span>
                          {currentData?.gapRules?.daysForGap?.dayType ===
                          "working"
                            ? "working days"
                            : "calendar days"}
                        </span>
                      </div>
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
                    Gap Days:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Required waiting period between vacation bookings.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Minimum Days for Gap Card */}
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                    <span>Min For Gap</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`pr-2 h-auto ${
                              !isEditing &&
                              "cursor-default disabled:opacity-100"
                            }`}
                            onClick={() => toggleDayType("minimumDaysForGap")}
                            disabled={!isEditing}
                          >
                            {dayTypes.minimumDaysForGap === "working" ? (
                              <Briefcase
                                size={16}
                                className="text-orange-700"
                              />
                            ) : (
                              <Calendar size={16} className="text-blue-700" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Toggle between w.d. / c.d.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {isEditing ? (
                      <div className="flex items-center">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={minimumDaysForGapValue}
                          onChange={(e) =>
                            setMinimumDaysForGapValue(e.target.value)
                          }
                          className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                        />
                        <span className="ml-1">
                          {dayTypes.minimumDaysForGap === "working"
                            ? "working days"
                            : "calendar days"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span>
                          {currentData?.gapRules?.minimumDaysForGap?.days ?? 0}
                        </span>
                        <span>
                          {currentData?.gapRules?.minimumDaysForGap?.dayType ===
                          "working"
                            ? "working days"
                            : "calendar days"}
                        </span>
                      </div>
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
                    Minimum Days for Gap:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Minimum vacation duration that requires gap days between
                    bookings.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Bypass Rules Card (if needed) */}
            {!isGlobalSettings && selectedUserId !== "global" && (
              <HoverCard openDelay={300}>
                <HoverCardTrigger asChild>
                  <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                    <div className="text-sm font-semibold text-gray-900">
                      Ignoring User
                    </div>
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
                      Gap Rules Exceptions:
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Users who can bypass or be excluded from gap rules
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </CardContent>
      </Card>
      {selectedUserId !== "global" && isEditing && (
        <GapRulesModal
          isOpen={isEditing}
          onClose={onCancel}
          selectedUserId={selectedUserId}
          users={users}
          initialData={{
            daysForGap: {
              dayType: currentData?.gapRules?.daysForGap?.dayType || "working",
              days: currentData?.gapRules?.daysForGap?.days ?? 0,
            },
            minimumDaysForGap: {
              dayType:
                currentData?.gapRules?.minimumDaysForGap?.dayType || "working",
              days: currentData?.gapRules?.minimumDaysForGap?.days ?? 0,
            },
            enabled: localEnabled,
            bypassGapRules: currentData?.gapRules?.bypassGapRules || false,
            canIgnoreGapsof: currentData?.gapRules?.canIgnoreGapsof || [],
          }}
          onUnsavedChanges={onUnsavedChanges}
        />
      )}
    </>
  );
};

export default GapRulesCard;
