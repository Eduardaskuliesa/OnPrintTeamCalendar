import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { BorderStyle, EmailButtonProps } from "../../../emailComponents/Button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { SelectTrigger, SelectValue } from "@radix-ui/react-select";

interface ButtonStylesTabProps {
  localProps: EmailButtonProps;
  handleShapeChange: (value: number) => void;
  handleBorderStyleChange: (value: BorderStyle) => void;
  handleBorderWidthChange: (value: number) => void;
  handleBorderColorChange: (value: string) => void;
  handleBackgroundColorChange: (value: string) => void;
  handleTextColorChange: (value: string) => void;
}

const ButtonStylesTab: React.FC<ButtonStylesTabProps> = ({
  localProps,
  handleShapeChange,
  handleBorderStyleChange,
  handleBorderWidthChange,
  handleBackgroundColorChange,
  handleTextColorChange,
  handleBorderColorChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Shape */}
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="buttonShape"
          className="text-base font-medium text-gray-900"
        >
          Shape
        </Label>
        <div className="bg-white p-0.5 rounded-md border border-gray-200">
          <div className="flex">
            <Button
              type="button"
              className="w-full duration-75 rounded-sm border-none"
              variant={localProps.borderRadius === 0 ? "default" : "outline"}
              onClick={() => handleShapeChange(0)}
            >
              Square
            </Button>
            <Button
              type="button"
              className="w-full duration-75 rounded-sm border-none"
              variant={localProps.borderRadius === 6 ? "default" : "outline"}
              onClick={() => handleShapeChange(6)}
            >
              Round
            </Button>
            <Button
              type="button"
              className="w-full duration-75 rounded-sm border-none"
              variant={localProps.borderRadius === 9999 ? "default" : "outline"}
              onClick={() => handleShapeChange(9999)}
            >
              Pill
            </Button>
          </div>
        </div>
      </div>
      {/* Border */}
      <div className="grid w-full gap-1.5">
        <Label
          htmlFor="borderStyle"
          className="text-base font-medium text-gray-900"
        >
          Border
        </Label>
        <Select
          value={localProps.borderStyle || "none"}
          onValueChange={(value: BorderStyle) => handleBorderStyleChange(value)}
        >
          <SelectTrigger className="bg-white px-2 py-2 text-start rounded-md border border-gray-300">
            <SelectValue placeholder="Select border style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="flex py-2 items-center gap-2">
              <span className="inline-block mr-2">None</span>
              <div className="inline-block h-3 w-12"></div>
            </SelectItem>
            <SelectItem value="solid" className="flex items-center py-2 gap-2">
              <span className="inline-block mr-2">Solid</span>
              <div className="inline-block h-3 w-12 border border-solid border-current"></div>
            </SelectItem>
            <SelectItem value="dashed" className="flex py-2 items-center gap-2">
              <span className="inline-block mr-2">Dashed</span>
              <div className="inline-block h-3 w-12 border border-dashed border-current"></div>
            </SelectItem>
            <SelectItem value="dotted" className="flex py-2 items-center gap-2">
              <span className="inline-block mr-2">Dotted</span>
              <div className="inline-block h-3 w-12 border border-dotted border-current"></div>
            </SelectItem>
            <SelectItem value="double" className="flex py-2 items-center">
              <span className="inline-block mr-2">Double</span>
              <div className="inline-block h-3 w-12 border-4 border-double border-current"></div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Show border width and color controls only when border style isn't "none" */}
      {localProps.borderStyle && localProps.borderStyle !== "none" && (
        <div className="grid w-full items-center gap-1.5">
          <Label
            htmlFor="borderSettings"
            className="text-base font-medium text-gray-900"
          >
            Border Settings
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex items-center h-9 rounded-md border border-gray-300 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.max(
                      1,
                      (localProps.borderWidth || 1) - 1
                    );
                    handleBorderWidthChange(newValue);
                  }}
                  className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  id="borderWidth"
                  value={localProps.borderWidth || 1}
                  onChange={(e) =>
                    handleBorderWidthChange(parseInt(e.target.value) || 1)
                  }
                  min={1}
                  max={10}
                  className="w-full h-full text-center border-none focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    const newValue = Math.min(
                      10,
                      (localProps.borderWidth || 1) + 1
                    );
                    handleBorderWidthChange(newValue);
                  }}
                  className="flex items-center justify-center h-full px-2 text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-1">
              <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
                <input
                  type="color"
                  id="borderColorPicker"
                  value={localProps.borderColor || "#000000"}
                  onChange={(e) => handleBorderColorChange(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: localProps.borderColor || "#000000",
                  }}
                />
              </div>
              <Input
                id="borderColor"
                value={localProps.borderColor || "#000000"}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="flex-1 bg-white"
              />
            </div>
          </div>
        </div>
      )}
      {/* Background Color */}
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
              value={localProps.backgroundColor || "#3B82F6"}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: localProps.backgroundColor || "#3B82F6",
              }}
            />
          </div>
          <Input
            id="backgroundColor"
            value={localProps.backgroundColor || "#3B82F6"}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
            className="flex-1 bg-white"
          />
        </div>
      </div>
      {/* Text Color */}
      <div className="grid w-full items-center gap-1.5">
        <Label
          htmlFor="textColor"
          className="text-base font-medium text-gray-900"
        >
          Text Color
        </Label>
        <div className="flex gap-2">
          <div className="relative overflow-hidden h-9 w-9 rounded-full border-2 border-gray-300">
            <input
              type="color"
              id="textColorPicker"
              value={localProps.textColor || "#FFFFFF"}
              onChange={(e) => handleTextColorChange(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: localProps.textColor || "#FFFFFF",
              }}
            />
          </div>
          <Input
            id="textColor"
            value={localProps.textColor || "#FFFFFF"}
            onChange={(e) => handleTextColorChange(e.target.value)}
            className="flex-1 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonStylesTab;
