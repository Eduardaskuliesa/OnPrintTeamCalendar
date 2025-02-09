"use client";
import { useState, useRef, FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeyboardShortcuts } from "@/app/hooks/useKeyboardShortcuts";
import { updateWorkRecord } from "../../../lib/actions/workrecords/updateWorkRecord";
import { useQueryClient } from "@tanstack/react-query";
import { CustomTimeInput } from "./CustomTimeInput";
import { WorkRecord } from "@/app/types/api";

interface WorkRecordUpdateFormProps {
  userId: string;
  onCancel: () => void;
  isOpen: boolean;
  record: WorkRecord | null;
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

export default function WorkRecordUpdateForm({
  userId,
  onCancel,
  isOpen,
  record,
}: WorkRecordUpdateFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    type: record?.type ?? "overtime",
    time: record?.time ?? "",
    reason: record?.reason ?? "",
    date: record?.date ? record.date.split("#")[0] : "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        type: record.type,
        time: record.time,
        reason: record.reason,
        date: record.date.split("#")[0],
      });
    }
  }, [record]);

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

    if (!record) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const response = await updateWorkRecord(userId, record.date, {
        type: formData.type,
        time: formData.time,
        reason: formData.reason,
        date: formData.date,
      });

      if (response && response.error) {
        throw new Error(response.error);
      }

      const newYearMonth = formData.date.slice(0, 7);
      const year = formData.date.slice(0, 4);
      const yearMonthDay = formData.date.slice(0, 10);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["userWorkRecords", userId, newYearMonth],
        }),
        queryClient.invalidateQueries({
          queryKey: ["userWorkRecords", userId, yearMonthDay],
        }),
        queryClient.invalidateQueries({
          queryKey: ["userWorkRecords", userId, year],
        }),
      ]);

      toast.success("Įrašas sėkmingai atnaujintas");
      onCancel();
    } catch (error: any) {
      toast.error(error.message || "Įvyko klaida atnaujinant įrašą");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useKeyboardShortcuts(isOpen, onCancel);

  return (
    <div
      className={`fixed inset-0 transition-all duration-200 ease-out flex items-center justify-center z-50 ${
        isOpen && record
          ? "bg-black/50 opacity-100 visible"
          : "bg-black/0 opacity-0 invisible pointer-events-none"
      }`}
      onClick={onCancel}
    >
      <div
        className={`bg-white rounded-lg max-w-lg w-full mx-4 
          transition-all duration-100 ease-out
          motion-safe:transition-[transform,opacity]
          motion-safe:duration-200
          motion-safe:cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isOpen && record
              ? "transform scale-100 opacity-100 translate-y-0"
              : "transform scale-95 opacity-0 -translate-y-2"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {record && (
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                Redaguoti darbo įrašą
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
                            type: type.value as
                              | "overtime"
                              | "late"
                              | "early_leave",
                          }))
                        }
                        variant={
                          formData.type === type.value ? "default" : "outline"
                        }
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
                      setFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }));
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
                    {loading ? "Atnaujinama..." : "Atnaujinti"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
