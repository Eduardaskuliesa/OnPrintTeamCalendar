import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, ChevronDown } from "lucide-react";

interface ProductFilterProps {
    value: string | null;
    onChange: (value: string | null) => void;
    onClear: () => void;
}

const products = [
    "Produktas A",
    "Produktas B",
    "Produktas C",
    "Produktas D"
];

export const ProductFilter = ({ value, onChange, onClear }: ProductFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-700" />
                        {value || "Produktas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white" align="start">
                {products.map((product) => (
                    <DropdownMenuItem
                        key={product}
                        onClick={() => onChange(product)}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                        {product}
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