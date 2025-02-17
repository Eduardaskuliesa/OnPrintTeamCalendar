import { PaginationInfo } from "@/app/types/queueApi";
import React from "react";

interface OrdersPaginationProps {
  page: number;
  setPage: (page: number) => void;
  pagination: PaginationInfo | undefined;
}

export const OrdersPagination: React.FC<OrdersPaginationProps> = ({
  page,
  setPage,
  pagination,
}) => {
  if (!pagination) return null;

  return (
    <div className="flex flex-col sm:flex-row  items-center gap-4 mt-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={!pagination.hasPreviousPage}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {page} of {pagination.totalPages}
      </span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={!pagination.hasNextPage}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        Next
      </button>
    </div>
  );
};
