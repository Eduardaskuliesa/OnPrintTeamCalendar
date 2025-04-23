/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    AlertCircle,
    PlusCircle,
    ArrowBigLeftDash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import EmailTemplate from "@/app/(main)/email/EmailTemplate";
import { render } from "@react-email/render";
import { storeEmailTemplate } from "@/app/lib/actions/s3Actions/storeEmailTemplate";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import { Template } from "@/app/types/emailTemplates";
import SendTestButton from "@/app/(email-builder)/components/SendTestButton";


interface EmailBuilderHeaderProps {
    template: Template;
}
const EmailBuilderHeader: React.FC<EmailBuilderHeaderProps> = ({ template }) => {

    const [isSaving, setIsSaving] = useState(false);


    const { emailComponents, markAsSaved, isDirty } = useEmailBuilderStore();

    const removeFromLocalStorage = () => {
        localStorage.removeItem(
            "emailBuilderComponents"
        );
    }

    const handleSaveTemplate = useCallback(async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const templateHtml = <EmailTemplate emailComponents={emailComponents} />;
            const html = await render(templateHtml);
            const jsonData = JSON.stringify(emailComponents);

            await storeEmailTemplate({
                name: template.templateName,
                html: html,
                jsonData: jsonData,
            });

            toast.success("Šablonas išsauguotas");
        } catch (error) {
            toast.error("Nepavyko išsauguoti šablono");
            console.error(error);
        } finally {
            removeFromLocalStorage()
            markAsSaved()
            setIsSaving(false);
        }
    }, [emailComponents, isSaving]);



    return (
        <div
            style={{ "--header-height": "70px" } as React.CSSProperties}
            className="flex justify-between sticky top-0 left-0  w-full flex-row p-4 bg-white border-b-2 z-[100] "
        >
            <div>
                <Link href={"/email"}>
                    <Button onClick={() => removeFromLocalStorage()}>
                        <ArrowBigLeftDash />
                        Atgal
                    </Button>
                </Link>
            </div>
            <div className="flex gap-5 justify-center items-center">
                <div>
                    <Button
                        variant="outline"
                        className="flex hover:cursor-default  items-center gap-2 text-base bg-gray-100"
                    >
                        {!isDirty ? (
                            <>
                                <CheckCircle size={18} className="text-green-600" />
                                <span className="text-gray-800">Changes Saved</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={18} className="text-amber-500" />
                                <span className="text-gray-800"> Unsaved Changes</span>
                            </>
                        )}
                    </Button>
                </div>
                <div>
                    <SendTestButton></SendTestButton>
                </div>
                <div>
                    <Button
                        onClick={handleSaveTemplate}
                        className="text-base flex items-center gap-2"
                    >
                        <PlusCircle size={18} />
                        Save Template
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EmailBuilderHeader;
