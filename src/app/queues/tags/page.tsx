"use client";
import { useState } from "react";
import QueueStepSkeleton from "./QueueTagSkeleton";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "@/app/lib/actions/queuesTags/deleteTag";
import { updateTagStatus } from "@/app/lib/actions/queuesTags/dissableTag";
import ConfirmModal from "@/app/ui/ConfirmModal";
import { TagsHeader } from "./TagHeader";
import { TagCard } from "./TagCard";
import { Tag } from "@/app/types/queueApi";

const Page = () => {
  const { data: tags, isLoading } = useGetTags();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTag, setsSlectedTag] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusChangeInfo, setStatusChangeInfo] = useState<{
    tagId: string;
    newStatus: boolean;
  } | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!selectedTag) return;

    setLoading(true);
    try {
      const response = await deleteTag(selectedTag.tagId);

      if (!response) {
        throw new Error("Failed to delete tag");
      }

      toast.success(response.message);
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] });
    } catch (error) {
      toast.error("Nepavyko ištrinti tago");
      console.error("Delete tag error:", error);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setsSlectedTag(null);
    }
  };

  const handleStatusUpdate = async (tagId: string, newStatus: boolean) => {
    setStatusChangeInfo({ tagId, newStatus });
    setShowStatusDialog(true);
  };

  const confirmStatusUpdate = async () => {
    if (!statusChangeInfo) return;

    const { tagId, newStatus } = statusChangeInfo;
    setLoadingTags((prev) => ({ ...prev, [tagId]: true }));

    try {
      const response = await updateTagStatus(tagId, newStatus);
      if (!response.success) {
        toast.error("Nepavyko atnaujinti tago būsenos");
        return;
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["all-tags"] }),
        queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] }),
        queryClient.invalidateQueries({ queryKey: ["queue", "paused"] }),
      ]);
      toast.success(newStatus ? "Tagas aktyvuotas" : "Tagas išjungtas");
    } catch (error) {
      toast.error("Nepavyko atnaujinti tago būsenos");
      console.error("Update status error:", error);
    } finally {
      setLoadingTags((prev) => ({ ...prev, [tagId]: false }));
      setShowStatusDialog(false);
      setStatusChangeInfo(null);
    }
  };

  const filteredTags = tags?.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl">
      <TagsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {isLoading ? (
        <QueueStepSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags?.map((tag) => (
            <TagCard
              key={tag.tagId}
              tag={tag as Tag}
              onStatusUpdate={handleStatusUpdate}
              onDelete={(tag) => {
                setsSlectedTag(tag);
                setShowDeleteDialog(true);
              }}
              loadingTags={loadingTags}
            />
          ))}
        </div>
      )}

      <DeleteConfirmation
        loading={loading}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        message={
          <>
            Ar tikrai norite ištrinti <strong>{selectedTag?.tag}</strong> tagą?
          </>
        }
      />
      <ConfirmModal
        isOpen={showStatusDialog}
        onClose={() => {
          setShowStatusDialog(false);
          setStatusChangeInfo(null);
        }}
        onConfirm={confirmStatusUpdate}
        loading={statusChangeInfo ? loadingTags[statusChangeInfo.tagId] : false}
        message={
          statusChangeInfo?.newStatus
            ? "Visos eilės kurios dabar yra sustabdytos ir paveiktos šio tago bus aktyvuotos, ar patvirtinate savo veiksmą?"
            : "Visos eilės kurios dabar yra aktyvios ir paveiktos šio tago bus sustabdytos, ar patvirtinate savo veiksmą?"
        }
      />
    </div>
  );
};

export default Page;
