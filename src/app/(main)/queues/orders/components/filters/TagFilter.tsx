import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag as TagIcon, ChevronDown, Loader } from "lucide-react";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { TagType } from "@/app/types/orderApi";
import { Checkbox } from "@/components/ui/checkbox";

interface TagFilterProps {
  selectedTags: number[];
  onChange: (tagIds: number[]) => void;
  onClear: () => void;
}

export const TagFilter = ({
  selectedTags,
  onChange,
  onClear,
}: TagFilterProps) => {
  const { data: tagsData, isLoading } = useGetTags();
  console.log(tagsData);

  const tags = Array.isArray(tagsData)
    ? tagsData
    : tagsData?.data && Array.isArray(tagsData.data)
    ? tagsData.data
    : [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border border-gray-300" asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center truncate">
            <TagIcon className="h-4 w-4 mr-2 text-gray-700" />
            {selectedTags.length > 0
              ? `Pasirinkta ${selectedTags.length} tagai`
              : "Tagas"}
          </span>
          <span className="bg-gray-200 p-0.5 ml-2 rounded-sm">
            <ChevronDown className="h-4 w-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 max-h-[300px] custom-scrollbar overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex justify-center p-2">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <>
            {tags.map((tag: TagType) => (
              <DropdownMenuItem
                key={tag.id}
                onSelect={(e) => {
                  e.preventDefault();
                  const newSelected = selectedTags.includes(tag.id)
                    ? selectedTags.filter((id) => id !== tag.id)
                    : [...selectedTags, tag.id];
                  onChange(newSelected);
                }}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <Checkbox checked={selectedTags.includes(tag.id)} />
                {tag.tagName}
              </DropdownMenuItem>
            ))}
            {selectedTags.length > 0 && (
              <DropdownMenuItem
                onClick={onClear}
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer text-gray-500"
              >
                Išvalyti
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
