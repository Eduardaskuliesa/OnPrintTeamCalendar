import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pause, PenSquare, Play, Trash2 } from "lucide-react";

interface ActionMenuProps {
  status: string;
  onPause: () => void;
  onResume: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  status,
  onPause,
  onResume,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="z-[50] ring-0 focus:border-none" asChild>
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-32 bg-white border shadow-lg rounded-lg p-1 z-[10]"
      >
        {(status === "PAUSED" || status === "QUEUED") && (
          <>
            {status === "PAUSED" ? (
              <DropdownMenuItem
                onClick={onResume}
                className="flex hover:text-gray-900 rounded-md items-center gap-2 py-2 px-2 hover:bg-gray-100 cursor-pointer"
              >
                <Play className="h-4 w-4 mr-2" />
                <span>Resume</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={onPause}
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
        <DropdownMenuItem
          onClick={onDelete}
          className="flex hover:text-red-800 rounded-md items-center gap-2 py-2 px-2 focus:bg-red-50 cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
