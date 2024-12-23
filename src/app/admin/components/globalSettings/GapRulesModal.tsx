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
import { Loader } from "lucide-react";
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
    bypassGapRules: initialData.bypassGapRules,
    canIgnoreGapsof: initialData.canIgnoreGapsof,
  });

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Minimum Gap Days
                </label>
                <Input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={localDays}
                  onChange={(e) => setLocalDays(e.target.value)}
                  className="bg-white border-gray-200 text-gray-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800">
                  Bypass Gap Rules
                </label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    checked={gapRules.bypassGapRules}
                    onChange={(e) =>
                      setGapRules((prev) => ({
                        ...prev,
                        bypassGapRules: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    Allow bypassing all gap rules
                  </span>
                </div>
              </div>
            </div>

            {!gapRules.bypassGapRules && (
              <div className="space-y-2 ">
                <label className="text-sm font-medium text-gray-800">
                  Users That Can Be Ignored
                </label>
                <div className="bg-white border rounded-lg p-4 max-h-[250px] overflow-y-auto custom-scrollbar">
                  {users
                    .filter((user) => user.email !== selectedUserId)
                    .map((user) => (
                      <div
                        key={user.email}
                        className="flex items-center space-x-2 py-2 border-b last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={gapRules.canIgnoreGapsof.includes(
                            user.email
                          )}
                          onChange={() => handleUserSelect(user.email)}
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
            )}
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
