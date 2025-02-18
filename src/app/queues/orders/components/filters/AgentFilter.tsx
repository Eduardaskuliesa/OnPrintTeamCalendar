import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown } from "lucide-react";

interface AgentFilterProps {
    value: string | null;
    onChange: (value: string | null) => void;
    onClear: () => void;
}

const salesAgents = [
    "Jonas Jonaitis",
    "Petras Petraitis",
    "Ona Onaitė",
    "Marija Marijona"
];

export const AgentFilter = ({ value, onChange, onClear }: AgentFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-700" />
                        {value || "Vadybininkas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white" align="start">
                {salesAgents.map((agent) => (
                    <DropdownMenuItem
                        key={agent}
                        onClick={() => onChange(agent)}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                        {agent}
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