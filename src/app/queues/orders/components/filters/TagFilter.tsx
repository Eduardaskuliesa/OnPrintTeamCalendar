// components/filters/TagFilter.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag as TagIcon, ChevronDown } from "lucide-react";
import { Tag } from '@/app/types/orderFilter';


interface TagFilterProps {
    value: Tag | null;
    onChange: (value: Tag | null) => void;
    onClear: () => void;
}

const tags: Tag[] = [
    "EMAIL", "NOTIFICATION", "REMINDER", "SMS", "PUSH", "WHATSAPP"
];

export const TagFilter = ({ value, onChange, onClear }: TagFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-2 text-gray-700" />
                        {value || "Tagas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white" align="start">
                {tags.map((tag) => (
                    <DropdownMenuItem
                        key={tag}
                        onClick={() => onChange(tag)}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                        {tag}
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