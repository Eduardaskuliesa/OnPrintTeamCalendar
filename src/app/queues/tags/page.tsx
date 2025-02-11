"use client";
import { useState } from "react";
import {
  Timer,
  Mail,
  Pencil,
  Search,
  Plus,
  MoreHorizontal,
  PowerOff,
  Power,
  Trash2,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import QueueStepSkeleton from "./QueueTagSkeleton";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { useGetTags } from "@/app/lib/actions/queuesSteps/hooks/useGetTags";
import { toast } from "react-toastify";

import { useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "@/app/lib/actions/queuesSteps/deleteTag";
import { updateTagstatus } from "@/app/lib/actions/queuesSteps/dissableTag";
import QueueTagButton from "./QueueTagButton";


const formatWaitDuration = (milliseconds: number) => {
  const minutes = milliseconds / (1000 * 60);
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${Math.floor(days)} ${days === 1 ? "diena" : "dienų"}`;
  }
  if (hours >= 1) {
    return `${Math.floor(hours)} ${hours === 1 ? "valanda" : "valandų"}`;
  }
  return `${Math.floor(minutes)} ${minutes === 1 ? "minutė" : "minučių"}`;
};

const Page = () => {
  const { data: tags, isLoading } = useGetTags();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTag, setsSlectedTag] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    try {
      const response = await updateTagstatus(tagId, newStatus);
      if (!response) {
        throw new Error("Failed to update status");
      }
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] });
      toast.success(newStatus ? "Tagas aktyvuotas" : "Tagas išjungtas");
    } catch (error) {
      toast.error("Nepavyko atnaujinti tago būsenos");
      console.error("Update status error:", error);
    }
  };

  const filteredTags = tags?.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(tags)

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Žingsniai</h1>

        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Ieškoti..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48 bg-white"
            />
          </div>
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
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <QueueStepSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags?.map((tag) => (
            <div
              key={tag.tagId}
              className="bg-slate-50 border-blue-50 border-2 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-300">
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4"></Tag>
                  <div className="font-semibold text-gray-900">{tag.tagName}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md">
                    <MoreHorizontal className="w-4 h-4 text-gray-700" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer">
                      <Pencil className="h-4 w-4 mr-2" />
                      <span>Atnaujinti</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
                      onClick={() =>
                        handleStatusUpdate(tag.tagId, !tag.isActive)
                      }
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
                      onClick={() => {
                        setsSlectedTag(tag);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      <span>Ištrinti</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700 mt-4">
                      <Timer className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatWaitDuration(tag.waitDuration)} laukimas
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {tag.actionConfig.template}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900">
                        {tag.jobCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        paveiktos eilės
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      {tag.isActive ? (
                        <span className="text-emerald-600 text-center">
                          Aktyvus
                        </span>
                      ) : (
                        <span className="text-red-600">Išjungtas</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            Ar tikrai norite ištrinti <strong>{selectedTag?.tag}</strong>{" "}
            tagą?
          </>
        }
      />
    </div>
  );
};

export default Page;
