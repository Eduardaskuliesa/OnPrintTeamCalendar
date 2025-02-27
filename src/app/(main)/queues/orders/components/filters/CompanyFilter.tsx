import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CompanyFilterProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

export const CompanyFilter = ({ value, onChange, onClear }: CompanyFilterProps) => {
    return (
        <div className="relative bg-white">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
                placeholder="Įmonės pavadinimas"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-9"
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