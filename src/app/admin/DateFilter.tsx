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

interface DateFilterProps {
  currentYear: number;
  selectedYear: number;
  selectedMonth: string | null;
  months: string[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: string) => void;
  onSearch: () => void;
  onReset: () => void;
  children?: React.ReactNode;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  currentYear,
  selectedYear,
  selectedMonth,
  months,
  onYearChange,
  onMonthChange,
  onSearch,
  onReset,
  children,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-[100px] border-dcoffe ring-vdcoffe bg-white">
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
        <SelectTrigger className="w-[120px] border-dcoffe ring-vdcoffe bg-white">
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

      <Button
        onClick={onSearch}
        size="icon"
        variant="outline"
        className="w-10 h-9 border-dcoffe bg-white"
      >
        <Search className="w-4 h-4" />
      </Button>
      <Button
        onClick={onReset}
        size="icon"
        variant="outline"
        className="w-10 h-9 border-dcoffe bg-white"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>

      {children}
    </div>
  );
};

export default DateFilter;
