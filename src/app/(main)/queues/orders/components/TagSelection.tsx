"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tags, X } from "lucide-react";
import { TagType } from "@/app/types/orderApi";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { bullTimeConvert } from "@/app/utils/bullTimeConvert";

interface TagSelectionProps {
  selectedTags: TagType[];
  currentTagId: number;
  availableTagsExist: boolean;
  onTagSelect: (tagId: number) => void;
  onTagRemove: (tagId: number) => void;
}

export function TagSelection({
  selectedTags,
  currentTagId,
  availableTagsExist,
  onTagSelect,
  onTagRemove,
}: TagSelectionProps) {
  const { data: tags } = useGetTags();

  return (
    <div className="space-y-3 px-2 py-1">
      <div className="space-y-2">
        <label className="text-sm ml-7 font-medium flex items-center gap-2">
          <Tags className="w-4 h-4" />
          Pasirinkti tagus
        </label>
        <Select
          value={currentTagId ? currentTagId.toString() : ""}
          onValueChange={(value) => onTagSelect(Number(value))}
          disabled={!availableTagsExist}
        >
          <SelectTrigger className="bg-white text-gray-900">
            <SelectValue placeholder="Pasirinkite tagus" />
          </SelectTrigger>
          <SelectContent>
            {availableTagsExist && tags?.data ? (
              tags.data
                .filter(
                  (tag: TagType) => !selectedTags.some((t) => t.id === tag.id)
                )
                .map((tag: TagType) => (
                  <SelectItem
                    key={tag.id}
                    value={tag.id.toString()} 
                    className="font-medium bg-white"
                  >
                    {tag.tagName} - {bullTimeConvert(tag.scheduledFor)}
                  </SelectItem>
                ))
            ) : (
              <SelectItem value="empty" disabled>
                Nėra galimų tagų
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center bg-slate-100 border-2 shadow-md rounded-md px-2 py-1.5 border-blue-50 gap-1 text-sm"
            >
              {tag.tagName} - {bullTimeConvert(tag.scheduledFor)}
              <button
                onClick={() => onTagRemove(Number(tag.id))}
                className="ml-1 bg-red-100 rounded-lg p-0.5 text-red-600 hover:text-red-800"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
