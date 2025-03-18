import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Power,
  PowerOff,
  Tag,
  Trash2,
} from "lucide-react";
import { TagCardContent } from "./TagCardContent";
import { TagType } from "@/app/types/orderApi";

interface TagCardProps {
  tag: TagType;
  onStatusUpdate: (tagId: number, newStatus: boolean) => void;
  onDelete: (tag: any) => void;
  onUpdate: (tag: TagType) => void;
}

export const TagCard = ({ tag, onStatusUpdate, onDelete, onUpdate }: TagCardProps) => (
  <div className="bg-slate-50 border-blue-50 border-2 rounded-lg shadow-md">
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
      <div className="flex items-center">
        <Tag className="mr-2 h-4 w-4" />
        <div className="font-semibold text-gray-900">{tag.tagName}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md">
          <MoreHorizontal className="w-4 h-4 text-gray-700" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
            onClick={() => onUpdate(tag)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            <span>Atnaujinti</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
            onClick={() => onStatusUpdate(tag.id, !tag.isActive)}
          >
            {tag.isActive ? (
              <PowerOff className="mr-2 h-4 w-4" />
            ) : (
              <Power className="mr-2 h-4 w-4" />
            )}
            <span>{tag.isActive ? "Išjungti" : "Įjungti"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-800 focus:bg-red-50 cursor-pointer"
            onClick={() => onDelete(tag)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Ištrinti</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <TagCardContent tag={tag} />
  </div>
);