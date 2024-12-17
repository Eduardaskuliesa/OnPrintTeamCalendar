/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Loader } from "lucide-react";
import {
  handleMutationResponse,
  ErrorMessages,
  handleNoChanges,
} from "@/app/utils/errorHandling";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdateRestrictedDays } from "@/app/lib/actions/settings/global/hooks";
import { useUpdateUserRestrictedDays } from "@/app/lib/actions/settings/user/hooks";

interface RestrictedDaysModalProps {
  isOpen: boolean;
  selectedUserId: string;
  onClose: () => void;
  initialData: {
    enabled: boolean;
    holidays: string[];
    weekends: {
      restriction: "all" | "none" | "saturday-only" | "sunday-only";
    };
    customRestricted: string[];
  };
  onUnsavedChanges: (
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => void;
}

const RestrictedDaysModal: React.FC<RestrictedDaysModalProps> = ({
  isOpen,
  selectedUserId,
  onClose,
  initialData,
  onUnsavedChanges,
}) => {
  const [holidays, setHolidays] = useState<Date[]>(
    initialData.holidays.map((date) => new Date(date))
  );
  const [customRestricted, setCustomRestricted] = useState<Date[]>(
    initialData.customRestricted.map((date) => new Date(date))
  );
  const [weekendSettings, setWeekendSettings] = useState(initialData.weekends);
  const [activeTab, setActiveTab] = useState<"holiday" | "custom">("holiday");
  const updateRestrictedDays = useUpdateRestrictedDays();
  const updateRestrictedUserDays = useUpdateUserRestrictedDays();

  const handleRemoveDate = (dateToRemove: Date, type: "holiday" | "custom") => {
    if (type === "holiday") {
      setHolidays((prev) =>
        prev.filter((date) => date.getTime() !== dateToRemove.getTime())
      );
    } else {
      setCustomRestricted((prev) =>
        prev.filter((date) => date.getTime() !== dateToRemove.getTime())
      );
    }
  };

  const handleCancel = useCallback(() => {
    setHolidays(initialData.holidays.map((date) => new Date(date)));
    setCustomRestricted(
      initialData.customRestricted.map((date) => new Date(date))
    );
    setWeekendSettings(initialData.weekends);
    onClose();
  }, [initialData, onClose]);

  const handleSave = useCallback(async () => {
    const newValues = {
      enabled: initialData.enabled,
      holidays: holidays.map((date) => format(date, "yyyy-MM-dd")),
      weekends: weekendSettings,
      customRestricted: customRestricted.map((date) =>
        format(date, "yyyy-MM-dd")
      ),
    };

    const hasChanges =
      JSON.stringify(newValues) !== JSON.stringify(initialData);

    if (!hasChanges) {
      handleNoChanges(ErrorMessages.RESTRICTED_DAYS.NO_CHANGES);
      onClose();
      return;
    }

    try {
      if (selectedUserId === "global") {
        await updateRestrictedDays.mutateAsync(newValues);
      } else {
        await updateRestrictedUserDays.mutateAsync({
          userId: selectedUserId,
          restrictedDays: newValues,
        });
      }

      handleMutationResponse(true, ErrorMessages.RESTRICTED_DAYS);
      onClose();
    } catch (error) {
      handleMutationResponse(false, ErrorMessages.RESTRICTED_DAYS);
      console.error("Failed to update restricted days:", error);
    }
  }, [
    holidays,
    customRestricted,
    weekendSettings,
    initialData,
    onClose,
    updateRestrictedDays,
  ]);

  useEffect(() => {
    const newValues = {
      enabled: initialData.enabled,
      holidays: holidays.map((date) => format(date, "yyyy-MM-dd")),
      weekends: weekendSettings,
      customRestricted: customRestricted.map((date) =>
        format(date, "yyyy-MM-dd")
      ),
    };

    const hasChanges =
      JSON.stringify(newValues) !== JSON.stringify(initialData);

    onUnsavedChanges(
      hasChanges,
      hasChanges ? handleSave : undefined,
      hasChanges ? handleCancel : undefined
    );
  }, []);

  const renderDateList = (dates: Date[], type: "holiday" | "custom") => (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-2">
        {dates.map((date) => (
          <div
            key={date.toString()}
            className="flex items-center justify-between p-2 bg-slate-100 rounded-lg border border-gray-200 hover:bg-opacity-80 transition-colors duration-200"
          >
            <div className="flex items-center space-x-2 text-gray-800">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {format(date, "MMMM d, yyyy")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveDate(date, type)}
              className="text-db hover:bg-gray-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-white text-gray-800">
        <DialogHeader className="border-b border-gray-300 pb-2">
          <DialogTitle className="text-xl font-bold text-black flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Configure Restricted Days
          </DialogTitle>
        </DialogHeader>

        <div className="flex space-x-4 h-[500px]">
          <div className="w-1/2 flex flex-col space-y-4">
            <div className="flex-1 w-full">
              <Calendar
                mode="multiple"
                selected={activeTab === "holiday" ? holidays : customRestricted}
                onSelect={(dates) => {
                  if (activeTab === "holiday") {
                    setHolidays(dates as Date[]);
                  } else {
                    setCustomRestricted(dates as Date[]);
                  }
                }}
                className="w-full rounded-md border [&_.rdp-table]:w-full [&_.rdp-cell]:w-full [&_.rdp]:w-full"
                modifiersStyles={{
                  selected: {
                    backgroundColor:
                      activeTab === "holiday" ? "#dc2626" : "#4f46e5",
                    color: "white",
                  },
                }}
              />
            </div>
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border shadow-sm border-blue-50">
              <h3 className="font-semibold text-db text-sm">
                Weekend Settings
              </h3>
              <RadioGroup
                value={weekendSettings.restriction}
                onValueChange={(
                  value: "all" | "none" | "saturday-only" | "sunday-only"
                ) =>
                  setWeekendSettings((prev) => ({
                    ...prev,
                    restriction: value,
                  }))
                }
                className="grid grid-cols-2 gap-2"
              >
                <Label className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 text-sm">
                  <RadioGroupItem value="all" id="all" />
                  <span>All Weekends</span>
                </Label>
                <Label className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 text-sm">
                  <RadioGroupItem value="saturday-only" id="saturday" />
                  <span>Saturdays Only</span>
                </Label>
                <Label className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 text-sm">
                  <RadioGroupItem value="sunday-only" id="sunday" />
                  <span>Sundays Only</span>
                </Label>
                <Label className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 text-sm">
                  <RadioGroupItem value="none" id="none" />
                  <span>No Restrictions</span>
                </Label>
              </RadioGroup>
            </div>
          </div>
          <div className="w-1/2 space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "holiday" | "custom")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="holiday">Holidays</TabsTrigger>
                <TabsTrigger value="custom">Custom Restricted Days</TabsTrigger>
              </TabsList>
              <TabsContent value="holiday" className="mt-4">
                <h3 className="font-semibold text-db text-lg mb-2">Holidays</h3>
                {renderDateList(holidays, "holiday")}
              </TabsContent>
              <TabsContent value="custom" className="mt-4">
                <h3 className="font-semibold text-db text-lg mb-2">
                  Custom Restricted Days
                </h3>
                {renderDateList(customRestricted, "custom")}
              </TabsContent>
            </Tabs>
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
            disabled={updateRestrictedDays.isPending}
            className="bg-lcoffe hover:bg-dcoffe text-gray-950"
          >
            {updateRestrictedDays.isPending ? (
              <p className="flex items-center">
                <Loader className="animate-spin mr-1" /> Saving
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

export default RestrictedDaysModal;
