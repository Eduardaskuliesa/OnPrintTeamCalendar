import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

interface DateRangeFilterProps {
  value: {
    from: string | null;
    to: string | null;
  };
  onChange: (value: { from: string | null; to: string | null }) => void;
  onClear: () => void;
}

export const DateRangeFilter = ({
  value,
  onChange,
  onClear,
}: DateRangeFilterProps) => {
  const handleSelect = (range: any) => {
    if (!range) {
      onChange({ from: null, to: null });
      return;
    }

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const from = range.from ? formatDate(range.from) : null;
    const to = range.to ? formatDate(range.to) : null;

    onChange({ from, to });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between border border-gray-300"
        >
          <span className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-700" />
            {value.from
              ? `${value.from} - ${value.to || "..."}`
              : "Pasirinkite datą"}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            showOutsideDays={false}
            mode="range"
            selected={{
              from: value.from ? new Date(value.from) : undefined,
              to: value.to ? new Date(value.to) : undefined,
            }}
            onSelect={handleSelect}
            disableNavigation={false}
            toDate={new Date()}
            initialFocus
          />
          {(value.from || value.to) && (
            <Button
              onClick={onClear}
              variant="ghost"
              className="mt-2 text-gray-500"
            >
              Išvalyti
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
