"use client";

import React, { useState } from "react";
import { OrderCard } from "./OrderCard";
import { useGetOrders } from "@/app/lib/actions/orders/hooks/useGetOrders";
import { Order } from "@/app/types/orderApi";
import { OrdersTable } from "./OrderTable";
import { OrdersPagination } from "./OrderPagination";
import { Loader2 } from "lucide-react";

const OrderPageWrapper = () => {
  const [page, setPage] = useState(1);
  const { data: orders, isLoading } = useGetOrders(page);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders?.data?.data?.orders?.items.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(
        orders?.data?.data?.orders?.items.map((order: Order) => order.id) || []
      );
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-4 md:px-4 lg:px-8">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Orders ({orders?.data?.data?.orders?.orderCount})
          </h1>
          <button
            onClick={toggleAllOrders}
            className="w-full sm:w-auto px-4 py-2 bg-dcoffe text-white rounded-md hover:bg-vdcoffe transition-colors"
          >
            {selectedOrders.length === orders?.data?.data?.orders?.items.length
              ? "Deselect All"
              : "Select All"}
          </button>
        </div>
        {isLoading ? (
          <div className="flex  justify-center">
            <Loader2 className="text-vdcoffe animate-spin h-10 w-10"></Loader2>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white shadow-lg rounded-lg">
              <OrdersTable
                orders={orders?.data?.data?.orders?.items}
                selectedOrders={selectedOrders}
                toggleOrderSelection={toggleOrderSelection}
                toggleAllOrders={toggleAllOrders}
              />
            </div>

            <div className="md:hidden space-y-4">
              {orders?.data?.data?.orders?.items.map((order: Order) => (
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
                setPage={setPage}
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
