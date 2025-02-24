import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, Loader2, X } from "lucide-react";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { ordersActions } from "@/app/lib/actions/orders";
import { useQueryClient } from "@tanstack/react-query";
import { Order, TagType } from "@/app/types/orderApi";
import { bullTimeConvert } from "@/app/utils/bullTimeConvert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddTagModalProps {
  order: Order;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTagModal: React.FC<AddTagModalProps> = ({
  order,
  isOpen,
  onOpenChange,
}) => {
  const [selectedTags, setSelectedTags] = useState<TagType[]>([]);
  const [currentTagId, setCurrentTagId] = useState<string>("");
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const { data: tags, isLoading: isTagsLoading } = useGetTags();
  const queryClient = useQueryClient();

  const handleAddTags = async () => {
    if (selectedTags.length === 0) return;
    setIsLoadingTags(true);
    try {

      await ordersActions.addTagsToOrders({
        tagIds: selectedTags.map((tag) => tag.id),
        orderIds: [order.id],
      });

      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedTags([]);
      setIsLoadingTags(false);
      onOpenChange(false);

    } catch (error) {
      console.error("Žymų pridėjimas nepavyko", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleTagSelect = (tagId: string) => {
    const selectedTag = tags?.data.find(
      (tag: TagType) => tag.id.toString() === tagId
    );
    if (selectedTag && !selectedTags.some((t) => t.id === selectedTag.id)) {
      setSelectedTags((prev) => [...prev, selectedTag]);
      setCurrentTagId("");
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };
  const availableTagsExist =
    tags &&
    tags.data.filter(
      (tag: TagType) =>
        tag.isActive &&
        !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
    ).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[600px] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <TagIcon className="mr-2 h-5 w-5" /> Pridėti tagus
          </DialogTitle>
          <DialogDescription>
            Pasirinkite tagus, kurios norite pridėti prie šio užsakymo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              Pasirinkite tagus
            </label>
            <Select
              value={currentTagId}
              onValueChange={handleTagSelect}
              disabled={isTagsLoading || !availableTagsExist}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Pasirinkite tagus" />
              </SelectTrigger>
              <SelectContent>
                {isTagsLoading ? (
                  <SelectItem className="bg-white" value="loading" disabled>
                    Kraunama...
                  </SelectItem>
                ) : availableTagsExist ? (
                  tags.data
                    .filter(
                      (tag: TagType) =>
                        tag.isActive &&
                        !selectedTags.some((t) => t.id === tag.id)
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
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center bg-slate-100 border-2 shadow-md rounded-md px-2 py-2 border-blue-50 gap-1 text-sm"
                >
                  {tag.tagName} - {bullTimeConvert(tag.scheduledFor)}
                  <button
                    onClick={() => removeTag(tag.id)}
                    className="ml-1 bg-red-100 rounded-lg p-0.5 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoadingTags}
          >
            Atšaukti
          </Button>
          <Button
            className="bg-dcoffe text-db hover:bg-vdcoffe hover:text-gray-100 transition-colors"
            onClick={handleAddTags}
            disabled={selectedTags.length === 0 || isLoadingTags}
          >
            {isLoadingTags ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Pridedama...
              </>
            ) : (
              `Pridėti žymą (${selectedTags.length})`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
