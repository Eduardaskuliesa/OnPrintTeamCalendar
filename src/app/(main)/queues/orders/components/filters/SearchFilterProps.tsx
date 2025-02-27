import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFilterProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

export const SearchFilter = ({ value, onChange, onClear }: SearchFilterProps) => {
    return (
        <div className="relative bg-white">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
                placeholder="Ieškoti..."
                className="pl-9 w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    onClick={onClear}
                    className="absolute text-2xl top-1 right-2 text-gray-600 hover:text-gray-800"
                >
                    ×
                </button>
            )}
        </div>
    );
};