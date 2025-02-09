"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MoreHorizontal,
  Pause,
  PenSquare,
  Play,
  Settings2,
  Tag,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoadingRowSkeleton from "./LoadingRowSkeleton";
import { queueActions } from "@/app/lib/actions/queues";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QueueItem {
  jobId: string;
  tag: "EMAIL" | "NOTIFICATION" | "REMINDER";
  createdAt: string;
  scheduledFor: number;
  status: string;
  email: string;
  payload: {
    message: string;
  };
  attempts: number;
  updatedAt: string;
}

interface QueueTableProps {
  items: QueueItem[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
}

const statusDisplayNames: Record<string, string> = {
  QUEUED: "Aktyvūs",
  ACTIVE: "Siunčiama",
  SENT: "Išsiųsti",
  FAILED: "Nepavykę",
  PAUSED: "Sustabdyti",
};

const QueueTable: React.FC<QueueTableProps> = ({
  items,
  pagination,
  onPageChange,
  isLoading,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const handleSelectAll = (checked: boolean) => {
    if (items.length === 0) {
      setSelectedItems([]);
      return;
    }

    if (checked) {
      setSelectedItems(items.map((item) => item.jobId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePauseItem = async (id: string) => {
    const response = await queueActions.pauseQueue(id);
    console.log(response);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      queryClient.invalidateQueries({ queryKey: ["queue", "paused"] });
      toast.success("Eilė sustabdyta");
    }
    if (!response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      toast.error("Eilė nebe aktyvį");
    }
  };

  const handleResumeItem = async (id: string) => {
    const response = await queueActions.resumeQueue(id);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      queryClient.invalidateQueries({ queryKey: ["queue", "paused"] });
      toast.success("Eilė įjungta");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "queued":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "paused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateScheduledTime = (createdAt: string, scheduledFor: number) => {
    const createdDate = new Date(createdAt);
    const scheduledDate = new Date(createdDate.getTime() + scheduledFor);
    return scheduledDate.toLocaleString();
  };

  const getStatusDisplay = (status: string): string => {
    return statusDisplayNames[status.toUpperCase()] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow flex flex-col">
      <Table className=" h-full">
        <TableHeader className="bg-lcoffe sticky top-0 z-10 ">
          <TableRow className="rounded-md">
            <TableHead className="w-12 py-3 px-4 rounded-tl-lg">
              <Checkbox
                checked={selectedItems.length === items.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="py-3 px-4 border-x">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Created At
              </div>
            </TableHead>
            <TableHead className="py-3 border-x px-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </div>
            </TableHead>
            <TableHead className="py-3 border-x px-4">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tag
              </div>
            </TableHead>
            <TableHead className="py-3 border-x px-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Status
              </div>
            </TableHead>
            <TableHead className="py-3 border-x px-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled For
              </div>
            </TableHead>
            <TableHead className="w-12 py-3 px-4 rounded-tr-lg">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Actions
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <LoadingRowSkeleton key={`loading-${index}`} />
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-14 text-center text-gray-500">
                Nėra jokių įrašų
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.jobId} className="border-b hover:bg-gray-50">
                <TableCell className="py-2">
                  <Checkbox
                    checked={selectedItems.includes(item.jobId)}
                    onCheckedChange={() => handleSelectItem(item.jobId)}
                  />
                </TableCell>
                <TableCell className="py-2">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="py-2">{item.email}</TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className="font-medium">
                    {item.tag}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(item.status)} font-medium`}
                  >
                    {getStatusDisplay(item.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-2">
                  {calculateScheduledTime(item.updatedAt, item.scheduledFor)}
                </TableCell>
                <TableCell className="py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="z-[50] ring-0 focus:border-none"
                      asChild
                    >
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-32 bg-white border shadow-lg rounded-lg p-1 z-[10]"
                    >
                      {(item.status === "PAUSED" ||
                        item.status === "QUEUED") && (
                        <>
                          {item.status === "PAUSED" ? (
                            <DropdownMenuItem
                              onClick={() => handleResumeItem(item.jobId)}
                              className="flex hover:text-gray-900 rounded-md items-center gap-2 py-2 px-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              <span>Resume</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePauseItem(item.jobId)}
                              className="flex hover:text-gray-900 rounded-md items-center gap-2 py-2 px-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              <span>Pause</span>
                            </DropdownMenuItem>
                          )}
                        </>
                      )}

                      <DropdownMenuItem className="flex hover:text-gray-900 rounded-md items-center gap-2 py-2 px-2 hover:bg-gray-100 cursor-pointer">
                        <PenSquare className="h-4 w-4 mr-2" />
                        <span>Update</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex hover:text-red-800 rounded-md items-center gap-2 py-2 px-2 hover:bg-red-50 cursor-pointer text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="py-4 px-6 border-t flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
          to{" "}
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
    </div>
  );
};

export default QueueTable;
