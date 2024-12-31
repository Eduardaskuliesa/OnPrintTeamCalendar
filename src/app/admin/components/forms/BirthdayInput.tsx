"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface BirthDayInputProps {
  value?: string; // Made optional with ?
  onChange: (value: string) => void;
  className?: string;
}

export const BirthDayInput = ({
  value = "", // Add default value
  onChange,
  className,
}: BirthDayInputProps) => {
  const parseInitialValue = (dateString: string) => {
    if (!dateString) return { year: "", month: "", day: "" };
    const parts = dateString.split("-");
    return {
      year: parts[0] || "",
      month: parts[1] ? parseInt(parts[1], 10).toString() : "",
      day: parts[2] ? parseInt(parts[2], 10).toString() : "",
    };
  };

  const [dateParts, setDateParts] = useState(parseInitialValue(value));

  useEffect(() => {
    setDateParts(parseInitialValue(value));
  }, [value]);

  const formatDate = ({ year, month, day }: typeof dateParts) => {
    if (!year && !month && !day) return "";
    const formattedMonth = month ? month.padStart(2, "0") : "";
    const formattedDay = day ? day.padStart(2, "0") : "";
    if (!year || !formattedMonth || !formattedDay) return "";
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const handleInputChange = (part: "year" | "month" | "day", value: string) => {
    const newDateParts = {
      ...dateParts,
      [part]: value,
    };
    setDateParts(newDateParts);
    onChange(formatDate(newDateParts));
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
        Gimimo data
      </label>
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          name="birthYear"
          placeholder="Metai"
          min="1900"
          maxLength={4}
          onInput={(e) => handleNumberInput(e, 4)}
          max={new Date().getFullYear()}
          onChange={(e) => handleInputChange("year", e.target.value)}
          value={dateParts.year}
          className="w-full h-10 rounded-lg"
        />
        <Input
          type="number"
          name="birthMonth"
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
          name="birthDay"
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
