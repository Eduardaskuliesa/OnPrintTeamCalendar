import React from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Check, X, Loader2 } from "lucide-react";

interface EditableControlsProps {
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditableControls: React.FC<EditableControlsProps> = ({
  isEditing,
  isPending,
  onEdit,
  onSave,
  onCancel,
}) => {
  if (isEditing) {
    return (
      <div className="space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isPending}
          className="p-0 w-8 h-8 bg-rose-200 hover:bg-rose-300 transition-colors"
        >
          <X className="w-4 h-4 text-red-900" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onSave}
          disabled={isPending}
          className="p-0 w-8 h-8 bg-emerald-200 hover:bg-emerald-300"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
          ) : (
            <Check className="w-4 h-4 text-green-900" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
      onClick={onEdit}
    >
      <Settings2 className="w-4 h-4 mr-1" />
      Configure
    </Button>
  );
};

export default EditableControls;
