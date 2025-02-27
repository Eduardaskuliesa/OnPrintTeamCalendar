"use client";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface CustomDayInputProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CustomDayInput = ({
  value = "",
  onChange,
  className,
}: CustomDayInputProps) => {
  const parseInitialValue = (dateString: string) => {
    if (!dateString) return { month: "", day: "" };
    const parts = dateString.split("-");
    return {
      month: parts[0] ? parseInt(parts[0], 10).toString() : "",
      day: parts[1] ? parseInt(parts[1], 10).toString() : "",
    };
  };

  const [dateParts, setDateParts] = useState(parseInitialValue(value));

  useEffect(() => {
    setDateParts(parseInitialValue(value));
  }, [value]);

  const formatDate = ({ month, day }: typeof dateParts) => {
    if (!month) return "";
    const formattedMonth = month.padStart(2, "0");
    const formattedDay = day ? day.padStart(2, "0") : "";

    if (!formattedDay) return formattedMonth;
    return `${formattedMonth}-${formattedDay}`;
  };

  const handleInputChange = (part: "month" | "day", value: string) => {
    const newDateParts = {
      ...dateParts,
      [part]: value,
    };
    setDateParts(newDateParts);

    const formattedDate = formatDate(newDateParts);
    if (formattedDate) {
      onChange(formattedDate);
    }
  };

  const handleNumberInput = (
    e: React.FormEvent<HTMLInputElement>,
    maxLength: number
  ) => {
    const target = e.target as HTMLInputElement;
    if (target.value.length > maxLength) {
      target.value = target.value.slice(0, maxLength);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Data
      </label>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          name="month"
          placeholder="Mėn"
          min="1"
          max="12"
          maxLength={2}
          onInput={(e) => handleNumberInput(e, 2)}
          onChange={(e) => handleInputChange("month", e.target.value)}
          value={dateParts.month}
          className="w-full h-10 rounded-lg"
        />
        <Input
          type="number"
          name="day"
          placeholder="Diena"
          min="1"
          max="31"
          maxLength={2}
          onInput={(e) => handleNumberInput(e, 2)}
          onChange={(e) => handleInputChange("day", e.target.value)}
          value={dateParts.day}
          className="w-full h-10"
        />
      </div>
    </div>
  );
};