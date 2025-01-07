"use client";
import { Input } from "@/components/ui/input";

interface HoursDateInputProps {
  hours: number;
  date: string;
  onChange: (field: "hours" | "date", value: string) => void;
  className?: string;
}

export const HoursDateInput = ({
  hours,
  date,
  onChange,
  className,
}: HoursDateInputProps) => {
  return (
    <div
      className={`grid grid-cols-1 xsm:grid-cols-2 gap-4 ${className || ""}`}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hours
        </label>
        <Input
          type="number"
          value={hours || ""}
          onChange={(e) => onChange("hours", e.target.value)}
          required
          step="0.01"
          min="0"
          max="24"
          className="w-full h-10 rounded-lg"
          placeholder="8"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => onChange("date", e.target.value)}
          required
          className="w-full h-10 rounded-lg"
        />
      </div>
    </div>
  );
};
