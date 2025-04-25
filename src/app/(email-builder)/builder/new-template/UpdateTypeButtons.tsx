import { tempalteActions } from '@/app/lib/actions/templates';
import { Template } from '@/app/types/emailTemplates';
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Mail, MailCheck } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify';

interface UpdateTypeButtonsProps {
    template: Template
}

const UpdateTypeButtons = ({ template }: UpdateTypeButtonsProps) => {
    const [isRegularLoading, setIsRegularLoading] = useState(false);
    const [isPromotionalLoading, setIsPromotionalLoading] = useState(false);
    const queryClient = useQueryClient();

    const handleTemplateTypeChange = async (newType: "regular" | "promotional") => {
        try {
            if (template?.type !== newType && template?.id) {
                if (newType === "regular") {
                    setIsRegularLoading(true);
                } else {
                    setIsPromotionalLoading(true);
                }

                const newTemplateType = await tempalteActions.updateTemplateType(template?.id, newType);
                if (!newTemplateType.success) {
                    toast.error("Nepavyko atnaujinti šablono tipo");
                    return;
                }
                toast.success("Šablono tipas atnaujintas");
                await queryClient.invalidateQueries({ queryKey: ["templates"] });
                await queryClient.invalidateQueries({ queryKey: [`template${template.id}`, template.id] });
            }
        } catch (error) {
            console.error("Error updating template type:", error);
            toast.error("Nepavyko atnaujinti šablono tipo");
        } finally {
            setIsRegularLoading(false);
            setIsPromotionalLoading(false);
        }
    };
    return (
        <div className="flex ml-4">
            <Button
                variant="outline"
                onClick={() => handleTemplateTypeChange("regular")}
                disabled={isRegularLoading || isPromotionalLoading}
                className={`flex items-center gap-1 ${template?.type === "regular" ? "bg-db text-white" : ""
                    }`}
            >
                {isRegularLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Mail size={16} />
                )}
                <span>Regular</span>
            </Button>
            <Button
                variant="outline"
                onClick={() => handleTemplateTypeChange("promotional")}
                disabled={isRegularLoading || isPromotionalLoading}
                className={`flex items-center gap-1 ml-2 ${template?.type === "promotional" ? "bg-db text-white" : ""
                    }`}
            >
                {isPromotionalLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <MailCheck size={16} />
                )}
                <span>Promotional</span>
            </Button>
        </div>
    )
}

export default UpdateTypeButtons