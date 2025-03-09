import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ButtonStylesTabProps {
  localProps: {
    backgroundColor?: string;
    textColor?: string;
    [key: string]: any;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ButtonStylesTab: React.FC<ButtonStylesTabProps> = ({
  localProps,
  handleChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="backgroundColor"
          className="text-sm font-medium text-gray-900"
        >
          Background Color
        </Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="backgroundColorPicker"
            name="backgroundColor"
            value={localProps.backgroundColor || "#3B82F6"}
            onChange={handleChange}
            className="h-10 w-10 rounded-md border border-gray-300"
          />
          <Input
            id="backgroundColor"
            name="backgroundColor"
            value={localProps.backgroundColor || "#3B82F6"}
            onChange={handleChange}
            className="flex-1 bg-white"
          />
        </div>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="textColor"
          className="text-sm font-medium text-gray-900"
        >
          Text Color
        </Label>
        <div className="flex gap-2">
          <input
            type="color"
            id="textColorPicker"
            name="textColor"
            value={localProps.textColor || "#FFFFFF"}
            onChange={handleChange}
            className="h-10 w-10 rounded-md border border-gray-300"
          />
          <Input
            id="textColor"
            name="textColor"
            value={localProps.textColor || "#FFFFFF"}
            onChange={handleChange}
            className="flex-1 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonStylesTab;
