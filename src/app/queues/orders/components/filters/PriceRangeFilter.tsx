import React from 'react';
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
    value: { min: string; max: string };
    onChange: (value: { min: string; max: string }) => void;
}

const PriceRangeFilter = ({ value, onChange }: PriceRangeFilterProps) => {
    return (
        <div className="flex space-x-2 bg-white relative">
            <Input
                type="number"
                placeholder="Min €"
                value={value.min}
                onChange={(e) => onChange({ ...value, min: e.target.value })}
                className="w-1/2 bg-white"
            />
            <Input
                type="number"
                placeholder="Max €"
                value={value.max}
                onChange={(e) => onChange({ ...value, max: e.target.value })}
                className="w-1/2 bg-white"
            />

        </div>
    );
};

export default PriceRangeFilter;