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
import {StatusToggle} from "./StatusTogle";
import { useNumericInput } from "@/app/hooks/useNumericInput";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import EditableControls from "./EditableControls";
import { toast } from "react-toastify";
import {
  useUpdateUserBookingRules,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";

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
  data: GlobalSettingsType;
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
  data,
  selectedUserId,
  isEditing,
  onEdit,
  onCancel,
  onUnsavedChanges,
}: BookingRulesCardProps) => {
  const [localEnabled, setLocalEnabled] = useState(
    data?.bookingRules?.enabled || false
  );

  const updateEnabled = useUpdateSettingEnabled();
  const updateUserEnabled = useUpdateUserSettingEnabled();
  const updateUserBookingRules = useUpdateUserBookingRules();
  const updateBookingRules = useUpdateBookingRules();

  const {
    value: maxDaysPerBookingValue,
    setValue: setMaxDaysPerBookingValue,
    parseValue: parseMaxDaysPerBooking,
  } = useNumericInput(data?.bookingRules?.maxDaysPerBooking ?? 0);

  const {
    value: maxDaysPerYearValue,
    setValue: setMaxDaysPerYearValue,
    parseValue: parseMaxDaysPerYear,
  } = useNumericInput(data?.bookingRules?.maxDaysPerYear ?? 0);

  const {
    value: maxAdvanceBookingDaysValue,
    setValue: setMaxAdvanceBookingDaysValue,
    parseValue: parseMaxAdvanceBookingDays,
  } = useNumericInput(data?.bookingRules?.maxAdvanceBookingDays ?? 0);

  const {
    value: minDaysNoticeValue,
    setValue: setMinDaysNoticeValue,
    parseValue: parseMinDaysNotice,
  } = useNumericInput(data?.bookingRules?.minDaysNotice ?? 0);

  useEffect(() => {
    const hasChanges =
      parseMaxDaysPerBooking() !==
        (data?.bookingRules?.maxDaysPerBooking ?? 0) ||
      parseMaxDaysPerYear() !== (data?.bookingRules?.maxDaysPerYear ?? 0) ||
      parseMaxAdvanceBookingDays() !==
        (data?.bookingRules?.maxAdvanceBookingDays ?? 0) ||
      parseMinDaysNotice() !== (data?.bookingRules?.minDaysNotice ?? 0);

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
    data?.bookingRules,
  ]);

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
        (data?.bookingRules?.maxDaysPerBooking ?? 0) ||
      newValues.maxDaysPerYear !== (data?.bookingRules?.maxDaysPerYear ?? 0) ||
      newValues.maxAdvanceBookingDays !==
        (data?.bookingRules?.maxAdvanceBookingDays ?? 0) ||
      newValues.minDaysNotice !== (data?.bookingRules?.minDaysNotice ?? 0);

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
                  String(data?.bookingRules?.maxDaysPerBooking ?? 0)
                );
                setMaxDaysPerYearValue(
                  String(data?.bookingRules?.maxDaysPerYear ?? 0)
                );
                setMaxAdvanceBookingDaysValue(
                  String(data?.bookingRules?.maxAdvanceBookingDays ?? 0)
                );
                setMinDaysNoticeValue(
                  String(data?.bookingRules?.minDaysNotice ?? 0)
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
                    String(data?.bookingRules?.maxDaysPerBooking ?? 0)
                  );
                  setMaxDaysPerYearValue(
                    String(data?.bookingRules?.maxDaysPerYear ?? 0)
                  );
                  setMaxAdvanceBookingDaysValue(
                    String(data?.bookingRules?.maxAdvanceBookingDays ?? 0)
                  );
                  setMinDaysNoticeValue(
                    String(data?.bookingRules?.minDaysNotice ?? 0)
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
      String(data?.bookingRules?.maxDaysPerBooking ?? 0)
    );
    setMaxDaysPerYearValue(String(data?.bookingRules?.maxDaysPerYear ?? 0));
    setMaxAdvanceBookingDaysValue(
      String(data?.bookingRules?.maxAdvanceBookingDays ?? 0)
    );
    setMinDaysNoticeValue(String(data?.bookingRules?.minDaysNotice ?? 0));
    onCancel();
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
                enabled={localEnabled}
                isPending={updateEnabled.isPending}
                onToggle={handleToggleEnabled}
              />
            </div>
          </div>
          <EditableControls
            isEditing={isEditing}
            isPending={updateBookingRules.isPending}
            onEdit={onEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
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
