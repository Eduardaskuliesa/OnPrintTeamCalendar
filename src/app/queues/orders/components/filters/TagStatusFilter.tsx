// components/filters/TagStatusFilter.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";
import { TagStatus } from '@/app/types/orderFilter';


interface TagStatusFilterProps {
    value: TagStatus | null;
    onChange: (value: TagStatus | null) => void;
    onClear: () => void;
}

const tagStatuses: Record<TagStatus, string> = {
    QUEUED: "Naujas",
    PENDING: "Vykdomas",
    SENT: "Išsiųstas",
    FAILED: "Klaida",
    CANCELLED: "Atšauktas"
};

export const TagStatusFilter = ({ value, onChange, onClear }: TagStatusFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-700" />
                        {value ? tagStatuses[value] : "Žymės būsena"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white" align="start">
                {Object.entries(tagStatuses).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onChange(key as TagStatus)}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                        {value}
                    </DropdownMenuItem>
                ))}
                {value && (
                    <DropdownMenuItem
                        onClick={onClear}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
                    >
                        Išvalyti
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};