"use client";
import { useState } from "react";
import {
  Timer,
  Mail,
  Pencil,
  Search,
  Plus,
  MoreHorizontal,
  BookType,
  PowerOff,
  Power,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import QueueStepButton from "./QueueStepButton";
import QueueStepSkeleton from "./QueueStepSkeleton";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { useGetSteps } from "@/app/lib/actions/queuesSteps/hooks/useGetSteps";
import { toast } from "react-toastify";
import { deleteStep } from "@/app/lib/actions/queuesSteps/deleteStep";
import { useQueryClient } from "@tanstack/react-query";
import { updateStepStatus } from "@/app/lib/actions/queuesSteps/dissableStep";

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
  const { data: steps, isLoading } = useGetSteps();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!selectedStep) return;

    setLoading(true);
    try {
      const response = await deleteStep(selectedStep.stepId);

      if (!response) {
        throw new Error("Failed to delete step");
      }

      toast.success(response.message);
      await queryClient.invalidateQueries({ queryKey: ["all-steps"] });
    } catch (error) {
      toast.error("Nepavyko ištrinti žingsnio");
      console.error("Delete step error:", error);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setSelectedStep(null);
    }
  };

  const handleStatusUpdate = async (stepId: string, newStatus: boolean) => {
    try {
      const response = await updateStepStatus(stepId, newStatus);
      if (!response) {
        throw new Error("Failed to update status");
      }
      await queryClient.invalidateQueries({ queryKey: ["all-steps"] });
      toast.success(newStatus ? "Žingsnis aktyvuotas" : "Žingsnis išjungtas");
    } catch (error) {
      toast.error("Nepavyko atnaujinti žingsnio būsenos");
      console.error("Update status error:", error);
    }
  };

  const filteredSteps = steps?.filter((step) =>
    step.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <QueueStepButton
            buttonClassName="flex group items-center gap-2 px-4 py-2 bg-dcoffe hover:bg-vdcoffe rounded-md transition-colors whitespace-nowrap"
            iconClassName="w-4 h-4 text-db group-hover:text-gray-50"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-db group-hover:text-gray-50" />
              <span className="text-sm text-db group-hover:text-gray-50">
                Pridėti žingsnį
              </span>
            </span>
          </QueueStepButton>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <QueueStepSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSteps?.map((step) => (
            <div
              key={step.stepId}
              className="bg-slate-50 border-blue-50 border-2 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <div>
                  <div className="font-semibold text-gray-900">{step.tag}</div>
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
                        handleStatusUpdate(step.stepId, !step.isActive)
                      }
                    >
                      {step.isActive ? (
                        <PowerOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Power className="mr-2 h-4 w-4" />
                      )}
                      <span>{step.isActive ? "Išjungti" : "Įjungti"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-800 focus:bg-red-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStep(step);
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
                    <div className="flex items-center text-gray-700">
                      <Timer className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {formatWaitDuration(step.waitDuration)} laukimas
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <BookType className="w-4 h-4 mr-2" />
                      <span className="text-sm">{step.actionType}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {step.actionConfig.template}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-right">
                      <div className="text-xl font-semibold text-gray-900">
                        {step.jobCount}
                      </div>
                      <div className="text-sm text-gray-600">
                        paveiktos eilės
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      {step.isActive ? (
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
            Ar tikrai norite ištrinti <strong>{selectedStep?.tag}</strong>{" "}
            žingsnį?
          </>
        }
      />
    </div>
  );
};

export default Page;
