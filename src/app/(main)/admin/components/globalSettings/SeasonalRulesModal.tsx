/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Trash2, ArrowRight, Loader } from "lucide-react";
import { format } from "date-fns";
import { useUpdateSeasonalRules } from "../../../../lib/actions/settings/global/hooks";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { useUpdateUserSeasonalRules } from "@/app/lib/actions/settings/user/hooks";

interface Period {
  start: string;
  end: string;
  reason: string;
  name: string;
}

interface SeasonalRulesModalProps {
  selectedUserId: string;
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    enabled: boolean;
    blackoutPeriods: Period[];
    preferredPeriods: Period[];
  };
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const SeasonalRulesModal = ({
  isOpen,
  onClose,
  selectedUserId,
  initialData,
  onUnsavedChanges,
}: SeasonalRulesModalProps) => {
  const [blackoutPeriods, setBlackoutPeriods] = useState<Period[]>(
    initialData.blackoutPeriods
  );
  const [preferredPeriods, setPreferredPeriods] = useState<Period[]>(
    initialData.preferredPeriods
  );

  const [newBlackout, setNewBlackout] = useState<Period>({
    start: "",
    end: "",
    reason: "",
    name: "",
  });

  const [newPreferred, setNewPreferred] = useState<Period>({
    start: "",
    end: "",
    reason: "",
    name: "",
  });

  const updateSeasonalRules = useUpdateSeasonalRules();
  const updateSeasonalUserRules = useUpdateUserSeasonalRules();
  const today = new Date().toISOString().split("T")[0];

  const handleAddBlackout = () => {
    if (
      newBlackout.start &&
      newBlackout.end &&
      newBlackout.reason &&
      newBlackout.name
    ) {
      setBlackoutPeriods([...blackoutPeriods, newBlackout]);
      setNewBlackout({ start: "", end: "", reason: "", name: "" });
    }
  };

  const handleAddPreferred = () => {
    if (
      newPreferred.start &&
      newPreferred.end &&
      newPreferred.reason &&
      newPreferred.name
    ) {
      setPreferredPeriods([...preferredPeriods, newPreferred]);
      setNewPreferred({ start: "", end: "", reason: "", name: "" });
    }
  };

  const handleRemoveBlackout = (index: number) => {
    setBlackoutPeriods(blackoutPeriods.filter((_, i) => i !== index));
  };

  const handleRemovePreferred = (index: number) => {
    setPreferredPeriods(preferredPeriods.filter((_, i) => i !== index));
  };

  const handleCancel = useCallback(() => {
    setBlackoutPeriods(initialData.blackoutPeriods);
    setPreferredPeriods(initialData.preferredPeriods);
    onClose();
  }, [initialData.blackoutPeriods, initialData.preferredPeriods, onClose]);

  const handleSave = useCallback(async () => {
    const hasBlackoutChanges =
      JSON.stringify(blackoutPeriods) !==
      JSON.stringify(initialData.blackoutPeriods);
    const hasPreferredChanges =
      JSON.stringify(preferredPeriods) !==
      JSON.stringify(initialData.preferredPeriods);

    const hasChanges = hasBlackoutChanges || hasPreferredChanges;

    if (!hasChanges) {
      handleNoChanges(ErrorMessages.SEASONAL_RULES.NO_CHANGES);
      onClose();
      return;
    }

    try {
      if (selectedUserId === "global") {
        await updateSeasonalRules.mutateAsync({
          enabled: initialData.enabled,
          blackoutPeriods,
          preferredPeriods,
        });
      } else {
        await updateSeasonalUserRules.mutateAsync({
          userId: selectedUserId,
          seasonalRules: {
            enabled: initialData.enabled,
            blackoutPeriods,
            preferredPeriods,
          },
        });
      }

      handleMutationResponse(true, ErrorMessages.SEASONAL_RULES);
      onClose();
    } catch (error) {
      handleMutationResponse(false, ErrorMessages.SEASONAL_RULES);
      console.error("Failed to update seasonal rules:", error);
    }
  }, [
    blackoutPeriods,
    initialData.blackoutPeriods,
    initialData.enabled,
    initialData.preferredPeriods,
    onClose,
    preferredPeriods,
    updateSeasonalRules,
  ]);

  // In SeasonalRulesModal
  useEffect(() => {
    // Add all dependencies to deps array and memoize callbacks
    const hasBlackoutChanges =
      JSON.stringify(blackoutPeriods) !==
      JSON.stringify(initialData.blackoutPeriods);
    const hasPreferredChanges =
      JSON.stringify(preferredPeriods) !==
      JSON.stringify(initialData.preferredPeriods);

    const hasChanges = hasBlackoutChanges || hasPreferredChanges;

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, [blackoutPeriods, preferredPeriods, JSON.stringify(initialData)]);

  const renderPeriodInput = (
    title: string,
    period: Period,
    setPeriod: (period: Period) => void,
    handleAdd: () => void
  ) => (
    <div className="space-y-3 bg-slate-50  p-4 rounded-lg border-2 shadow-md border-blue-50">
      <h3 className="font-semibold text-db text-lg">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-800">
            Start Date
          </label>
          <Input
            type="date"
            min={today}
            value={period.start}
            onChange={(e) => setPeriod({ ...period, start: e.target.value })}
            className="bg-white border-gray-200  text-gray-800"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-800">End Date</label>
          <Input
            type="date"
            min={period.start || today}
            value={period.end}
            onChange={(e) => setPeriod({ ...period, end: e.target.value })}
            className="bg-white border-gray-200 text-gray-800 focus:border-lcoffe"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-800">Name</label>
          <Input
            value={period.name}
            onChange={(e) => setPeriod({ ...period, name: e.target.value })}
            placeholder="Enter name..."
            className="bg-white border-gray-200 text-gray-800"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-800">Reason</label>
          <div className="flex gap-2">
            <Input
              value={period.reason}
              onChange={(e) => setPeriod({ ...period, reason: e.target.value })}
              placeholder="Enter reason..."
              className="bg-white border-gray-200 text-gray-800"
            />
            <Button
              onClick={handleAdd}
              disabled={
                !period.start || !period.end || !period.reason || !period.name
              }
              className="bg-lcoffe hover:bg-dcoffe text-db"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPeriodList = (
    title: string,
    periods: Period[],
    handleRemove: (index: number) => void
  ) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 sticky top-0 bg-white py-2 z-10">
        {title}
      </h3>
      <div className="pr-2 space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar">
        {periods.map((period, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-slate-100 rounded-lg border border-gray-200 hover:bg-opacity-80 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2 text-gray-800">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{period.name}</span>
              <span className="text-xs">
                {format(new Date(period.start), "MMM d, yyyy")}
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="text-xs">
                {format(new Date(period.end), "MMM d, yyyy")}
              </span>
              <span className="text-xs">- {period.reason}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="text-db hover:bg-gray-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[96vh] bg-white text-gray-800 overflow-auto custom-scrollbar">
        <DialogHeader className="border-b border-gray-300 pb-2">
          <DialogTitle className="text-xl font-bold text-black">
            Configure Seasonal Rules
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6  overflow-y-auto custom-scrollbar">
          {renderPeriodInput(
            "Add Blackout Period",
            newBlackout,
            setNewBlackout,
            handleAddBlackout
          )}
          {blackoutPeriods.length > 0 && (
            <div className="mt-4">
              {renderPeriodList(
                "Blackout Periods",
                blackoutPeriods,
                handleRemoveBlackout
              )}
            </div>
          )}
          <div className="border-t border-gray-400 pt-4">
            {renderPeriodInput(
              "Add Preferred Period",
              newPreferred,
              setNewPreferred,
              handleAddPreferred
            )}
            {preferredPeriods.length > 0 && (
              <div className="mt-4">
                {renderPeriodList(
                  "Preferred Periods",
                  preferredPeriods,
                  handleRemovePreferred
                )}
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
            disabled={updateSeasonalRules.isPending}
            className="bg-lcoffe hover:bg-dcoffe text-gray-950"
          >
            {updateSeasonalRules.isPending ? (
              <p className="flex items-center">
                <Loader className="animate-spin mr-1"></Loader> Saving
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

export default SeasonalRulesModal;
