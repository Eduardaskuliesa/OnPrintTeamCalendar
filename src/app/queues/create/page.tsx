"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Plus,
  X,
  ChevronRight,
  Mail,
  Tag,
  Timer,
  Loader2,
} from "lucide-react";
import { useGetSteps } from "@/app/lib/actions/queuesSteps/hooks/useGetSteps";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface Step {
  stepId: string;
  tag: string;
  waitDuration: number;
  isActive: boolean;
  actionConfig: {
    template: string;
  };
}

interface SelectedStep {
  stepId: string;
  status: "pending";
  completedAt: null;
}

interface FormData {
  email: string;
  tag: string;
  selectedSteps: SelectedStep[];
}

interface FormErrors {
  email?: string;
  tag?: string;
  steps?: string;
}

const CreateJobPage = () => {
  const router = useRouter();
  const { data: availableSteps, isLoading: stepsLoading } = useGetSteps();
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    tag: "",
    selectedSteps: [],
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El. paštas yra privalomas";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Neteisingas el. pašto formatas";
    }

    if (!formData.tag.trim()) {
      newErrors.tag = "Žyma yra privaloma";
    }

    if (formData.selectedSteps.length === 0) {
      newErrors.steps = "Pasirinkite bent vieną žingsnį";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStepSelect = (step: Step) => {
    setFormData((prev) => ({
      ...prev,
      selectedSteps: [
        ...prev.selectedSteps,
        {
          stepId: step.stepId,
          status: "pending",
          completedAt: null,
        },
      ],
    }));
    if (errors.steps) {
      setErrors((prev) => ({ ...prev, steps: undefined }));
    }
  };

  const removeStep = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedSteps: prev.selectedSteps.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const scheduledFor = availableSteps?.find(
        (step) => step.stepId === formData.selectedSteps[0]?.stepId
      )?.waitDuration;

      if (!scheduledFor) {
        throw new Error("Nepavyko nustatyti laiko");
      }

      const jobData = {
        email: formData.email,
        tag: formData.tag,
        scheduledFor,
        steps: formData.selectedSteps.reduce((acc, step, index) => {
          acc[`step${index + 1}`] = step;
          return acc;
        }, {} as Record<string, SelectedStep>),
      };

      console.log(jobData);

      const response = await fetch("http://localhost:3000/api/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Įvyko klaida");
      }

      toast.success("Eilė sėkmingai sukurta");
      await queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      router.push("/queues");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Įvyko klaida");
      console.error("Failed to create queue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Sukurti naują eilę</h1>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                El. paštas
              </label>
              <Input
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                placeholder="Įveskite el. paštą"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Žyma
              </label>
              <Input
                value={formData.tag}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, tag: e.target.value }));
                  if (errors.tag) {
                    setErrors((prev) => ({ ...prev, tag: undefined }));
                  }
                }}
                placeholder="Įveskite žymą"
                className={errors.tag ? "border-red-500" : ""}
              />
              {errors.tag && (
                <p className="text-sm text-red-500">{errors.tag}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Steps Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <label className="text-sm font-medium flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Žingsniai
              </label>

              {/* Selected Steps */}
              <div className="space-y-3">
                {formData.selectedSteps.map((step, index) => {
                  const stepData = availableSteps?.find(
                    (s) => s.stepId === step.stepId
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{stepData?.tag}</div>
                        <div className="text-sm text-gray-500">
                          {stepData?.actionConfig.template}
                        </div>
                      </div>
                      {index < formData.selectedSteps.length - 1 && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {errors.steps && (
                <p className="text-sm text-red-500">{errors.steps}</p>
              )}

              {/* Add Step Button */}
              <Button
                onClick={() => setShowStepsModal(true)}
                variant="outline"
                className="w-full"
                disabled={stepsLoading}
              >
                {stepsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Pridėti žingsnį
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-dcoffe hover:bg-vdcoffe text-db hover:text-gray-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Kuriama...
            </>
          ) : (
            "Sukurti"
          )}
        </Button>
      </div>

      {/* Steps Selection Modal */}
      <Dialog open={showStepsModal} onOpenChange={setShowStepsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pasirinkite žingsnį</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {availableSteps
              ?.filter((step) => step.isActive)
              .map((step) => (
                <button
                  key={step.stepId}
                  onClick={() => {
                    handleStepSelect(step as Step);
                    setShowStepsModal(false);
                  }}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-gray-400 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{step.tag}</div>
                    <div className="text-sm text-gray-500">
                      {step.actionConfig.template}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateJobPage;
