import React, { useState, FormEvent } from "react";
import { X, Clock, Globe, Users, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { createTag } from "@/app/lib/actions/queuesTags/createTag";
import { TagType } from "@/app/types/orderApi";

interface QueueTagFormProps {
  onCancel: () => void;
  isOpen: boolean;
}

interface FormData {
  tagName: string;
  tagType: TagType['tagType'];
  days: string;
  hours: string;
  minutes: string;
}

interface FormErrors {
  tagName?: string;
  scheduledFor?: string;
}

export default function QueueTagForm({ onCancel }: QueueTagFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    tagName: "",
    tagType: "All",
    days: "0",
    hours: "0",
    minutes: "0",
  });

  const queryClient = useQueryClient();

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.tagName.trim()) {
      newErrors.tagName = "Pavadinimas yra privaloma";
    }

    const totalMilliseconds = calculateTotalMilliseconds();
    if (totalMilliseconds <= 0) {
      newErrors.scheduledFor = "Laikas turi būti didesnis nei 0";
    }

    return newErrors;
  };

  const calculateTotalMilliseconds = () => {
    return (
      parseInt(formData.days || "0") * 24 * 60 * 60 * 1000 +
      parseInt(formData.hours || "0") * 60 * 60 * 1000 +
      parseInt(formData.minutes || "0") * 60 * 1000
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);

      const tagData = {
        tagName: formData.tagName,
        tagType: formData.tagType,
        scheduledFor: calculateTotalMilliseconds(),
      };

      const response = await createTag(tagData);

      if (!response) {
        throw new Error("Įvyko klaida kuriant žingsnį");
      }

      toast.success("Žingsnis sėkmingai sukurtas");
      await queryClient.invalidateQueries({ queryKey: ["all-tags"] });
      setFormData({
        tagName: "",
        tagType: "All",
        days: "0",
        hours: "0",
        minutes: "0",
      });
      onCancel();
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error creating queue Tag:", error);
    } finally {
      setLoading(false);
    }
  };

  const presetTimes = [
    { days: "0", hours: "1", minutes: "0", label: "1h" },
    { days: "0", hours: "12", minutes: "0", label: "12h" },
    { days: "1", hours: "0", minutes: "0", label: "1d" },
    { days: "3", hours: "0", minutes: "0", label: "3d" },
    { days: "7", hours: "0", minutes: "0", label: "7d" },
    { days: "15", hours: "0", minutes: "0", label: "15d" },
    { days: "30", hours: "0", minutes: "0", label: "30d" },
    { days: "60", hours: "0", minutes: "0", label: "60d" },
    { days: "90", hours: "0", minutes: "0", label: "90d" },
  ];

  const [isTimePopoverOpen, setIsTimePopoverOpen] = useState(false);

  const formatDisplayTime = () => {
    const days = parseInt(formData.days || "0");
    const hours = parseInt(formData.hours || "0");
    const minutes = parseInt(formData.minutes || "0");

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "Pasirinkite laiką";
  };

  const tagTypeOptions = [
    { value: "Global", label: "Global", icon: <Globe className="h-4 w-4 mr-2" /> },
    { value: "Subscriber", label: "Subscriber", icon: <Users className="h-4 w-4 mr-2" /> },
    { value: "All", label: "All", icon: <LayoutGrid className="h-4 w-4 mr-2" /> }
  ];

  const getTagTypeIcon = (type: string) => {
    const option = tagTypeOptions.find(opt => opt.value === type);
    return option ? option.icon : null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Naujas tagas</CardTitle>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pavadinimas
            </label>
            <Input
              value={formData.tagName}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, tagName: e.target.value }));
                if (errors.tagName) {
                  setErrors((prev) => ({ ...prev, tagName: undefined }));
                }
              }}
              placeholder="Įveskite pavadinimą"
              className="w-full"
            />
            {errors.tagName && (
              <p className="text-sm text-red-500">{errors.tagName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tago tipas
            </label>
            <Select
              value={formData.tagType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, tagType: value as TagType['tagType'] }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pasirinkite tago tipą">
                  <div className="flex items-center">
                    {getTagTypeIcon(formData.tagType)}
                    {formData.tagType}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tagTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Laukimo laikas
            </label>
            <Popover
              open={isTimePopoverOpen}
              onOpenChange={setIsTimePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-10 border-gray-300 border rounded-lg"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {formatDisplayTime()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Dienos
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.days}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          days: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Valandos
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={formData.hours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hours: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">
                      Minutės
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={formData.minutes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          minutes: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {presetTimes.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          days: preset.days,
                          hours: preset.hours,
                          minutes: preset.minutes,
                        }));
                        setIsTimePopoverOpen(false);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {errors.scheduledFor && (
              <p className="text-sm text-red-500">{errors.scheduledFor}</p>
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