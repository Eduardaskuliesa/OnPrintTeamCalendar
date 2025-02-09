import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";
import React from "react";

const LoadingRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell className="py-2">
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-6 w-[100px]" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-6 w-[100px]" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell className="py-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
      </TableCell>
    </TableRow>
  );
};

export default LoadingRowSkeleton;
