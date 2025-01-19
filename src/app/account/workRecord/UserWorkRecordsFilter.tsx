"use client";
import React from "react";
import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserWorkRecordFilterProps {
  currentYear: number;
  selectedYear: number;
  selectedMonth: string | null;
  selectedDay: string | null;
  months: string[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: string) => void;
  onDayChange: (day: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const UserWorkRecordFilter: React.FC<UserWorkRecordFilterProps> = ({
  currentYear,
  selectedYear,
  selectedMonth,
  selectedDay,
  months,
  onYearChange,
  onMonthChange,
  onDayChange,
  onSearch,
  onReset,
}) => {
  const getDaysInMonth = () => {
    if (!selectedMonth) return [];
    const monthIndex = months.indexOf(selectedMonth);
    return Array.from(
      { length: new Date(selectedYear, monthIndex + 1, 0).getDate() },
      (_, i) => (i + 1).toString().padStart(2, "0")
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-[100px] border-none ring-vdcoffe bg-[#fefaf6]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedMonth || ""}
        onValueChange={(value) => onMonthChange(value)}
      >
        <SelectTrigger className="w-[120px] border-none ring-vdcoffe bg-[#fefaf6]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Visi</SelectItem>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedDay || ""}
        onValueChange={onDayChange}
        disabled={!selectedMonth}
      >
        <SelectTrigger className="w-[120px] border-none ring-vdcoffe bg-[#fefaf6]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Visos</SelectItem>
          {getDaysInMonth().map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={onSearch}
        size="icon"
        variant="outline"
        className="w-10 h-9  border-none bg-[#fefaf6]"
      >
        <Search className="w-4 h-4 " />
      </Button>
      <Button
        onClick={onReset}
        size="icon"
        variant="outline"
        className="w-10 h-9  border-none bg-[#fefaf6]"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserWorkRecordFilter;
