"use client";
import React, { useEffect, useState } from "react";
import QueueTable from "./components/QueueTable";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, Plus, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueueByStatus } from "../lib/actions/queues/hooks/useQueueByStatus";
import { PaginationState } from "../types/queueApi";
import Link from "next/link";

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
    <div className="min-h-screen mt-[5%] p-6 max-w-6xl flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative bg-white">
          <Search className="absolute left-3 top-3 h-4 w-4  text-gray-400" />
          <Input placeholder="Search..." className="pl-9 w-full" />
        </div>

        {/* Tag Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-300" asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-700"></Tag>
                {selectedTag || "Filter by Tag"}
              </span>

              <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                <ChevronDown className=""></ChevronDown>
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
              <span className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-700"></Filter>
                {statusDisplayNames[currentStatus]}
              </span>

              <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
                <ChevronDown className="h-4 w-4"></ChevronDown>
              </span>
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

        <Link
          href="/queues/create"
          className="bg-dcoffe w-32 border border-gray-200 shadow-sm flex items-center px-2 h-9  rounded-md hover:bg-vdcoffe text-db hover:text-gray-50 transition-colors duration-100"
        >
          <Plus className="h-4 w-4 mr-2"></Plus>
          Sukurti eilė
        </Link>
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
