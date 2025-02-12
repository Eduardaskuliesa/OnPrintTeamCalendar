import { QueueItem } from "@/app/types/queueApi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Pause, Play, Settings2, Trash2 } from "lucide-react";

export const BatchActionsButton: React.FC<{
  selectedItems: string[];
  onDelete: () => void;
  items: QueueItem[];
}> = ({ selectedItems, onDelete, items }) => {
  const selectedItemsData = items.filter((item) =>
    selectedItems.includes(item.jobId)
  );

  const hasQueuedItems = selectedItemsData.some(
    (item) => item.status === "QUEUED"
  );
  const hasPausedItems = selectedItemsData.some(
    (item) => item.status === "PAUSED"
  );

  return (
    <div className="flex  items-center">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-white text-sm  border border-gray-300 h-9 focus:ring-0 outline-none"
              size="sm"
            >
              <Settings2 className="h-4 w-4 mr-2 text-gray-700" />
              Actions
              <span className="text-sm text-gray-600">
                {selectedItems.length} items selected
              </span>
              <span className="bg-gray-200 p-0.5 ml-4 rounded-sm">
                <ChevronDown className=""></ChevronDown>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {hasQueuedItems && (
              <DropdownMenuItem className="flex items-center hover:cursor-pointer">
                <Pause className="h-4 w-4 mr-2" />
                <span>Pause Selected</span>
              </DropdownMenuItem>
            )}
            {hasPausedItems && (
              <DropdownMenuItem className="flex items-center hover:cursor-pointer">
                <Play className="h-4 w-4 mr-2" />
                <span>Resume Selected</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={onDelete}
              className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50 hover:cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Delete Selected</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
