"use client";
import React, { useEffect, useState } from "react";
import QueueTable from "./components/QueueTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueueByStatus } from "../lib/actions/queues/hooks/useQueueByStatus";
import { PaginationState } from "../types/queueApi";

// Define BullMQ status types
type BullMQStatus = "delayed" | "active" | "completed" | "failed" | "paused";
type Tag = "EMAIL" | "NOTIFICATION" | "REMINDER";

const statusDisplayNames: Record<BullMQStatus, string> = {
  delayed: "Aktyvūs",
  active: "Siunčiama",
  completed: "Išsiųsti",
  failed: "Nepavykę",
  paused: "Sustabdyti",
};

const tags: Tag[] = ["EMAIL", "NOTIFICATION", "REMINDER"];
const queueStatuses: BullMQStatus[] = [
  "delayed",
  "active",
  "completed",
  "failed",
  "paused",
];

const QueuePageWrapper = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [currentStatus, setCurrentStatus] = useState<BullMQStatus>("delayed");
  const [paginationState, setPaginationState] = useState<PaginationState>({
    keys: {},
    currentPage: 1,
  });

  const { data, isLoading } = useQueueByStatus(
    currentStatus,
    paginationState.currentPage,
    paginationState.keys[paginationState.currentPage - 1]
  );

  useEffect(() => {
    if (data?.lastEvaluatedKey) {
      setPaginationState((prev) => ({
        ...prev,
        keys: {
          ...prev.keys,
          [prev.currentPage]: data.lastEvaluatedKey,
        },
      }));
    }
  }, [data?.lastEvaluatedKey]);

  const handleStatusChange = (newStatus: BullMQStatus) => {
    setCurrentStatus(newStatus);
    setPaginationState({
      keys: {},
      currentPage: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    // Can only go forward one page at a time or backwards to any previous page
    if (
      newPage > paginationState.currentPage &&
      !paginationState.keys[paginationState.currentPage]
    ) {
      return;
    }

    setPaginationState((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  return (
    <div className="min-h-screen mt-[5%] p-6 max-w-6xl flex flex-col space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative bg-white">
          <Search className="absolute left-3 top-3 h-4 w-4  text-gray-400" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        {/* Tag Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-300" asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedTag || "Filter by Tag"}
              <ChevronDown className="h-4 w-4 ml-2" />
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
            <DropdownMenuItem
              onClick={() => setSelectedTag(null)}
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
            >
              Clear filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Queue Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="border-gray-300" asChild>
            <Button variant="outline" className="w-full justify-between">
              {statusDisplayNames[currentStatus]}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-white" align="start">
            {queueStatuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusChange(status)}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
              >
                {statusDisplayNames[status]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <QueueTable
        isLoading={isLoading}
        items={data?.data.dynamo.items ?? []}
        pagination={{
          currentPage: paginationState.currentPage,
          totalPages: data?.pagination.totalPages ?? 1,
          itemsPerPage: data?.pagination.itemsPerPage ?? 20,
          totalItems: data?.pagination.totalItems ?? 0,
          hasNextPage: !!data?.lastEvaluatedKey,
          hasPreviousPage: paginationState.currentPage > 1,
        }}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default QueuePageWrapper;
