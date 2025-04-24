import React from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentMethodFilterProps {
    selectedPaymentMethods: string[];
    onChange: (values: string[]) => void;
    onClear: () => void;
}


const paymentMethods = [
    "Sąskaita išankstiniam apmokėjimui",
    "PayPal",
    "Sąskaita už mėnesį",
    "El. bankininkystė (Populiariausias)",
    "Grynaisiais atsiimant",
    "Grynais užsakant",
    "Kortele užsakant",
    "Kortele atsiimant",
    "Nemokamai"
];

export const PaymentMethodFilter = ({
    selectedPaymentMethods = [],
    onChange,
    onClear
}: PaymentMethodFilterProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="border border-gray-300" asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center truncate">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-700" />
                        {selectedPaymentMethods.length > 0
                            ? `Pasirinkta ${selectedPaymentMethods.length} mokėjimo būdai`
                            : "Mokėjimo būdas"}
                    </span>
                    <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                        <ChevronDown className="h-4 w-4" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-[300px] custom-scrollbar overflow-y-auto bg-white" align="start">
                {paymentMethods.map((method) => (
                    <DropdownMenuItem
                        key={method}
                        onSelect={(e) => {
                            e.preventDefault();
                            const newSelected = selectedPaymentMethods.includes(method)
                                ? selectedPaymentMethods.filter(m => m !== method)
                                : [...selectedPaymentMethods, method];
                            onChange(newSelected);
                        }}
                        className="py-2 px-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    >
                        <Checkbox
                            checked={selectedPaymentMethods.includes(method)}
                            className="mr-2"
                        />
                        <span className="ml-2">{method}</span>
                    </DropdownMenuItem>
                ))}
                {selectedPaymentMethods.length > 0 && (
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            onClear()
                        }}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
                    >
                        Išvalyti
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};