import React from 'react';
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
        from: Date | null;
        to: Date | null;
    };
    onChange: (value: { from: Date | null; to: Date | null }) => void;
    onClear: () => void;
}

export const DateRangeFilter = ({ value, onChange, onClear }: DateRangeFilterProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between border border-gray-300">
                    <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-700" />
                        {value.from
                            ? `${value.from.toLocaleDateString()} - ${value.to?.toLocaleDateString() || "..."}`
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
                            from: value.from || undefined,
                            to: value.to || undefined,
                        }}
                        onSelect={(range: any) => onChange(range)}
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