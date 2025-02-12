import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginationComponentProps {
  pagination: PaginationProps;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  pagination,
  onPageChange,
}) => {
  return (
    <div className="py-4 px-6 border-t flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{" "}
        {Math.min(
          pagination.currentPage * pagination.itemsPerPage,
          pagination.totalItems
        )}{" "}
        of {pagination.totalItems} results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
