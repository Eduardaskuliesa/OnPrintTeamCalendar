/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
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
  } = useNumericInput(currentData?.bookingRules?.maxDaysPerBooking ?? 0);

  const {
    value: maxDaysPerYearValue,
    setValue: setMaxDaysPerYearValue,
    parseValue: parseMaxDaysPerYear,
  } = useNumericInput(currentData?.bookingRules?.maxDaysPerYear ?? 0);

  const {
    value: maxAdvanceBookingDaysValue,
    setValue: setMaxAdvanceBookingDaysValue,
    parseValue: parseMaxAdvanceBookingDays,
  } = useNumericInput(currentData?.bookingRules?.maxAdvanceBookingDays ?? 0);

  const {
    value: minDaysNoticeValue,
    setValue: setMinDaysNoticeValue,
    parseValue: parseMinDaysNotice,
  } = useNumericInput(currentData?.bookingRules?.minDaysNotice ?? 0);

  useEffect(() => {
    const hasChanges =
      parseMaxDaysPerBooking() !==
        (currentData?.bookingRules?.maxDaysPerBooking ?? 0) ||
      parseMaxDaysPerYear() !==
        (currentData?.bookingRules?.maxDaysPerYear ?? 0) ||
      parseMaxAdvanceBookingDays() !==
        (currentData?.bookingRules?.maxAdvanceBookingDays ?? 0) ||
      parseMinDaysNotice() !== (currentData?.bookingRules?.minDaysNotice ?? 0);

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
    currentData?.bookingRules,
  ]);

  useEffect(() => {
    setLocalEnabled(currentData?.bookingRules?.enabled || false);
    setMaxDaysPerBookingValue(
      String(currentData?.bookingRules?.maxDaysPerBooking ?? 0)
    );
    setMaxDaysPerYearValue(
      String(currentData?.bookingRules?.maxDaysPerYear ?? 0)
    );
    setMaxAdvanceBookingDaysValue(
      String(currentData?.bookingRules?.maxAdvanceBookingDays ?? 0)
    );
    setMinDaysNoticeValue(
      String(currentData?.bookingRules?.minDaysNotice ?? 0)
    );
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
      enabled: localEnabled,
      maxDaysPerBooking: parseMaxDaysPerBooking(),
      maxDaysPerYear: parseMaxDaysPerYear(),
      maxAdvanceBookingDays: parseMaxAdvanceBookingDays(),
      minDaysNotice: parseMinDaysNotice(),
    };

    const hasChanges =
      newValues.maxDaysPerBooking !==
        (currentData?.bookingRules?.maxDaysPerBooking ?? 0) ||
      newValues.maxDaysPerYear !==
        (currentData?.bookingRules?.maxDaysPerYear ?? 0) ||
      newValues.maxAdvanceBookingDays !==
        (currentData?.bookingRules?.maxAdvanceBookingDays ?? 0) ||
      newValues.minDaysNotice !==
        (currentData?.bookingRules?.minDaysNotice ?? 0);

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
                  String(currentData?.bookingRules?.maxDaysPerBooking ?? 0)
                );
                setMaxDaysPerYearValue(
                  String(currentData?.bookingRules?.maxDaysPerYear ?? 0)
                );
                setMaxAdvanceBookingDaysValue(
                  String(currentData?.bookingRules?.maxAdvanceBookingDays ?? 0)
                );
                setMinDaysNoticeValue(
                  String(currentData?.bookingRules?.minDaysNotice ?? 0)
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
                    String(currentData?.bookingRules?.maxDaysPerBooking ?? 0)
                  );
                  setMaxDaysPerYearValue(
                    String(currentData?.bookingRules?.maxDaysPerYear ?? 0)
                  );
                  setMaxAdvanceBookingDaysValue(
                    String(
                      currentData?.bookingRules?.maxAdvanceBookingDays ?? 0
                    )
                  );
                  setMinDaysNoticeValue(
                    String(currentData?.bookingRules?.minDaysNotice ?? 0)
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
      String(currentData?.bookingRules?.maxDaysPerBooking ?? 0)
    );
    setMaxDaysPerYearValue(
      String(currentData?.bookingRules?.maxDaysPerYear ?? 0)
    );
    setMaxAdvanceBookingDaysValue(
      String(currentData?.bookingRules?.maxAdvanceBookingDays ?? 0)
    );
    setMinDaysNoticeValue(
      String(currentData?.bookingRules?.minDaysNotice ?? 0)
    );
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
      // Only update the useGlobalSettings flag
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
        };
      case "maxDaysPerYear":
        return {
          value: maxDaysPerYearValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxDaysPerYearValue(e.target.value),
          parseValue: parseMaxDaysPerYear,
        };
      case "maxAdvanceBookingDays":
        return {
          value: maxAdvanceBookingDaysValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMaxAdvanceBookingDaysValue(e.target.value),
          parseValue: parseMaxAdvanceBookingDays,
        };
      case "minDaysNotice":
        return {
          value: minDaysNoticeValue,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setMinDaysNoticeValue(e.target.value),
          parseValue: parseMinDaysNotice,
        };
      default:
        return {
          value: "",
          onChange: () => {},
          parseValue: () => 0,
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
      <CardContent className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
        {bookingRulesConfig.options.map((option) => {
          const inputProps = getInputProps(option.key);
          return (
            <HoverCard key={option.key} openDelay={200}>
              <HoverCardTrigger asChild>
                <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                  <div className="text-sm font-semibold text-gray-900">
                    {option.label}
                  </div>
                  <div className="font-semibold text-db mt-1 flex items-center">
                    {isEditing ? (
                      <div className="flex items-center">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={inputProps.value}
                          onChange={inputProps.onChange}
                          className="w-12 h-auto text-center p-1 mx-1 bg-white border border-gray-300"
                        />
                      </div>
                    ) : (
                      inputProps.parseValue()
                    )}
                    <span className="ml-1">{option.suffix}</span>
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
                    {option.label}:
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {option.explanation}
                  </p>
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
