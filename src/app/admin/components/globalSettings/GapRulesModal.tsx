/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Calendar, Loader } from "lucide-react";
import { useUpdateUserGapDays } from "@/app/lib/actions/settings/user/hooks";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { User } from "@/app/types/api";
import { useNumericInput } from "@/app/hooks/useNumericInput";

interface GapRulesModalProps {
  selectedUserId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    daysForGap: {
      days: number;
      dayType: "working" | "calendar";
    };
    minimumDaysForGap: {
      days: number;
      dayType: "working" | "calendar";
    };
    enabled: boolean;
    bypassGapRules: boolean;
    canIgnoreGapsof: string[];
  };
  users: User[];
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const GapRulesModal = ({
  isOpen,
  onClose,
  selectedUserId,
  initialData,
  users,
  onUnsavedChanges,
}: GapRulesModalProps) => {
  const [gapRules, setGapRules] = useState({
    enabled: initialData.enabled,
    daysForGap: initialData.daysForGap,
    minimumDaysForGap: initialData.minimumDaysForGap,
    bypassGapRules: initialData.bypassGapRules,
    canIgnoreGapsof: initialData.canIgnoreGapsof,
  });

  const [dayTypes, setDayTypes] = useState({
    daysForGap: initialData.daysForGap.dayType,
    minimumDaysForGap: initialData.minimumDaysForGap.dayType,
  });

  // Input hooks
  const {
    value: daysForGapValue,
    setValue: setDaysForGapValue,
    parseValue: parseDaysForGap,
  } = useNumericInput(initialData.daysForGap.days);

  const {
    value: minimumDaysForGapValue,
    setValue: setMinimumDaysForGapValue,
    parseValue: parseMinimumDaysForGap,
  } = useNumericInput(initialData.minimumDaysForGap.days);

  const toggleDayType = (key: string) => {
    setDayTypes((prev) => ({
      ...prev,
      [key]:
        prev[key as keyof typeof prev] === "working" ? "calendar" : "working",
    }));
  };

  const updateGapUserRules = useUpdateUserGapDays();

  const handleSave = useCallback(async () => {
    const newValues = {
      daysForGap: {
        days: parseDaysForGap(),
        dayType: dayTypes.daysForGap,
      },
      minimumDaysForGap: {
        days: parseMinimumDaysForGap(),
        dayType: dayTypes.minimumDaysForGap,
      },
      enabled: gapRules.enabled,
      bypassGapRules: gapRules.bypassGapRules,
      canIgnoreGapsof: gapRules.canIgnoreGapsof,
    };

    const hasChanges =
      parseDaysForGap() !== initialData.daysForGap.days ||
      parseMinimumDaysForGap() !== initialData.minimumDaysForGap.days ||
      dayTypes.daysForGap !== initialData.daysForGap.dayType ||
      dayTypes.minimumDaysForGap !== initialData.minimumDaysForGap.dayType ||
      gapRules.bypassGapRules !== initialData.bypassGapRules ||
      JSON.stringify(gapRules.canIgnoreGapsof) !==
        JSON.stringify(initialData.canIgnoreGapsof);

    if (!hasChanges) {
      handleNoChanges(ErrorMessages.GAP_RULES.NO_CHANGES);
      onClose();
      return;
    }

    try {
      await updateGapUserRules.mutateAsync({
        userId: selectedUserId,
        gapRules: newValues,
      });

      handleMutationResponse(true, ErrorMessages.GAP_RULES);
      onClose();
    } catch (error) {
      handleMutationResponse(false, ErrorMessages.GAP_RULES);
      console.error("Failed to update gap rules:", error);
    }
  }, [
    gapRules,
    dayTypes,
    initialData,
    onClose,
    selectedUserId,
    parseDaysForGap,
    parseMinimumDaysForGap,
  ]);

  const handleCancel = useCallback(() => {
    setDaysForGapValue(String(initialData.daysForGap.days));
    setMinimumDaysForGapValue(String(initialData.minimumDaysForGap.days));
    setDayTypes({
      daysForGap: initialData.daysForGap.dayType,
      minimumDaysForGap: initialData.minimumDaysForGap.dayType,
    });
    setGapRules({
      enabled: initialData.enabled,
      daysForGap: initialData.daysForGap,
      minimumDaysForGap: initialData.minimumDaysForGap,
      bypassGapRules: initialData.bypassGapRules,
      canIgnoreGapsof: initialData.canIgnoreGapsof,
    });
    onClose();
  }, [initialData, onClose, setDaysForGapValue, setMinimumDaysForGapValue]);

  useEffect(() => {
    const hasChanges =
      parseDaysForGap() !== initialData.daysForGap.days ||
      parseMinimumDaysForGap() !== initialData.minimumDaysForGap.days ||
      dayTypes.daysForGap !== initialData.daysForGap.dayType ||
      dayTypes.minimumDaysForGap !== initialData.minimumDaysForGap.dayType ||
      gapRules.bypassGapRules !== initialData.bypassGapRules ||
      JSON.stringify(gapRules.canIgnoreGapsof) !==
        JSON.stringify(initialData.canIgnoreGapsof);

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, []);

  const handleUserSelect = (userId: string) => {
    const updatedIgnoreList = gapRules?.canIgnoreGapsof?.includes(userId)
      ? gapRules.canIgnoreGapsof.filter((id) => id !== userId)
      : [...gapRules?.canIgnoreGapsof, userId];

    setGapRules((prev) => ({
      ...prev,
      canIgnoreGapsof: updatedIgnoreList,
    }));
  };

  console.log(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white text-gray-800 overflow-y-auto custom-scrollbar">
        <DialogHeader className="border-b border-gray-300 pb-2">
          <DialogTitle className="text-xl font-bold text-black">
            Configure Gap Rules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 ">
          <div className="space-y-4 bg-slate-50 p-4 rounded-lg border-2 shadow-md border-blue-50">
            <div className="grid grid-cols-2 gap-10">
              {/* Gap Days Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Gap Days
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={daysForGapValue}
                    onChange={(e) => setDaysForGapValue(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDayType("daysForGap")}
                    className={`flex items-center space-x-1 ${
                      dayTypes.daysForGap === "working"
                        ? "bg-orange-50 text-orange-800 hover:bg-orange-100 hover:text-orange-800 border-orange-200"
                        : "bg-blue-50 text-blue-800 hover:text-blue-800 hover:bg-blue-100 border-blue-200"
                    }`}
                  >
                    {dayTypes.daysForGap === "working" ? (
                      <>
                        <Briefcase size={16} className="text-orange-700" />
                        <span className="font-medium">Working Days</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} className="text-blue-700" />
                        <span className="font-medium">Calendar Days</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Minimum Days for Gap Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Minimum Days for Gap
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={minimumDaysForGapValue}
                    onChange={(e) => setMinimumDaysForGapValue(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDayType("minimumDaysForGap")}
                    className={`flex items-center space-x-1 ${
                      dayTypes.minimumDaysForGap === "working"
                        ? "bg-orange-50 text-orange-800 hover:bg-orange-100 hover:text-orange-800 border-orange-200"
                        : "bg-blue-50 text-blue-800 hover:text-blue-800 hover:bg-blue-100 border-blue-200"
                    }`}
                  >
                    {dayTypes.minimumDaysForGap === "working" ? (
                      <>
                        <Briefcase size={16} className="text-orange-700" />
                        <span className="font-medium">Working Days</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} className="text-blue-700" />
                        <span className="font-medium">Calendar Days</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Bypass All Gap Rules
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  type="button"
                  onClick={() =>
                    setGapRules((prev) => ({ ...prev, bypassGapRules: true }))
                  }
                  className={`${
                    gapRules.bypassGapRules
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={() =>
                    setGapRules((prev) => ({ ...prev, bypassGapRules: false }))
                  }
                  className={`${
                    !gapRules.bypassGapRules
                      ? "bg-red-50 text-red-800 hover:bg-red-100 border border-red-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  No
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Users That Can Be Ignored
              </label>
              <div className="bg-white border rounded-lg  overflow-y-auto custom-scrollbar p-4 max-h-[250px] relative">
                {gapRules.bypassGapRules && (
                  <div className="absolute inset-0 bg-gray-50/90 flex items-center justify-center">
                    <p className="text-gray-700 font-medium">
                      All Users Can Be Ignored
                    </p>
                  </div>
                )}
                {users
                  .filter((user) => user.userId !== selectedUserId)
                  .map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center space-x-2 py-2 border-b last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={gapRules?.canIgnoreGapsof?.includes(
                          user.userId
                        )}
                        onChange={() => handleUserSelect(user.userId)}
                        className="mr-2"
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <span className="text-sm">{user.name}</span>
                      <span className="text-sm text-gray-500">
                        - {user.email}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={handleCancel}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateGapUserRules.isPending}
            className="bg-lcoffe hover:bg-dcoffe text-gray-950"
          >
            {updateGapUserRules.isPending ? (
              <p className="flex items-center">
                <Loader className="animate-spin mr-1" />
                Saving
              </p>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GapRulesModal;
