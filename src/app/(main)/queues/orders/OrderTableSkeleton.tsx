import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

export const TableLoadingSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <React.Fragment key={index}>
          <TableRow className="border-t border-b border-gray-200">
            <TableCell className="py-4" rowSpan={2}>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="flex flex-col gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="py-4 border-x">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
            <TableCell className="py-4" rowSpan={2}>
              <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
            </TableCell>
          </TableRow>
          <TableRow className="bg-gray-50 border-b">
            <TableCell className="py-2 text-xs border-x">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell className="py-2 text-xs border-x">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </TableCell>
          </TableRow>
          {index < 4 && (
            <TableRow>
              <TableCell colSpan={7} className="h-4 bg-[#fefaf6]" />
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
