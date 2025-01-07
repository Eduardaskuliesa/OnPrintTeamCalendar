"use client";
import { useState, useRef, FormEvent } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkRecord } from "@/app/types/api";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { useCreateWorkRecord } from "../lib/actions/workrecords/hooks";
import { TypeReasonInput } from "./TypeReasonInputProps";
import { HoursDateInput } from "./HoursDateInput";

interface WorkRecordFormProps {
  userId: string;
  onRecordCreated: (newRecord: WorkRecord) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export interface WorkRecordFormData {
  type: "overtime" | "absence" | "vacation";
  hours: number;
  reason: string;
  date: string;
  yearMonth: string;
}

export default function WorkRecordForm({
  userId,
  onRecordCreated,
  onCancel,
  isOpen,
}: WorkRecordFormProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: createRecord } = useCreateWorkRecord();

  const [formData, setFormData] = useState<WorkRecordFormData>({
    type: "overtime",
    hours: 0,
    reason: "",
    date: new Date().toISOString().split("T")[0],
    yearMonth: new Date().toISOString().split("T")[0].slice(0, 7),
  });

  async function handleSubmit(e: FormEvent<Element>) {
    e.preventDefault();
    try {
      setLoading(true);

      const workRecord = {
        ...formData,
        userId,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      createRecord(workRecord, {
        onSuccess: () => {
          onRecordCreated(workRecord as WorkRecord);
          toast.success("Record successfully created");
        },
        onError: (error) => {
          toast.error("Failed to create record");
          console.error(error);
        },
      });
    } catch (error: any) {
      toast.error("Error creating record");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardShortcuts(isOpen, onCancel, undefined, formRef);

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">New Work Record</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-3 min-w-[250px] sm:space-y-5"
      >
        <TypeReasonInput
          type={formData.type}
          reason={formData.reason}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
        />

        <HoursDateInput
          hours={formData.hours}
          date={formData.date}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="h-10 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
