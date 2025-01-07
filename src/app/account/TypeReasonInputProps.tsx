"use client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface TypeReasonInputProps {
  type: "overtime" | "absence" | "vacation";
  reason: string;
  onChange: (field: "type" | "reason", value: string) => void;
  className?: string;
}

export const TypeReasonInput = ({
  type,
  reason,
  onChange,
  className,
}: TypeReasonInputProps) => {
  return (
    <div
      className={`grid grid-cols-1 xsm:grid-cols-2 gap-4 ${className || ""}`}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <Select value={type} onValueChange={(value) => onChange("type", value)}>
          <option value="overtime">Overtime</option>
          <option value="absence">Absence</option>
          <option value="vacation">Vacation</option>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason
        </label>
        <Input
          type="text"
          value={reason}
          onChange={(e) => onChange("reason", e.target.value)}
          required
          className="w-full h-10 rounded-lg"
          placeholder="Project deadline..."
        />
      </div>
    </div>
  );
};
