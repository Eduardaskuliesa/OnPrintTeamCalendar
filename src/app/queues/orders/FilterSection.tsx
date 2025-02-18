import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Filter, Search, Tag, Calendar as CalendarIcon, Globe, User, Package, CreditCard } from "lucide-react";

type BullMQStatus = "delayed" | "active" | "completed" | "failed" | "paused";
type Tag = "EMAIL" | "NOTIFICATION" | "REMINDER" | "SMS" | "PUSH" | "WHATSAPP";
type TagStatus = "NEW" | "PROCESSING" | "SENT" | "ERROR" | "CANCELLED";
type Location = {
    country: string;
    city: string | null;
};

const FiltersSection = () => {
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [selectedTagStatus, setSelectedTagStatus] = useState<TagStatus | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [cityInput, setCityInput] = useState<string>("");
    const [companyName, setCompanyName] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState<{
        from: Date | null;
        to: Date | null;
    }>({
        from: null,
        to: null,
    });
    const [priceRange, setPriceRange] = useState<{
        min: string;
        max: string;
    }>({
        min: "",
        max: "",
    });

    // Mock data with Lithuanian translations
    const tags: Tag[] = [
        "EMAIL", "NOTIFICATION", "REMINDER", "SMS", "PUSH", "WHATSAPP"
    ];
    type PaymentMethod = "BUSINESS_CARD" | "ADVANCE_PAYMENT" | "E_PAYMENT" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD"

    const paymentMethods: Record<PaymentMethod, string> = {
        BUSINESS_CARD: "Verslo kortelė",
        ADVANCE_PAYMENT: "Išankstinis mokėjimas",
        E_PAYMENT: "Elektroninis mokėjimas",
        CASH: "Grynaisiais",
        BANK_TRANSFER: "Banko pavedimas",
        CREDIT_CARD: "Kreditinė kortelė"
    };

    const tagStatuses: Record<TagStatus, string> = {
        NEW: "Naujas",
        PROCESSING: "Vykdomas",
        SENT: "Išsiųstas",
        ERROR: "Klaida",
        CANCELLED: "Atšauktas"
    };

    const locations = [
        {
            country: "Lietuva",
            cities: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys"]
        },
        {
            country: "Latvija",
            cities: ["Ryga", "Daugpilis", "Liepoja"]
        },
        {
            country: "Estija",
            cities: ["Talinas", "Tartu", "Narva"]
        }
    ];

    const salesAgents = [
        "Jonas Jonaitis",
        "Petras Petraitis",
        "Ona Onaitė",
        "Marija Marijona"
    ];

    const products = [
        "Produktas A",
        "Produktas B",
        "Produktas C",
        "Produktas D"
    ];

    const handleClearFilters = () => {
        setSelectedTag(null);
        setSelectedTagStatus(null);
        setSelectedLocation(null);
        setSelectedAgent(null);
        setSelectedProduct(null);
        setSelectedDateRange({ from: null, to: null });
        setPriceRange({ min: "", max: "" });
    };

    const handleLocationSelect = (country: string) => {
        // Don't reset cityInput when selecting country
        setSelectedLocation(prev => ({
            country,
            city: prev?.city || null
        }));
    };


    const handleCityConfirm = () => {
        if (!selectedLocation?.country) {
            setError("Pasirinkite šalį");
            return;
        }

        setSelectedLocation(prev => ({
            country: prev?.country || '',
            city: cityInput
        }));
        setIsOpen(false);
        setError(null);
    };
    const handleSubmit = () => {
        // Handle filter submission
        const filters = {
            tag: selectedTag,
            tagStatus: selectedTagStatus,
            location: selectedLocation,
            agent: selectedAgent,
            product: selectedProduct,
            dateRange: selectedDateRange,
            priceRange
        };
        console.log('Applied filters:', filters);
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Search Input */}
                <div className="relative bg-white">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Ieškoti..." className="pl-9 w-full" />
                </div>

                {/* Company Name Filter */}
                <div className="relative bg-white">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Įmonės pavadinimas"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9"
                    />
                </div>


                {/* Location Filter */}
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedLocation
                                    ? `${selectedLocation.country}${selectedLocation.city ? ` - ${selectedLocation.city}` : ''}`
                                    : "Pasirinkite vietą"}
                            </span>
                            <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                                <ChevronDown className="h-4 w-4" />
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-white" align="start">
                        {locations.map((loc) => (
                            <DropdownMenuSub key={loc.country}>
                                <DropdownMenuSubTrigger
                                    className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        handleLocationSelect(loc.country, true);
                                        setError(null);
                                    }}
                                >
                                    {loc.country}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="bg-white p-2">
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            placeholder="Įveskite miestą"
                                            value={cityInput}
                                            onChange={(e) => setCityInput(e.target.value)}
                                            className="mb-2"
                                        />
                                        <div className="flex flex-col gap-1">
                                            <Button
                                                onClick={handleCityConfirm}
                                                className="w-1/3 px-2 py-1 h-6 bg-dcoffe hover:bg-vdcoffe text-db hover:text-gray-50 transition-colors"
                                            >
                                                Ok
                                            </Button>
                                            {error && (
                                                <p className="text-red-500 text-xs">
                                                    {error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>


                {/* Tag Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <Tag className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedTag || "Tagas"}
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
                                onClick={() => setSelectedTag(tag)}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {tag}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Tag Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <Filter className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedTagStatus ? tagStatuses[selectedTagStatus] : "Žymės būsena"}
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
                                onClick={() => setSelectedTagStatus(key as TagStatus)}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {value}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Sales Agent Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedAgent || "Vadybininkas"}
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
                                onClick={() => setSelectedAgent(agent)}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {agent}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Product Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <Package className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedProduct || "Produktas"}
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
                                onClick={() => setSelectedProduct(product)}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {product}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Range */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between border border-gray-300">
                            <span className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedDateRange.from
                                    ? `${selectedDateRange.from.toLocaleDateString()} - ${selectedDateRange.to?.toLocaleDateString() || "..."
                                    }`
                                    : "Pasirinkite datą"}
                            </span>
                            <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                                <ChevronDown className="h-4 w-4" />
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={{
                                from: selectedDateRange.from || undefined,
                                to: selectedDateRange.to || undefined,
                            }}
                            onSelect={(range: any) => setSelectedDateRange(range)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {/* Price Range */}
                <div className="flex space-x-2 bg-white">
                    <Input
                        type="number"
                        placeholder="Min €"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-1/2 bg-white"
                    />
                    <Input
                        type="number"
                        placeholder="Max €"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-1/2 bg-white"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="border border-gray-300" asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center">
                                <CreditCard className="h-4 w-4 mr-2 text-gray-700" />
                                {selectedPaymentMethod ? paymentMethods[selectedPaymentMethod] : "Mokėjimo būdas"}
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
                                onClick={() => setSelectedPaymentMethod(key as PaymentMethod)}
                                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                            >
                                {value}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>


                {/* Clear Filters Button */}
                <Button
                    variant="outline"
                    onClick={() => {
                        handleClearFilters();
                        setSelectedPaymentMethod(null);
                        setCityInput("");
                    }}
                    className="w-full border border-gray-300"
                >
                    Išvalyti filtrus
                </Button>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    className="bg-dcoffe hover:bg-vdcoffe text-db border hover:text-gray-50 transition-colors px-8"
                >
                    Ieškoti
                </Button>


            </div>
        </div>
    );
};

export default FiltersSection;