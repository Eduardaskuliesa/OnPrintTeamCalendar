import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock } from "lucide-react";

interface CustomTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomTimeInput({ value, onChange }: CustomTimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes] = value ? value.split(":") : ["", ""];

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 23) {
      const formattedHours = val.toString().padStart(2, "0");
      onChange(`${formattedHours}:${minutes || "00"}`);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= 0 && val <= 59) {
      const formattedMinutes = val.toString().padStart(2, "0");
      onChange(`${hours || "00"}:${formattedMinutes}`);
    }
  };

  const presetTimes = [
    "00:05",
    "00:10",
    "00:15",
    "00:20",
    "00:30",
    "00:45",
    "01:00",
    "01:15",
    "01:30",
    "02:00",
    "03:00",
    "04:00",
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal h-10 border-gray-300 border rounded-lg"
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Pasirinkite laiką"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Valandos</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={23}
              value={hours}
              onChange={handleHourChange}
              className="w-full"
              placeholder="HH"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Minutes</label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={minutes}
              onChange={handleMinuteChange}
              className="w-full"
              placeholder="MM"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {presetTimes.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => {
                onChange(preset);
                setIsOpen(false);
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
