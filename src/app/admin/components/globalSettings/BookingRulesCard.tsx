/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, Shield, ShieldOff } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  useUpdateBookingRules,
  useUpdateSettingEnabled,
} from "../../../lib/actions/settings/global/hooks";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { StatusToggle } from "./StatusTogle";
import { useNumericInput } from "@/app/hooks/useNumericInput";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import EditableControls from "./EditableControls";
import { toast } from "react-toastify";
import {
  useUpdateUserBookingRules,
  useUpdateUserGlobalSettingsPreference,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";
import SettingsSourceIndicator from "./SettingsSourceIndicator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const bookingRulesConfig = {
  options: [
    {
      key: "maxDaysPerBooking",
      label: "Max Days/Booking",
      explanation:
        "Maximum number of days allowed for a single vacation booking.",
      suffix: "days",
    },
    {
      key: "maxDaysPerYear",
      label: "Max Days/Year",
      explanation: "Total number of vacation days allowed per year.",
      suffix: "days",
    },
    {
      key: "maxAdvanceBookingDays",
      label: "Advance Booking",
      explanation: "How far in advance employees can schedule their vacations.",
      suffix: "days",
    },
    {
      key: "minDaysNotice",
      label: "Notice Required",
      explanation: "Required notice period before vacation can start.",
      suffix: "days",
    },
    {
      key: "maximumOverdraftDays",
      label: "Maximum Overdraft",
      explanation:
        "Maximum number of days a user can go into negative balance.",
      suffix: "days",
    },
  ],
};

