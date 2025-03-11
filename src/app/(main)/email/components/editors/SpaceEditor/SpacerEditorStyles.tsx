import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { EmailSpacerProps } from "../../../emailComponents/Spacer";

interface SpacerEditorStylesProps {
  localProps: EmailSpacerProps;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundColorChange: (value: string) => void;
}

const SpacerEditorStyles: React.FC<SpacerEditorStylesProps> = ({
  localProps,
  handleHeightChange,
  handleBackgroundColorChange,
}) => {
  return (
    <div className="spacey-4">
      {/* Height Control */}
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="spacerHeight"
          className="text-base font-medium text-gray-900"
        >
          Height
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Slider
              id="heightSlider"
              value={[localProps.height ?? 0]}
              max={100}
              step={1}
              onValueChange={(value) => {
                const event = {
                  target: {
                    value: value[0].toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>;
                handleHeightChange(event);
              }}
            />
          </div>
          <span className="text-sm text-gray-500 w-8">
            {localProps.height}px
          </span>
        </div>
      </div>

      {/* Background Color Control */}
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="backgroundColor"
          className="text-base font-medium text-gray-900"
        >
          Background Color
        </Label>
        <div className="flex gap-2">
          <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
            <input
              type="color"
              id="backgroundColorPicker"
              value={localProps.containerBackgroundColor || "#FFFFFF"}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor:
                  localProps.containerBackgroundColor || "#FFFFFF",
              }}
            />
          </div>
          <Input
            id="backgroundColor"
            value={localProps.containerBackgroundColor || "transparent"}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
            className="flex-1 bg-white"
            placeholder="e.g., transparent, #FFFFFF"
          />
        </div>
      </div>
    </div>
  );
};

export default SpacerEditorStyles;
