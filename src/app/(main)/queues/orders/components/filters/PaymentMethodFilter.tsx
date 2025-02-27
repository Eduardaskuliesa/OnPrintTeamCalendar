// components/filters/PaymentMethodFilter.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, ChevronDown } from "lucide-react";
import { PaymentMethod } from '@/app/types/orderFilter';


interface PaymentMethodFilterProps {
    value: PaymentMethod | null;
    onChange: (value: PaymentMethod | null) => void;
    onClear: () => void;
}

const paymentMethods: Record<PaymentMethod, string> = {
    BUSINESS_CARD: "Verslo kortelė",
    ADVANCE_PAYMENT: "Išankstinis mokėjimas",
    E_PAYMENT: "Elektroninis mokėjimas",
    CASH: "Grynaisiais",
    BANK_TRANSFER: "Banko pavedimas",
    CREDIT_CARD: "Kreditinė kortelė"
};

export const PaymentMethodFilter = ({ value, onChange, onClear }: PaymentMethodFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-700" />
                        {value ? paymentMethods[value] : "Mokėjimo būdas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white" align="start">
                {Object.entries(paymentMethods).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => onChange(key as PaymentMethod)}
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