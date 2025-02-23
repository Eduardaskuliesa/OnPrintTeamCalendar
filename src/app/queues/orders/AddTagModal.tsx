import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tag as TagIcon, Clock, Loader2 } from "lucide-react";
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
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const { data: tags, isLoading: isTagsLoading } = useGetTags();
  const queryClient = useQueryClient();

  const handleAddTags = async () => {
    if (selectedTags.length === 0) return;

    try {
      setIsLoadingTags(true);
      await ordersActions.addTagsToOrders({
        tagIds: selectedTags,
        orderIds: [order.id],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      setSelectedTags([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Žymų pridėjimas nepavyko", error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const toggleTagSelection = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isTagsLoading ? (
            <div className="col-span-full flex justify-center items-center">
              <Loader2 className="mr-2 h-8 w-8 animate-spin" />
              <span>Kraunama...</span>
            </div>
          ) : tags?.data.filter((tag: TagType) => tag.isActive).length > 0 ? (
            tags.data
              .filter((tag: TagType) => tag.isActive)
              .map((tag: TagType) => (
                <div
                  key={tag.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg"
                >
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id)}
                  />
                  <Label
                    htmlFor={`tag-${tag.id}`}
                    className="flex-grow cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tag.tagName}</span>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {bullTimeConvert(tag.scheduledFor)}
                      </div>
                    </div>
                  </Label>
                </div>
              ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              Nėra galimų žymų
            </div>
          )}
        </div>

        <DialogFooter>
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
            {isLoadingTags
              ? "Pridedama..."
              : `Pridėti žymą (${selectedTags.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
