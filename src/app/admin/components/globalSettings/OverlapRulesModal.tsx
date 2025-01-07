/* eslint-disable react-hooks/exhaustive-deps */
// OverlapRulesModal.tsx
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
import { useUpdateUserOverlapRules } from "@/app/lib/actions/settings/user/hooks";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { User } from "@/app/types/api";
import { useNumericInput } from "@/app/hooks/useNumericInput";

interface OverlapRulesData {
  enabled: boolean;
  maxSimultaneousBookings: number;
  bypassOverlapRules: boolean;
  canIgnoreOverlapRulesOf: string[];
}

interface OverlapRulesModalProps {
  selectedUserId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: OverlapRulesData;
  users: User[];
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const OverlapRulesModal = ({
  isOpen,
  onClose,
  selectedUserId,
  initialData,
  users,
  onUnsavedChanges,
}: OverlapRulesModalProps) => {
  const [overlapRules, setOverlapRules] = useState<OverlapRulesData>({
    enabled: initialData.enabled,
    maxSimultaneousBookings: initialData.maxSimultaneousBookings,
    bypassOverlapRules: initialData.bypassOverlapRules,
    canIgnoreOverlapRulesOf: initialData.canIgnoreOverlapRulesOf,
  });

  const {
    value: localMaxSimultaneous,
    setValue: setLocalMaxSimultaneous,
    parseValue: parseLocalMaxSimultaneous,
  } = useNumericInput(initialData.maxSimultaneousBookings);

  const updateOverlapUserRules = useUpdateUserOverlapRules();

  const handleSave = useCallback(async () => {
    const currentMaxSimultaneous = parseLocalMaxSimultaneous();
    const hasChanges =
      currentMaxSimultaneous !== initialData.maxSimultaneousBookings ||
      overlapRules.bypassOverlapRules !== initialData.bypassOverlapRules ||
      JSON.stringify(overlapRules.canIgnoreOverlapRulesOf) !==
        JSON.stringify(initialData.canIgnoreOverlapRulesOf);

    if (!hasChanges) {
      handleNoChanges(ErrorMessages.OVERLAP_RULES.NO_CHANGES);
      onClose();
      return;
    }

    try {
      await updateOverlapUserRules.mutateAsync({
        userId: selectedUserId,
        overlapRules: {
          enabled: overlapRules.enabled,
          maxSimultaneousBookings: currentMaxSimultaneous,
          bypassOverlapRules: overlapRules.bypassOverlapRules,
          canIgnoreOverlapRulesOf: overlapRules.canIgnoreOverlapRulesOf,
        },
      });

      handleMutationResponse(true, ErrorMessages.OVERLAP_RULES);
      onClose();
    } catch (error) {
      handleMutationResponse(false, ErrorMessages.OVERLAP_RULES);
      console.error("Failed to update overlap rules:", error);
    }
  }, [
    overlapRules,
    initialData,
    onClose,
    selectedUserId,
    updateOverlapUserRules,
    parseLocalMaxSimultaneous,
  ]);

  const handleCancel = useCallback(() => {
    setOverlapRules(initialData);
    setLocalMaxSimultaneous(String(initialData.maxSimultaneousBookings));
    onClose();
  }, [initialData, onClose, setLocalMaxSimultaneous]);

  const handleUserSelect = (userId: string) => {
    const updatedIgnoreList = overlapRules.canIgnoreOverlapRulesOf.includes(
      userId
    )
      ? overlapRules.canIgnoreOverlapRulesOf.filter((id) => id !== userId)
      : [...overlapRules.canIgnoreOverlapRulesOf, userId];

    setOverlapRules((prev) => ({
      ...prev,
      canIgnoreOverlapRulesOf: updatedIgnoreList,
    }));
  };

  useEffect(() => {
    const currentMaxSimultaneous = parseLocalMaxSimultaneous();
    const hasChanges =
      currentMaxSimultaneous !== initialData.maxSimultaneousBookings ||
      overlapRules.bypassOverlapRules !== initialData.bypassOverlapRules ||
      JSON.stringify(overlapRules.canIgnoreOverlapRulesOf) !==
        JSON.stringify(initialData.canIgnoreOverlapRulesOf);

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white text-gray-800">
        <DialogHeader className="border-b border-gray-300 pb-2">
          <DialogTitle className="text-xl font-bold text-black">
            Configure Overlap Rules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4 bg-slate-50 p-4 rounded-lg border-2 shadow-md border-blue-50">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800 ">
                  Maximum Simultaneous Bookings
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={localMaxSimultaneous}
                  onChange={(e) => setLocalMaxSimultaneous(e.target.value)}
                  className="bg-white border-gray-200 text-gray-800 w-24"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800">
                  Bypass Overlap Rules
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    type="button"
                    onClick={() =>
                      setOverlapRules((prev) => ({
                        ...prev,
                        bypassOverlapRules: true,
                      }))
                    }
                    className={`${
                      overlapRules.bypassOverlapRules
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
                      setOverlapRules((prev) => ({
                        ...prev,
                        bypassOverlapRules: false,
                      }))
                    }
                    className={`${
                      !overlapRules.bypassOverlapRules
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
              <div
                className={`bg-white border rounded-lg p-4 max-h-[250px] relative ${
                  overlapRules.bypassOverlapRules
                    ? "overflow-hidden"
                    : "overflow-y-auto custom-scrollbar"
                }`}
              >
                {overlapRules.bypassOverlapRules && (
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
                        checked={overlapRules.canIgnoreOverlapRulesOf.includes(
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
            disabled={updateOverlapUserRules.isPending}
            className="bg-lcoffe hover:bg-dcoffe text-gray-950"
          >
            {updateOverlapUserRules.isPending ? (
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

export default OverlapRulesModal;
