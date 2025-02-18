"use client"
import { FilterState } from '@/app/types/orderFilter';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AgentFilter } from './AgentFilter';
import { CompanyFilter } from './CompanyFilter';
import { DateRangeFilter } from './DateRangleFilter';
import { LocationFilter } from './LocationFilter';
import { PaymentMethodFilter } from './PaymentMethodFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { SearchFilter } from './SearchFilterProps';
import { TagFilter } from './TagFilter';
import { TagStatusFilter } from './TagStatusFilter';
import { ProductFilter } from './ProductFilter';
import { Search, X } from 'lucide-react';

const FilterSection = () => {
    const [filters, setFilters] = useState<FilterState>({
        tag: null,
        tagStatus: null,
        location: null,
        searchTerm: "",
        agent: null,
        paymentMethod: null,
        companyName: "",
        product: null,
        dateRange: { from: null, to: null },
        priceRange: { min: "", max: "" }
    });

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            searchTerm: "",
            tag: null,
            tagStatus: null,
            location: null,
            agent: null,
            paymentMethod: null,
            companyName: "",
            product: null,
            dateRange: { from: null, to: null },
            priceRange: { min: "", max: "" }
        });
    };

    const handleSubmit = () => {
        console.log('Applied filters:', filters);
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Replace grid with flex container */}
            <div className="flex flex-wrap gap-4">
                <div className="flex-[1_1_300px] max-w-[250px]">
                    <SearchFilter
                        value={filters.searchTerm}
                        onChange={(value) => handleFilterChange('searchTerm', value)}
                        onClear={() => handleFilterChange('searchTerm', '')}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <CompanyFilter
                        value={filters.companyName}
                        onChange={(value) => handleFilterChange('companyName', value)}
                        onClear={() => handleFilterChange('companyName', '')}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <LocationFilter
                        value={filters.location}
                        onChange={(value) => handleFilterChange('location', value)}
                        onClear={() => handleFilterChange('location', null)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <TagFilter
                        value={filters.tag}
                        onChange={(value) => handleFilterChange('tag', value)}
                        onClear={() => handleFilterChange('tag', null)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <TagStatusFilter
                        value={filters.tagStatus}
                        onChange={(value) => handleFilterChange('tagStatus', value)}
                        onClear={() => handleFilterChange('tagStatus', null)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <AgentFilter
                        value={filters.agent}
                        onChange={(value) => handleFilterChange('agent', value)}
                        onClear={() => handleFilterChange('agent', null)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <ProductFilter
                        value={filters.product}
                        onChange={(value) => handleFilterChange('product', value)}
                        onClear={() => handleFilterChange('product', null)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <DateRangeFilter
                        value={filters.dateRange}
                        onChange={(value) => handleFilterChange('dateRange', value)}
                        onClear={() => handleFilterChange('dateRange', { from: null, to: null })}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <PriceRangeFilter
                        value={filters.priceRange}
                        onChange={(value) => handleFilterChange('priceRange', value)}
                    />
                </div>

                <div className="flex-[1_1_300px] max-w-[250px]">
                    <PaymentMethodFilter
                        value={filters.paymentMethod}
                        onChange={(value) => handleFilterChange('paymentMethod', value)}
                        onClear={() => handleFilterChange('paymentMethod', null)}
                    />
                </div>
            </div>

            <div className='flex gap-4'>
                <Button
                    onClick={handleSubmit}
                    className="bg-dcoffe hover:bg-vdcoffe text-db border hover:text-gray-50 transition-colors px-8 flex items-center gap-2"
                >
                    <Search className="h-4 w-4" />
                    Ieškoti
                </Button>
                <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border border-gray-300 flex items-center gap-2"
                >
                    <X className="h-4 w-4" />
                    Išvalyti filtrus
                </Button>
            </div>
        </div>
    );
};

export default FilterSection;