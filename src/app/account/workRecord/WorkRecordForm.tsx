"use client";

import { useState, useRef, FormEvent } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { CustomTimeInput } from "./CustomTimeInput";
import { createWorkRecord } from "../../lib/actions/workrecords/createWorkRecord";
import { useQueryClient } from "@tanstack/react-query";

interface WorkRecordFormProps {
  userId: string;
  onCancel: () => void;
  isOpen: boolean;
}

export interface WorkRecordFormData {
  type: "overtime" | "late" | "early_leave";
  time: string;
  reason: string;
  date: string;
  yearMonth: string;
}

interface FormErrors {
  time?: string;
  date?: string;
  reason?: string;
  type?: string;
}

const recordTypes = [
  { value: "overtime", label: "Viršvalandžiai" },
  { value: "late", label: "Vėlavimas" },
  { value: "early_leave", label: "Ankstesnis išėjimas" },
];

export default function WorkRecordForm({
  userId,
  onCancel,
  isOpen,
}: WorkRecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<WorkRecordFormData>({
    type: "overtime",
    time: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
    yearMonth: new Date().toISOString().split("T")[0].slice(0, 10),
  });

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.time.trim()) {
      newErrors.time = "Laikas yra privalomas";
    }
    if (!formData.date) {
      newErrors.date = "Data yra privaloma";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Priežastis yra privaloma";
    }
    if (!formData.type) {
      newErrors.type = "Tipas yra privalomas";
    }

    return newErrors;
  };

  async function handleSubmit(e: FormEvent<Element>) {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const workRecord = {
        ...formData,
        userId,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        yearMonth: formData.date.slice(0, 10),
      };

      const response = await createWorkRecord(workRecord);
      if (response && response.error) {
        throw new Error(response.error);
      }

      await queryClient.invalidateQueries({
        queryKey: ["userWorkRecords", userId, workRecord.yearMonth.slice(0, 7)],
      });

      await queryClient.invalidateQueries({
        queryKey: ["monthlyWorkRecords", workRecord.yearMonth.slice(0, 7)],
      });
      await queryClient.invalidateQueries({
        queryKey: ["userWorkRecords", userId, workRecord.yearMonth.slice(0, 7)],
      });

      toast.success("Įrašas sėkmingai sukurtas");

      setFormData({
        type: "overtime",
        time: "",
        reason: "",
        date: new Date().toISOString().split("T")[0],
        yearMonth: new Date().toISOString().split("T")[0].slice(0, 10),
      });
      onCancel();
    } catch (error: any) {
      toast.error(error.message || "Įvyko klaida kuriant įrašą");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardShortcuts(isOpen, onCancel);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Naujas darbo įrašas
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Įrašo tipas
            </label>
            <div className="flex space-x-2">
              {recordTypes.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: type.value as WorkRecordFormData["type"],
                    }))
                  }
                  variant={formData.type === type.value ? "default" : "outline"}
                  className={`flex-1 ${
                    formData.type === type.value
                      ? "bg-lcoffe text-db hover:bg-dcoffe"
                      : ""
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Laikas
              </label>
              <CustomTimeInput
                value={formData.time}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, time: value }));
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }
                }}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Data
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    date: e.target.value,
                    yearMonth: e.target.value.slice(0, 7),
                  }));
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
                className="w-full h-10 rounded-lg"
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Priežastis
            </label>
            <Textarea
              value={formData.reason}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, reason: e.target.value }));
                if (errors.reason) {
                  setErrors((prev) => ({ ...prev, reason: undefined }));
                }
              }}
              className="w-full min-h-[100px] rounded-lg"
              placeholder="Prašome pateikti priežastį..."
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="h-10 rounded-lg hover:bg-gray-200"
            >
              Atšaukti
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-lcoffe rounded-lg text-db hover:bg-dcoffe h-10"
            >
              {loading ? "Kuriama..." : "Sukurti"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
