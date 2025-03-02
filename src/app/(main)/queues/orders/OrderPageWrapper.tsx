"use client";
import React, { useState } from "react";
import { OrderCard } from "./OrderCard";
import { useGetOrders } from "@/app/lib/actions/orders/hooks/useGetOrders";
import { Order } from "@/app/types/orderApi";
import { OrdersTable } from "./OrderTable";
import { OrdersPagination } from "./OrderPagination";
import { Loader, Loader2 } from "lucide-react";
import FilterSection from "./components/filters/FilterSection";
import { FilterState } from "@/app/types/orderFilter";
import { useFilteredOrders } from "@/app/lib/actions/orders/hooks/useFilteredOrders";
import ActionSection from "./components/ActionSection";
import { useGetAllSalesAgents } from "@/app/lib/actions/salesAgent/hooks/useGetAllSalesAgents";

const defaultFilterState: FilterState = {
  searchTerm: "",
  tagIds: [],
  tagStatuses: [],
  location: null,
  agent: null,
  paymentMethod: null,
  companyName: "",
  product: "",
  dateRange: {
    from: null,
    to: null,
  },
  priceRange: {
    min: "",
    max: "",
  },
  isNot: false,
};

const OrderPageWrapper = () => {
  const [page, setPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const {
    data: unfilteredOrders,
    isLoading: isUnfilteredLoading,
    isFetching: isUnfilteredFetching,
  } = useGetOrders(page, { enabled: !activeFilters });

  console.log(unfilteredOrders);

  const {
    data: filteredOrders,
    isLoading: isFilteredLoading,
    isFetching: isFilteredFetching,
  } = useFilteredOrders(activeFilters || ({} as FilterState), page, {
    enabled: !!activeFilters,
  });

  const { data: salesAgentData } = useGetAllSalesAgents();
  const salesAgents = salesAgentData?.data.salesAgents || [];
  console.log("SalesAgents:", salesAgents);

  const orders = activeFilters ? filteredOrders : unfilteredOrders;
  const isLoading = activeFilters ? isFilteredLoading : isUnfilteredLoading;
  const isFetching = activeFilters ? isFilteredFetching : isUnfilteredFetching;

  const handleFilterSubmit = (filters: FilterState) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders?.data?.items?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(
        orders?.data?.items?.map((order: Order) => order.id) || []
      );
    }
  };

  const handlePageChange = (newPage: number) => {
    const scrollPosition = window.scrollY;
    setSelectedOrders([]);

    setPage(newPage);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "instant",
      });
    });
  };

  const hasOrders = orders?.data?.items && orders.data.items.length > 0;
  const selectedOrdersCount = selectedOrders.length;

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 md:px-4 lg:px-8">
      <div className="mx-auto overflow-anchor-none">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl items-center justify-center flex sm:text-3xl font-bold text-gray-900">
            Orders ({orders?.data?.pagination?.totalItems || 0})
            {isFetching && (
              <Loader className="animate-spin ml-2 text-2xl"></Loader>
            )}
          </h1>
          {selectedOrdersCount > 0 && (
            <p className="text-sm text-gray-600">
              Selected: {selectedOrdersCount}
            </p>
          )}
        </div>
        <FilterSection onSubmit={handleFilterSubmit}></FilterSection>
        <ActionSection
          orders={selectedOrders}
          filters={activeFilters ? activeFilters : defaultFilterState}
          setSelectedOrders={setSelectedOrders}
        />
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="text-vdcoffe animate-spin h-10 w-10"></Loader2>
          </div>
        ) : !hasOrders ? (
          <div className="flex justify-center items-center">
            <p className="text-gray-700 text-lg">Užsakymų nerasta</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white shadow-lg rounded-lg overflow-anchor-none">
              <OrdersTable
                salesAgents={salesAgents}
                orders={orders.data.items}
                selectedOrders={selectedOrders}
                toggleOrderSelection={toggleOrderSelection}
                toggleAllOrders={toggleAllOrders}
              />
            </div>

            <div className="md:hidden space-y-4">
              {orders.data.items.map((order: Order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selectedOrders={selectedOrders}
                  toggleOrderSelection={toggleOrderSelection}
                />
              ))}
            </div>
            <div className="w-auto">
              <OrdersPagination
                page={page}
                setPage={handlePageChange}
                pagination={orders?.data?.pagination}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default OrderPageWrapper;
