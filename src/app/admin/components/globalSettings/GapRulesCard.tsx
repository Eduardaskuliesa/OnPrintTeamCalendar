/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
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
import {StatusToggle} from "./StatusTogle";
import { useNumericInput } from "@/app/hooks/useNumericInput";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import EditableControls from "./EditableControls";
import { toast } from "react-toastify";

import {
  useUpdateUserGapDays,
  useUpdateUserSettingEnabled,
} from "@/app/lib/actions/settings/user/hooks";

const gapRulesExplanations = {
  minimumGap:
    "Required waiting period between two vacation bookings to ensure work continuity.",
};

interface GapRulesCardProps {
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

const GapRulesCard = ({
  data,
  isEditing,
  onEdit,
  selectedUserId,
  onCancel,
  onUnsavedChanges,
}: GapRulesCardProps) => {
  const [localEnabled, setLocalEnabled] = useState(
    data?.gapRules?.enabled || false
  );

  const updateGapRules = useUpdateGapDays();
  const updateEnabled = useUpdateSettingEnabled();
  const updateUserGapDays = useUpdateUserGapDays();
  const updateUserEnabled = useUpdateUserSettingEnabled();

  const {
    value: localDays,
    setValue: setLocalDays,
    parseValue: parseLocalDays,
  } = useNumericInput(data?.gapRules?.days ?? 0);

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

  const handleSave = async () => {
    const currentValue = parseLocalDays();
    const initialValue = data?.gapRules?.days || 0;
    toast.dismiss();

    if (currentValue === initialValue) {
      handleNoChanges(ErrorMessages.GAP_RULES.NO_CHANGES);
      onCancel();
      return;
    }

    return new Promise<void>((resolve, reject) => {
      if (selectedUserId === "global") {
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
      } else {
        updateUserGapDays.mutate(
          { userId: selectedUserId, days: currentValue },
          {
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
          }
        );
      }
    });
  };
  useEffect(() => {
    const initialValue = data?.gapRules?.days ?? 0;
    const hasChanges = parseLocalDays() !== initialValue;

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, [localDays, data?.gapRules?.days]);

  const handleCancel = () => {
    toast.dismiss();
    const initialValue = data?.gapRules?.days ?? 0;
    setLocalDays(String(initialValue));
    onCancel();
  };

  useKeyboardShortcuts(isEditing, handleSave, handleCancel);

  return (
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
                enabled={localEnabled}
                isPending={updateEnabled.isPending}
                onToggle={handleToggleEnabled}
              />
            </div>
          </div>
          <EditableControls
            isEditing={isEditing}
            isPending={updateGapRules.isPending}
            onEdit={onEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
              <div className="text-sm font-semibold text-gray-900">
                Minimum Gap
              </div>
              <div className="font-semibold text-db mt-1 flex items-center">
                {isEditing ? (
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
                  parseLocalDays()
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
      </CardContent>
    </Card>
  );
};

export default GapRulesCard;
