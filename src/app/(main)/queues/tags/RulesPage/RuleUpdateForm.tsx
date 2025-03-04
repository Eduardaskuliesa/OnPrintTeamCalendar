import React, { useState, FormEvent, useEffect } from "react";
import { X, Globe, Users, Package, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useGetTags } from "@/app/lib/actions/queuesTags/hooks/useGetTags";
import { TagType } from "@/app/types/orderApi";
import { Badge } from "@/components/ui/badge";
import { rulesAction } from "@/app/lib/actions/rules";

interface Rule {
    id: number;
    ruleName: string;
    tags: number[];
    ruleType: 'Global' | 'Subscriber' | 'Product' | 'All';
}

interface RuleFormUpdateProps {
    rule: Rule;
    onCancel: () => void;
    isOpen: boolean;
}

interface FormData {
    ruleName: string;
    ruleType: 'Global' | 'Subscriber' | 'Product' | 'All';
    selectedTags: TagType[];
}

interface FormErrors {
    ruleName?: string;
    ruleType?: string;
    selectedTags?: string;
}

export default function RuleFormUpdate({ rule, onCancel, isOpen }: RuleFormUpdateProps) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        ruleName: rule.ruleName,
        ruleType: rule.ruleType,
        selectedTags: [],
    });
    const [currentTagId, setCurrentTagId] = useState<string>("");

    const queryClient = useQueryClient();
    const { data: tags, isLoading: isTagsLoading } = useGetTags();

    // Populate form when rule changes or on component mount
    useEffect(() => {
        if (rule && isOpen) {
            const selectedTagObjects = tags?.data?.filter((tag: TagType) =>
                rule.tags.includes(tag.id)
            ) || [];

            setFormData({
                ruleName: rule.ruleName,
                ruleType: rule.ruleType,
                selectedTags: selectedTagObjects,
            });
        }
    }, [rule, isOpen, tags]);

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.ruleName.trim()) {
            newErrors.ruleName = "Pavadinimas yra privaloma";
        }

        if (!formData.ruleType) {
            newErrors.ruleType = "Rule tipas yra privalomas";
        }

        if (formData.selectedTags.length === 0) {
            newErrors.selectedTags = "Pasirinkite bent vieną tag'ą";
        }

        return newErrors;
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

            const ruleData = {
                ruleName: formData.ruleName,
                ruleType: formData.ruleType,
                tagIds: formData.selectedTags.map(tag => tag.id),
            };

            const response = await rulesAction.updateRule(rule.id, ruleData);

            if (!response.success) {
                throw new Error("Įvyko klaida atnaujinant taisyklę");
            }

            toast.success("Taisyklė sėkmingai atnaujinta");

            await queryClient.invalidateQueries({ queryKey: ["all-rules"] });
            onCancel();
        } catch (error: any) {
            toast.error(error.message);
            console.error("Error updating rule:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTagSelect = (tagId: string) => {
        if (!tagId) return;

        const selectedTag = tags?.data.find(
            (tag: TagType) => tag.id.toString() === tagId
        );

        if (selectedTag && !formData.selectedTags.some(t => t.id === selectedTag.id)) {
            setFormData(prev => ({
                ...prev,
                selectedTags: [...prev.selectedTags, selectedTag]
            }));
            setCurrentTagId("");

            if (errors.selectedTags) {
                setErrors(prev => ({ ...prev, selectedTags: undefined }));
            }
        }
    };

    const removeTag = (tagId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedTags: prev.selectedTags.filter(tag => tag.id !== tagId)
        }));
    };

    const ruleTypeOptions = [
        { value: "Global", label: "Global", icon: <Globe className="h-4 w-4 mr-2" /> },
        { value: "Subscriber", label: "Subscriber", icon: <Users className="h-4 w-4 mr-2" /> },
        { value: "Product", label: "Product", icon: <Package className="h-4 w-4 mr-2" /> },
        { value: "All", label: "All", icon: <LayoutGrid className="h-4 w-4 mr-2" /> }
    ];

    const getTagTypeIcon = (type: string) => {
        const option = ruleTypeOptions.find(opt => opt.value === type);
        return option ? option.icon : null;
    };

    const availableTagsExist = tags && tags.data && tags.data.filter(
        (tag: TagType) => tag.isActive && !formData.selectedTags.some(t => t.id === tag.id)
    ).length > 0;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                    Redaguoti taisyklę
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Pavadinimas
                        </label>
                        <Input
                            value={formData.ruleName}
                            onChange={(e) => {
                                setFormData(prev => ({ ...prev, ruleName: e.target.value }));
                                if (errors.ruleName) {
                                    setErrors(prev => ({ ...prev, ruleName: undefined }));
                                }
                            }}
                            placeholder="Įveskite pavadinimą"
                            className="w-full"
                        />
                        {errors.ruleName && (
                            <p className="text-sm text-red-500">{errors.ruleName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Taisyklės tipas
                        </label>
                        <Select
                            value={formData.ruleType}
                            onValueChange={(value) => {
                                setFormData(prev => ({ ...prev, ruleType: value as FormData['ruleType'] }));
                                if (errors.ruleType) {
                                    setErrors(prev => ({ ...prev, ruleType: undefined }));
                                }
                            }}
                            defaultValue={rule.ruleType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pasirinkite taisyklės tipą">
                                    <div className="flex items-center">
                                        {getTagTypeIcon(formData.ruleType)}
                                        {formData.ruleType}
                                    </div>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {ruleTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                            {option.icon}
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.ruleType && (
                            <p className="text-sm text-red-500">{errors.ruleType}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Pasirinkite tagus
                        </label>
                        <Select
                            value={currentTagId}
                            onValueChange={handleTagSelect}
                            disabled={isTagsLoading || !availableTagsExist}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Pasirinkite tagus" />
                            </SelectTrigger>
                            <SelectContent>
                                {isTagsLoading ? (
                                    <SelectItem value="loading" disabled>
                                        Kraunama...
                                    </SelectItem>
                                ) : availableTagsExist ? (
                                    tags.data
                                        .filter(
                                            (tag: TagType) =>
                                                tag.isActive &&
                                                !formData.selectedTags.some((t) => t.id === tag.id)
                                        )
                                        .map((tag: TagType) => (
                                            <SelectItem
                                                key={tag.id}
                                                value={tag.id.toString()}
                                                className="font-medium bg-white"
                                            >
                                                {tag.tagName}
                                            </SelectItem>
                                        ))
                                ) : (
                                    <SelectItem value="empty" disabled>
                                        Nėra galimų tagų
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.selectedTags && (
                            <p className="text-sm text-red-500">{errors.selectedTags}</p>
                        )}
                    </div>

                    {formData.selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.selectedTags.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    className="flex items-center rounded-md shadow-sm bg-slate-50 border-blue-50 border  text-db text-xs py-1"
                                >
                                    {tag.tagName}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag.id)}
                                        className="ml-1 bg-red-100 rounded-lg p-0.5 text-red-600 hover:text-red-800"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

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
    );
}