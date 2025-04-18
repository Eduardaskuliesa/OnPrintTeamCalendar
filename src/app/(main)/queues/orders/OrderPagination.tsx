import React from "react";
import { PaginationInfo } from "@/app/types/queueApi";
import { Button } from "@/components/ui/button";

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

  const totalPages = pagination.totalPages || 1;
  const visiblePages = [];
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(startPage + 2, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  if (endPage < totalPages && !visiblePages.includes(totalPages)) {
    visiblePages.push("...");
    visiblePages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={!pagination.hasPreviousPage}
        className="px-4 h-10 rounded-lg text-sm border bg-white hover:bg-slate-50 border-gray-300 disabled:bg-gray-50 disabled:text-gray-300"
      >
        Previous
      </button>

      {visiblePages.map((pageNum, index) =>
        pageNum === "..." ? (
          <span
            key={`dots-${index}`}
            className="w-10 h-10 flex items-end justify-center"
          >
            ···
          </span>
        ) : (
          <Button
            variant="outline"
            key={pageNum}
            onClick={() => setPage(pageNum as number)}
            className={`w-10 h-10 rounded-lg text-sm ${
              page === pageNum
                ? "bg-dcoffe text-db hover:bg-vdcoffe hover:text-gray-50"
                : "border border-gray-300 bg-white hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </Button>
        )
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={!pagination.hasNextPage}
        className="px-4 h-10 rounded-lg text-sm border bg-white border-gray-300 hover:bg-slate-50 disabled:bg-gray-50 disabled:text-gray-300"
      >
        Next
      </button>
    </nav>
  );
};
