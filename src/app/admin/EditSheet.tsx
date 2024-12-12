import React, { useState } from "react";
import { Save } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SettingSection } from "@/types/global-settings";

interface EditSheetProps {
  section: SettingSection;
  isOpen: boolean;
  onClose: () => void;
  initialValues: any;
  onSave: (values: any) => Promise<void>;
}

const descriptions = {
  bookingRules: "Configure the core booking limitations and restrictions.",
  gapRules: "Set required gaps between consecutive bookings.",
  overlapRules: "Manage how many simultaneous bookings are allowed.",
  restrictedDays: "Define which days are unavailable for booking.",
  seasonalRules: "Manage seasonal booking restrictions and preferences.",
};

export const EditSheet = ({
  section,
  isOpen,
  onClose,
  initialValues,
  onSave,
}: EditSheetProps) => {
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(values);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <section.icon className={section.color} size={20} />
            {section.title}
          </SheetTitle>
          <p className="text-sm text-gray-500">{descriptions[section.key]}</p>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {section.items.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={item.key} className="text-sm font-medium">
                  {item.label}
                </Label>
                {typeof values[item.key] === "boolean" ? (
                  <Switch
                    id={item.key}
                    checked={values[item.key]}
                    onCheckedChange={(checked) =>
                      setValues((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                ) : (
                  <div className="w-full max-w-xs">
                    <div className="flex items-center justify-between">
                      <Input
                        id={item.key}
                        type="number"
                        value={values[item.key]}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [item.key]: parseInt(e.target.value),
                          }))
                        }
                        className="w-20 text-right"
                      />
                      <span className="text-sm text-gray-500 ml-2">
                        {item.label.toLowerCase().includes("days")
                          ? "days"
                          : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
