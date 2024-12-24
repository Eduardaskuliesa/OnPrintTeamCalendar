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
import {
  Briefcase,
  Calendar,
  Loader,
} from "lucide-react";
import { useUpdateUserGapDays } from "@/app/lib/actions/settings/user/hooks";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { User } from "@/app/types/api";
import { useNumericInput } from "@/app/hooks/useNumericInput";

interface GapRulesData {
  enabled: boolean;
  days: number;
  dayType: "working" | "calendar";
  bypassGapRules: boolean;
  canIgnoreGapsof: string[];
}

interface GapRulesModalProps {
  selectedUserId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: GapRulesData;
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
  const [gapRules, setGapRules] = useState<GapRulesData>({
    enabled: initialData.enabled,
    days: initialData.days,
    dayType: initialData.dayType || "working",
    bypassGapRules: initialData.bypassGapRules,
    canIgnoreGapsof: initialData.canIgnoreGapsof,
  });
  const [isWorkingDays, setIsWorkingDays] = useState(
    initialData.dayType === "working"
  );

  const toggleDayType = () => {
    setIsWorkingDays(!isWorkingDays);
    setGapRules((prev) => ({
      ...prev,
      dayType: !isWorkingDays ? "working" : "calendar",
    }));
  };

  const {
    value: localDays,
    setValue: setLocalDays,
    parseValue: parseLocalDays,
  } = useNumericInput(initialData.days);

  const updateGapUserRules = useUpdateUserGapDays();

  const handleSave = useCallback(async () => {
    const currentDays = parseLocalDays();
    const hasChanges =
      currentDays !== initialData.days ||
      gapRules.bypassGapRules !== initialData.bypassGapRules ||
      gapRules.dayType !== initialData.dayType ||
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
        gapRules: {
          enabled: gapRules.enabled,
          days: currentDays,
          dayType: isWorkingDays ? "working" : "calendar",
          bypassGapRules: gapRules.bypassGapRules,
          canIgnoreGapsof: gapRules.canIgnoreGapsof,
        },
      });

      handleMutationResponse(true, ErrorMessages.GAP_RULES);
      onClose();
    } catch (error) {
      handleMutationResponse(false, ErrorMessages.GAP_RULES);
      console.error("Failed to update gap rules:", error);
    }
  }, [
    gapRules,
    initialData,
    onClose,
    selectedUserId,
    updateGapUserRules,
    parseLocalDays,
    isWorkingDays,
  ]);

  const handleCancel = useCallback(() => {
    setLocalDays(String(initialData.days));
    setGapRules(initialData);
    onClose();
  }, [initialData, onClose, setLocalDays]);

  useEffect(() => {
    const currentDays = parseLocalDays();
    const hasChanges =
      currentDays !== initialData.days ||
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
    const updatedIgnoreList = gapRules.canIgnoreGapsof.includes(userId)
      ? gapRules.canIgnoreGapsof.filter((id) => id !== userId)
      : [...gapRules.canIgnoreGapsof, userId];

    setGapRules((prev) => ({
      ...prev,
      canIgnoreGapsof: updatedIgnoreList,
    }));
  };

  console.log(isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white text-gray-800">
        <DialogHeader className="border-b border-gray-300 pb-2">
          <DialogTitle className="text-xl font-bold text-black">
            Configure Gap Rules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4 bg-slate-50 p-4 rounded-lg border-2 shadow-md border-blue-50">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Minimum Gap Days
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={localDays}
                    onChange={(e) => setLocalDays(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 w-24"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDayType}
                    className={`flex items-center space-x-1  ${
                      isWorkingDays
                        ? "bg-orange-50 text-orange-800 hover:bg-orange-100 hover:text-orange-800 border-orange-200"
                        : "bg-blue-50 text-blue-800 hover:text-blue-800 hover:bg-blue-100 border-blue-200"
                    }`}
                  >
                    {isWorkingDays ? (
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
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
                      setGapRules((prev) => ({
                        ...prev,
                        bypassGapRules: false,
                      }))
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Users That Can Be Ignored
              </label>
              <div className="bg-white border rounded-lg p-4 max-h-[250px] relative">
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
                        checked={gapRules.canIgnoreGapsof.includes(user.userId)}
                        onChange={() => handleUserSelect(user.userId)}
                        className="mr-2"
                      />
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      <span className="text-sm">{user.name}</span>
                      <span className="text-sm">- {user.email}</span>
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
