import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useState } from "react";

const EditModal = ({ section, isOpen, onClose, initialValues, onSave }) => {
  const [values, setValues] = useState(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(values);
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${section.bgColor}`}>
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <DialogTitle>{section.title}</DialogTitle>
          </div>
        </DialogHeader>

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
                  <div className="flex items-center gap-2">
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
                    <span className="text-sm text-gray-500">
                      {item.label.toLowerCase().includes("days") ? "days" : ""}
                    </span>
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
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
