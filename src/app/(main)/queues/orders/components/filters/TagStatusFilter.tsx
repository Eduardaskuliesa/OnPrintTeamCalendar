import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TagStatus } from "@/app/types/orderFilter";

interface TagStatusFilterProps {
  selectedTagStatuses: TagStatus[];
  onChange: (value: TagStatus[]) => void;
  onClear: () => void;
}

const tagStatuses: Record<TagStatus, string> = {
  QUEUED: "Laukiama",
  PENDING: "Vykdomas",
  SENT: "Išsiųstas",
  FAILED: "Klaida",
  INACTIVE: "Atšauktas",
  PAUSED: "Sustabdytas",
};


const statusColors: Record<TagStatus, string> = {
  QUEUED: "border-yellow-600",
  PENDING: "border-orange-600",
  SENT: "border-green-600",
  FAILED: "border-red-600",
  INACTIVE: "border-gray-600",
  PAUSED: "border-blue-600",
};

export const TagStatusFilter = ({
  selectedTagStatuses,
  onChange,
  onClear,
}: TagStatusFilterProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border border-gray-300" asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center truncate">
            <Filter className="h-4 w-4 mr-2 text-gray-700" />
            {selectedTagStatuses.length > 0
              ? `Pasirinkta ${selectedTagStatuses.length} statusao`
              : "Tago statusas"}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 flex gap-2 flex-col bg-white" align="start">
        {Object.entries(tagStatuses).map(([key, value]) => {
          const status = key as TagStatus;
          const colorClass = statusColors[status];

          return (
            <DropdownMenuItem
              key={key}
              onSelect={(e) => {
                e.preventDefault();
                const newSelected = selectedTagStatuses.includes(status)
                  ? selectedTagStatuses.filter((s) => s !== status)
                  : [...selectedTagStatuses, status];
                onChange(newSelected);
              }}
              className={`py-2 px-2 hover:bg-gray-100 rounded-none cursor-pointer flex items-center gap-2 border-l-4 ${colorClass}`}
            >
              <Checkbox
                checked={selectedTagStatuses.includes(status)}
              />
              {value}
            </DropdownMenuItem>
          );
        })}
        {selectedTagStatuses.length > 0 && (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onClear();
            }}
            className="py-2 px-2 hover:bg-gray-100 cursor-pointer text-gray-500"
          >
            Išvalyti
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};