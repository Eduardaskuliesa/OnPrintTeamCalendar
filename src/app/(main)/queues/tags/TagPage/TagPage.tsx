import { deleteTag } from '@/app/lib/actions/queuesTags/deleteTag';
import { updateTagStatus } from '@/app/lib/actions/queuesTags/dissableTag';
import { useGetTags } from '@/app/lib/actions/queuesTags/hooks/useGetTags';
import { TagType } from '@/app/types/orderApi';
import ConfirmModal from '@/app/ui/ConfirmModal';
import DeleteConfirmation from '@/app/ui/DeleteConfirmation';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { TagCard } from './TagCard';
import { PageHeader } from '../PageHeader';
import QueueStepSkeleton from './QueueTagSkeleton';
import { Plus } from 'lucide-react';
import QueueTagButton from '../QueueTagButton';

const TagPage = () => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedTag, setsSlectedTag] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loadingTags, setLoadingTags] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [statusChangeInfo, setStatusChangeInfo] = useState<{
        tagId: number;
        newStatus: boolean;
    } | null>(null);
    const queryClient = useQueryClient();
    const { data: tags, isLoading, isFetching } = useGetTags();

    const handleDelete = async () => {
        if (!selectedTag) return;

        setLoading(true);
        try {
            const response = await deleteTag(selectedTag.id);

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

    const handleStatusUpdate = async (tagId: number, newStatus: boolean) => {
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

    const filteredTags =
        tags?.data?.filter((tag: TagType) =>
            tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

    return (
        <>
            <PageHeader headerName='Tagai' isFetching={isFetching} searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <QueueTagButton
                    buttonClassName="flex group items-center gap-2 px-4 py-2 bg-dcoffe hover:bg-vdcoffe rounded-md transition-colors whitespace-nowrap"
                    iconClassName="w-4 h-4 text-db group-hover:text-gray-50"
                >
                    <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-db group-hover:text-gray-50" />
                        <span className="text-sm text-db group-hover:text-gray-50">
                            Pridėti tagą
                        </span>
                    </span>
                </QueueTagButton>
            </PageHeader>

            {isLoading ? (
                <QueueStepSkeleton />
            ) : filteredTags.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTags.map((tag: TagType) => (
                        <TagCard
                            key={tag.id}
                            tag={tag}
                            onStatusUpdate={handleStatusUpdate}
                            onDelete={(tag) => {
                                setsSlectedTag(tag);
                                setShowDeleteDialog(true);
                            }}
                            loadingTags={loadingTags}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">Nėra tagų</p>
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
        </>
    );
}

export default TagPage;