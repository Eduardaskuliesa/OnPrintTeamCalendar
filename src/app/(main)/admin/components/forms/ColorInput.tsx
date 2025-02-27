"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const COLORS: string[] = [
  "#7986cb",
  "#33b679",
  "#8e24aa",
  "#e67c73",
  "#f6c026",
  "#f5511d",
  "#795548",
  "#e91e63",
  "#3f51b5",
  "#0b8043",
];

interface ColorInputProps {
  color: string;
  onColorSelect: (color: string) => void;
  showPicker: boolean;
  onTogglePicker: (show: boolean) => void;
  className?: string;
}

export const ColorInput = ({
  color,
  onColorSelect,
  showPicker,
  onTogglePicker,
  className,
}: ColorInputProps) => {
  const [customColor, setCustomColor] = useState<string>("");

  const handleCustomColorAdd = (): void => {
    if (customColor && /^#([0-9A-F]{3}){1,2}$/i.test(customColor)) {
      COLORS.push(customColor);
      onColorSelect(customColor);
      setCustomColor("");
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Spalva
      </label>
      <button
        type="button"
        onClick={() => onTogglePicker(!showPicker)}
        className="w-full h-10 flex items-center justify-between outline-none px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-dcoffe focus:border-transparent"
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
          <span className="text-gray-700">Pasirinkti spalvą</span>
        </div>
        <X
          size={18}
          className={`transform transition-transform ${
            showPicker ? "rotate-0" : "rotate-45"
          }`}
        />
      </button>

      {showPicker && (
        <div className="absolute z-10 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 w-full">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {COLORS.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                onClick={() => onColorSelect(colorOption)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === colorOption
                    ? "border-dcoffe scale-110"
                    : "border-gray-200 hover:border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="#FFFFFF"
              value={customColor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCustomColor(e.target.value)
              }
              className="w-full h-8"
            />
            <Button
              type="button"
              onClick={handleCustomColorAdd}
              variant="outline"
              size="icon"
              className="h-8 w-12"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
