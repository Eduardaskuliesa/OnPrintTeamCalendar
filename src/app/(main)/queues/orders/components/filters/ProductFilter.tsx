import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package, ChevronDown, Loader, Search } from "lucide-react";
import { useGetAllProducts } from '@/app/lib/actions/products/hooks/useGetProducts';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface ProductFilterProps {
    value: string[] | null;
    onChange: (value: string[] | null) => void;
    onClear: () => void;
}

export const ProductFilter = ({ value, onChange, onClear }: ProductFilterProps) => {
    const { data: productData, isLoading } = useGetAllProducts();
    const products = productData?.data.data || [];
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleToggleProduct = (productTitle: string) => {
        if (!value) {
            onChange([productTitle]);
            return;
        }

        const newValue = value.includes(productTitle)
            ? value.filter(title => title !== productTitle)
            : [...value, productTitle];

        onChange(newValue.length > 0 ? newValue : null);
    };

    const filteredProducts = products.filter((product: any) => {
        if (!searchTerm.trim()) return true;

        const productTitle = product.productTitle.toLowerCase();
        const search = searchTerm.toLowerCase().trim();

        if (productTitle === search) return true;

        if (productTitle.includes(search)) return true;

        const searchWords = search.split(/\s+/);

        return searchWords.some(word => {
            if (word.length < 2) return false;
            return productTitle.includes(word);
        });
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center truncate">
                        <Package className="h-4 w-4 mr-2 text-gray-700" />
                        {value && value.length > 0
                            ? `Pasirinkta ${value.length} produktai`
                            : "Produktas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-auto  bg-white"
                align="start"
            >
                <div className="p-2 border-b sticky top-0 bg-white z-10">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Ieškoti..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
                <div className="overflow-auto max-h-[400px] custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center p-4">
                            <Loader className="animate-spin" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            Produktų nerasta
                        </div>
                    ) : (
                        <>
                            {filteredProducts.map((product: any) => (
                                <DropdownMenuItem
                                    key={product.id}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        handleToggleProduct(product.id);
                                    }}
                                    className="py-2 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                >
                                    <Checkbox
                                        checked={value?.includes(product.id) || false}
                                        className="mr-2"
                                    />
                                    <span className="truncate">{product.productTitle}</span>
                                </DropdownMenuItem>
                            ))}
                        </>
                    )}
                </div>
                {value && value.length > 0 && (
                    <div className="p-1 border-t sticky bottom-0 bg-white">
                        <Button
                            variant="ghost"
                            className="w-full bg-gray-50 text-gray-500"
                            onClick={onClear}
                        >
                            Išvalyti
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};