interface BookingRulesCardProps {
  globalData: GlobalSettingsType;
  userData: GlobalSettingsType;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  selectedUserId: string;
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const BookingRulesCard = ({
  userData,
  globalData,
  selectedUserId,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: BookingRulesCardProps) => {
  const isGlobalSettings = userData?.useGlobalSettings?.bookingRules;
  const currentData = isGlobalSettings ? globalData : userData;

  const [localEnabled, setLocalEnabled] = useState(
    currentData?.bookingRules?.enabled || false
  );

  const [dayTypes, setDayTypes] = useState({
    maxDaysPerBooking:
      currentData?.bookingRules?.maxDaysPerBooking?.dayType || "working",
    maxDaysPerYear:
      currentData?.bookingRules?.maxDaysPerYear?.dayType || "working",
    maxAdvanceBookingDays:
      currentData?.bookingRules?.maxAdvanceBookingDays?.dayType || "working",
    minDaysNotice:
      currentData?.bookingRules?.minDaysNotice?.dayType || "working",
  });

  const [useStrict, setUseStrict] = useState(
    currentData?.bookingRules?.overdraftRules?.useStrict ?? false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateUserBookingRules = useUpdateUserBookingRules();
  const updateBookingRules = useUpdateBookingRules();
  const updateGlobalSettingsPreference =
    useUpdateUserGlobalSettingsPreference();

  const {
    value: maxDaysPerBookingValue,
    setValue: setMaxDaysPerBookingValue,
    parseValue: parseMaxDaysPerBooking,
  } = useNumericInput(currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0);

  const {
    value: maxDaysPerYearValue,
    setValue: setMaxDaysPerYearValue,
    parseValue: parseMaxDaysPerYear,
  } = useNumericInput(currentData?.bookingRules?.maxDaysPerYear?.days ?? 0);

  const {
    value: maxAdvanceBookingDaysValue,
    setValue: setMaxAdvanceBookingDaysValue,
    parseValue: parseMaxAdvanceBookingDays,
  } = useNumericInput(
    currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0
  );

  const {
    value: minDaysNoticeValue,
    setValue: setMinDaysNoticeValue,
    parseValue: parseMinDaysNotice,
  } = useNumericInput(currentData?.bookingRules?.minDaysNotice?.days ?? 0);

  const {
    value: maximumOverdraftDaysValue,
    setValue: setMaximumOverdraftDaysValue,
    parseValue: parseMaximumOverdraftDays,
  } = useNumericInput(
    currentData?.bookingRules?.overdraftRules?.maximumOverdraftDays ?? 0
  );

  const toggleDayType = (key: string) => {
    if (!isEditing) return;

    setDayTypes((prev) => ({
      ...prev,
      [key]:
        prev[key as keyof typeof prev] === "working" ? "calendar" : "working",
    }));
  };

  const toggleOverdraftStrict = () => {
    if (isEditing) {
      setUseStrict(!useStrict);
    }
  };

  useEffect(() => {
    const hasChanges =
      parseMaxDaysPerBooking() !==
        (currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0) ||
      parseMaxDaysPerYear() !==
        (currentData?.bookingRules?.maxDaysPerYear?.days ?? 0) ||
      parseMaxAdvanceBookingDays() !==
        (currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0) ||
      parseMinDaysNotice() !==
        (currentData?.bookingRules?.minDaysNotice?.days ?? 0) ||
      parseMaximumOverdraftDays() !==
        (currentData?.bookingRules?.overdraftRules?.maximumOverdraftDays ??
          0) ||
      dayTypes.maxDaysPerBooking !==
        currentData?.bookingRules?.maxDaysPerBooking?.dayType ||
      dayTypes.maxDaysPerYear !==
        currentData?.bookingRules?.maxDaysPerYear?.dayType ||
      dayTypes.maxAdvanceBookingDays !==
        currentData?.bookingRules?.maxAdvanceBookingDays?.dayType ||
      dayTypes.minDaysNotice !==
        currentData?.bookingRules?.minDaysNotice?.dayType ||
      useStrict !== currentData?.bookingRules?.overdraftRules?.useStrict;

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, [
    maxDaysPerBookingValue,
    maxDaysPerYearValue,
    maxAdvanceBookingDaysValue,
    minDaysNoticeValue,
    maximumOverdraftDaysValue,
    dayTypes,
    useStrict,
    currentData?.bookingRules,
  ]);

  useEffect(() => {
    setLocalEnabled(currentData?.bookingRules?.enabled || false);
    setMaxDaysPerBookingValue(
      String(currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0)
    );
    setMaxDaysPerYearValue(
      String(currentData?.bookingRules?.maxDaysPerYear?.days ?? 0)
    );
    setMaxAdvanceBookingDaysValue(
      String(currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0)
    );
    setMinDaysNoticeValue(
      String(currentData?.bookingRules?.minDaysNotice?.days ?? 0)
    );
    setMaximumOverdraftDaysValue(
      String(
        currentData?.bookingRules?.overdraftRules?.maximumOverdraftDays ?? 0
      )
    );
    setDayTypes({
      maxDaysPerBooking:
        currentData?.bookingRules?.maxDaysPerBooking?.dayType || "working",
      maxDaysPerYear:
        currentData?.bookingRules?.maxDaysPerYear?.dayType || "working",
      maxAdvanceBookingDays:
        currentData?.bookingRules?.maxAdvanceBookingDays?.dayType || "working",
      minDaysNotice:
        currentData?.bookingRules?.minDaysNotice?.dayType || "working",
    });
    setUseStrict(currentData?.bookingRules?.overdraftRules?.useStrict ?? false);
  }, [currentData, isGlobalSettings]);

  const handleToggleEnabled = async () => {
    const newEnabledState = !localEnabled;
    setLocalEnabled(newEnabledState);

    if (selectedUserId === "global") {
      updateEnabled.mutate(
        { settingKey: "bookingRules", enabled: newEnabledState },
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
          settingKey: "bookingRules",
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

  const handleSave = async () => {
    const newValues = {
      maxDaysPerBooking: {
        days: parseMaxDaysPerBooking(),
        dayType: dayTypes.maxDaysPerBooking,
      },
      maxDaysPerYear: {
        days: parseMaxDaysPerYear(),
        dayType: dayTypes.maxDaysPerYear,
      },
      maxAdvanceBookingDays: {
        days: parseMaxAdvanceBookingDays(),
        dayType: dayTypes.maxAdvanceBookingDays,
      },
      minDaysNotice: {
        days: parseMinDaysNotice(),
        dayType: dayTypes.minDaysNotice,
      },
      overdraftRules: {
        useStrict,
        maximumOverdraftDays: parseMaximumOverdraftDays(),
      },
    };

    const hasChanges =
      parseMaxDaysPerBooking() !==
        (currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0) ||
      parseMaxDaysPerYear() !==
        (currentData?.bookingRules?.maxDaysPerYear?.days ?? 0) ||
      parseMaxAdvanceBookingDays() !==
        (currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0) ||
      parseMinDaysNotice() !==
        (currentData?.bookingRules?.minDaysNotice?.days ?? 0) ||
      parseMaximumOverdraftDays() !==
        (currentData?.bookingRules?.overdraftRules?.maximumOverdraftDays ??
          0) ||
      dayTypes.maxDaysPerBooking !==
        currentData?.bookingRules?.maxDaysPerBooking?.dayType ||
      dayTypes.maxDaysPerYear !==
        currentData?.bookingRules?.maxDaysPerYear?.dayType ||
      dayTypes.maxAdvanceBookingDays !==
        currentData?.bookingRules?.maxAdvanceBookingDays?.dayType ||
      dayTypes.minDaysNotice !==
        currentData?.bookingRules?.minDaysNotice?.dayType ||
      useStrict !== currentData?.bookingRules?.overdraftRules?.useStrict;

    toast.dismiss();
    if (!hasChanges) {
      handleNoChanges(ErrorMessages.BOOKING_RULES.NO_CHANGES);
      onCancel();
      return;
    }

    return new Promise<void>((resolve, reject) => {
      if (selectedUserId === "global") {
        updateBookingRules.mutate(newValues, {
          onSuccess: () => {
            handleMutationResponse(true, ErrorMessages.BOOKING_RULES, {
              onSuccess: () => {
                onCancel();
                resolve();
              },
            });
          },
          onError: (error) => {
            handleMutationResponse(false, ErrorMessages.BOOKING_RULES, {
              onError: () => {
                setMaxDaysPerBookingValue(
                  String(
                    currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0
                  )
                );
                setMaxDaysPerYearValue(
                  String(currentData?.bookingRules?.maxDaysPerYear?.days ?? 0)
                );
                setMaxAdvanceBookingDaysValue(
                  String(
                    currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0
                  )
                );
                setMinDaysNoticeValue(
                  String(currentData?.bookingRules?.minDaysNotice?.days ?? 0)
                );
                setMaximumOverdraftDaysValue(
                  String(
                    currentData?.bookingRules?.overdraftRules
                      ?.maximumOverdraftDays ?? 0
                  )
                );
                setDayTypes({
                  maxDaysPerBooking:
                    currentData?.bookingRules?.maxDaysPerBooking?.dayType ||
                    "working",
                  maxDaysPerYear:
                    currentData?.bookingRules?.maxDaysPerYear?.dayType ||
                    "working",
                  maxAdvanceBookingDays:
                    currentData?.bookingRules?.maxAdvanceBookingDays?.dayType ||
                    "working",
                  minDaysNotice:
                    currentData?.bookingRules?.minDaysNotice?.dayType ||
                    "working",
                });
                setUseStrict(
                  currentData?.bookingRules?.overdraftRules?.useStrict ?? false
                );
                console.error("Error updating booking rules:", error);
                reject(error);
              },
            });
          },
        });
      } else {
        updateUserBookingRules.mutate(
          {
            userId: selectedUserId,
            bookingRules: newValues,
          },
          {
            onSuccess: () => {
              handleMutationResponse(true, ErrorMessages.BOOKING_RULES, {
                onSuccess: () => {
                  onCancel();
                  resolve();
                },
              });
            },
            onError: (error) => {
              handleMutationResponse(false, ErrorMessages.BOOKING_RULES, {
                onError: () => {
                  setMaxDaysPerBookingValue(
                    String(
                      currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0
                    )
                  );
                  setMaxDaysPerYearValue(
                    String(currentData?.bookingRules?.maxDaysPerYear?.days ?? 0)
                  );
                  setMaxAdvanceBookingDaysValue(
                    String(
                      currentData?.bookingRules?.maxAdvanceBookingDays?.days ??
                        0
                    )
                  );
                  setMinDaysNoticeValue(
                    String(currentData?.bookingRules?.minDaysNotice?.days ?? 0)
                  );
                  setMaximumOverdraftDaysValue(
                    String(
                      currentData?.bookingRules?.overdraftRules
                        ?.maximumOverdraftDays ?? 0
                    )
                  );
                  setDayTypes({
                    maxDaysPerBooking:
                      currentData?.bookingRules?.maxDaysPerBooking?.dayType ||
                      "working",
                    maxDaysPerYear:
                      currentData?.bookingRules?.maxDaysPerYear?.dayType ||
                      "working",
                    maxAdvanceBookingDays:
                      currentData?.bookingRules?.maxAdvanceBookingDays
                        ?.dayType || "working",
                    minDaysNotice:
                      currentData?.bookingRules?.minDaysNotice?.dayType ||
                      "working",
                  });
                  setUseStrict(
                    currentData?.bookingRules?.overdraftRules?.useStrict ??
                      false
                  );
                  console.error("Error updating booking rules:", error);
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
    setMaxDaysPerBookingValue(
      String(currentData?.bookingRules?.maxDaysPerBooking?.days ?? 0)
    );
    setMaxDaysPerYearValue(
      String(currentData?.bookingRules?.maxDaysPerYear?.days ?? 0)
    );
    setMaxAdvanceBookingDaysValue(
      String(currentData?.bookingRules?.maxAdvanceBookingDays?.days ?? 0)
    );
    setMinDaysNoticeValue(
      String(currentData?.bookingRules?.minDaysNotice?.days ?? 0)
    );
    setMaximumOverdraftDaysValue(
      String(
        currentData?.bookingRules?.overdraftRules?.maximumOverdraftDays ?? 0
      )
    );
    setDayTypes({
      maxDaysPerBooking:
        currentData?.bookingRules?.maxDaysPerBooking?.dayType || "working",
      maxDaysPerYear:
        currentData?.bookingRules?.maxDaysPerYear?.dayType || "working",
      maxAdvanceBookingDays:
        currentData?.bookingRules?.maxAdvanceBookingDays?.dayType || "working",
      minDaysNotice:
        currentData?.bookingRules?.minDaysNotice?.dayType || "working",
    });
    setUseStrict(currentData?.bookingRules?.overdraftRules?.useStrict ?? false);
    onCancel();
  };
  const handleSettingsSourceToggle = async () => {
    if (isEditing) {
      toast.warn(
        "Please save or cancel your changes before switching settings source"
      );
      return;
    }

    const newGlobalState = !userData?.useGlobalSettings?.bookingRules;

    try {
      await updateGlobalSettingsPreference.mutateAsync({
        userId: selectedUserId,
        settingKey: "bookingRules",
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

  const getInputProps = (key: string) => {
    switch (key) {
      case "maxDaysPerBooking":
        return {
          value: maxDaysPerBookingValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxDaysPerBookingValue(e.target.value),
          parseValue: parseMaxDaysPerBooking,
          dayType: dayTypes.maxDaysPerBooking,
          onToggleDayType: () => toggleDayType(key),
        };
      case "maxDaysPerYear":
        return {
          value: maxDaysPerYearValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxDaysPerYearValue(e.target.value),
          parseValue: parseMaxDaysPerYear,
          dayType: dayTypes.maxDaysPerYear,
          onToggleDayType: () => toggleDayType(key),
        };
      case "maxAdvanceBookingDays":
        return {
          value: maxAdvanceBookingDaysValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxAdvanceBookingDaysValue(e.target.value),
          parseValue: parseMaxAdvanceBookingDays,
          dayType: dayTypes.maxAdvanceBookingDays,
          onToggleDayType: () => toggleDayType(key),
        };
      case "minDaysNotice":
        return {
          value: minDaysNoticeValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMinDaysNoticeValue(e.target.value),
          parseValue: parseMinDaysNotice,
          dayType: dayTypes.minDaysNotice,
          onToggleDayType: () => toggleDayType(key),
        };
      case "maximumOverdraftDays":
        return {
          value: maximumOverdraftDaysValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaximumOverdraftDaysValue(e.target.value),
          parseValue: parseMaximumOverdraftDays,
          useStrict: useStrict,
          onToggleDayType: () => toggleDayType(key),
          onToggleStrict: () => toggleOverdraftStrict(),
        };
      default:
        return {
          value: "",
          onChange: () => {},
          parseValue: () => 0,
          dayType: "working",
          onToggleDayType: () => {},
        };
    }
  };

  return (
    <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Booking Rules
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
              isPending={updateBookingRules.isPending}
              onEdit={onEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2 grid grid-cols-3 gap-2">
        {bookingRulesConfig.options.map((option) => {
          const inputProps = getInputProps(option.key);
          return (
            <HoverCard key={option.key} openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-4">
                    <span>{option.label}</span>
                    {option.key === "maximumOverdraftDays" && isEditing ? (
                      <TooltipProvider>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 p-0 h-auto cursor-pointer"
                                onClick={inputProps.onToggleStrict}
                              >
                                {inputProps.useStrict ? (
                                  <Shield size={16} className="text-red-700" />
                                ) : (
                                  <ShieldOff
                                    size={16}
                                    className="text-green-700"
                                  />
                                )}
                              </Button>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-blue-100 text-db text-sm p-1">
                            <p>Toggle strict/non-strict overdraft</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      option.key !== "maximumOverdraftDays" &&
                      isEditing && (
                        <TooltipProvider>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 p-0 h-auto cursor-pointer"
                                  onClick={inputProps.onToggleDayType}
                                >
                                  {inputProps.dayType === "working" ? (
                                    <Briefcase
                                      size={16}
                                      className="text-orange-700"
                                    />
                                  ) : (
                                    <Calendar
                                      size={16}
                                      className="text-blue-700"
                                    />
                                  )}
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white border border-blue-100 text-db text-sm p-1">
                              <p>Toggle between w.d. / c.d.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    )}
                    {option.key !== "maximumOverdraftDays" && !isEditing && (
                      <div>
                        {inputProps.dayType === "working" ? (
                          <Briefcase size={16} className="text-orange-700 " />
                        ) : (
                          <Calendar size={16} className="text-blue-700" />
                        )}
                      </div>
                    )}
                    {option.key === "maximumOverdraftDays" && !isEditing && (
                      <div>
                        {inputProps.useStrict ? (
                          <Shield size={16} className="text-red-700" />
                        ) : (
                          <ShieldOff size={16} className="text-green-700" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {isEditing ? (
                      <div className="flex items-center">
                        {option.key === "maximumOverdraftDays" ? (
                          inputProps.useStrict ? (
                            <span className="text-red-700">Strict</span>
                          ) : (
                            <>
                              <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={inputProps.value}
                                onChange={inputProps.onChange}
                                className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                              />
                              <span className="ml-1">days</span>
                            </>
                          )
                        ) : (
                          <>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={inputProps.value}
                              onChange={inputProps.onChange}
                              className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                            />
                            <span className="ml-1">
                              {inputProps.dayType === "working"
                                ? "working days"
                                : "calendar days"}
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {option.key === "maximumOverdraftDays" ? (
                          inputProps.useStrict ? (
                            <span className="text-red-700">Strict</span>
                          ) : (
                            <>
                              <span>{inputProps.parseValue()}</span>
                              <span className="">days</span>
                            </>
                          )
                        ) : (
                          <>
                            <span>{inputProps.parseValue()}</span>
                            <span className="">
                              {inputProps.dayType === "working"
                                ? "working days"
                                : "calendar days"}
                            </span>
                          </>
                        )}
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
                  {option.key !== "maximumOverdraftDays" ? (
                    <p className="text-sm font-semibold text-gray-700">
                      {inputProps.dayType === "working"
                        ? "Working Days"
                        : "Calendar Days"}
                      :
                    </p>
                  ) : (
                    <p className="text-sm font-semibold text-gray-700">
                      {inputProps.useStrict
                        ? "Strict Overdraft"
                        : "Flexible Overdraft"}
                      :
                    </p>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.explanation}
                  </p>
                  {!isEditing && (
                    <p className="text-sm text-gray-600 mt-2">
                      {option.key !== "maximumOverdraftDays"
                        ? inputProps.dayType === "working"
                          ? "Days are counted based on working day settings (excluding weekends and holidays)"
                          : "All calendar days are counted, including weekends and holidays"
                        : inputProps.useStrict
                        ? "No negative balance allowed beyond current allocation"
                        : "Limited negative balance allowed"}
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BookingRulesCard;
