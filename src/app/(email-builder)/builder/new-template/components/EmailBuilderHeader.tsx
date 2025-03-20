"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, SendHorizonal, PlusCircle, ArrowBigLeftDash } from 'lucide-react'
import Link from 'next/link'
import { useEmailBuilder } from '@/app/(main)/email/hooks/useEmailBuilder'
import { toast } from 'react-toastify'
import CreateTemplateModal from '@/app/(main)/email/new/CreateTemplateModal'
import { useRouter } from 'next/navigation'
import EmailTemplate from '@/app/(main)/email/EmailTemplate'
import { render } from '@react-email/render'
import { storeEmailTemplate } from '@/app/lib/actions/s3Actions/storeEmailTemplate'
import { TemplateData } from '@/app/lib/actions/templates/createTemplate'
import { tempalteActions } from '@/app/lib/actions/templates'

const EmailBuilderHeader = () => {

    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [nameError, setNameError] = useState("");
    const [dialogStatus, setDialogStatus] = useState<
        "idle" | "saving" | "navigating"
    >("idle");

    const {
        emailComponents,
        setEmailComponents,
        selectedComponent,
        setSelectedComponent,
        panelRef,
        canvasRef,
        handleAddComponent,
        handleUpdateComponent,
        moveComponent,
        handleSelectComponent,
        removeComponent,
        markAsSaved,
        isDirty,
        handleContentUpdate,
    } = useEmailBuilder([]);



    useEffect(() => {
        const savedComponents = localStorage.getItem("emailBuilderComponents");
        if (savedComponents) {
            try {
                setEmailComponents(JSON.parse(savedComponents));
                markAsSaved();
            } catch (error) {
                console.error("Error parsing saved components:", error);
            }
        }
    }, [setEmailComponents]);

    const openNameDialog = () => {
        if (emailComponents.length === 0) {
            toast.error("Pridėkite bent vieną komponentą prieš išsaugant");
            return;
        }
        setNameError("");
        setDialogStatus("idle");
        setIsDialogOpen(true);
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open && dialogStatus !== "idle") {
            return;
        }
        setIsDialogOpen(open);
    };

    const handleTemplateNameChange = (value: string) => {
        setTemplateName(value);
        setNameError("");
    };

    const handleCreateTemplate = async () => {
        if (dialogStatus !== "idle") return;

        if (!templateName.trim()) {
            setNameError("Šablono pavadinimas yra privalomas");
            return;
        }

        setDialogStatus("saving");
        setNameError("");

        try {
            const template = <EmailTemplate emailComponents={emailComponents} />;
            const html = await render(template);
            const jsonData = JSON.stringify(emailComponents);

            const result = await storeEmailTemplate({
                name: templateName,
                html: html,
                jsonData: jsonData,
            });

            const templateData: TemplateData = {
                templateName: templateName,
                htmlUrl: result.htmlUrl,
                jsonUrl: result.jsonUrl,
            };

            console.log("Sending templateData:", templateData);
            const createResponse = await tempalteActions.createTemplate(templateData);

            if (createResponse && createResponse.success === false) {
                if (createResponse.errorType === "DUPLICATE_TEMPLATE_NAME") {
                    setNameError("Toks šablono pavadynimas jau užimtas");
                    setDialogStatus("idle");
                    return;
                }

                setDialogStatus("idle");
                return;
            }
            markAsSaved();
            localStorage.removeItem("emailBuilderComponents");
            toast.success("Šablonas sėkmingai sukurtas");

            if (
                createResponse &&
                createResponse.data &&
                createResponse.data.template
            ) {
                setDialogStatus("navigating");
                const { template } = createResponse.data;

                setTimeout(() => {
                    router.push(`/email/${template.templateName}?id=${template.id}`);
                }, 500);
            } else {
                console.log("Couldn't find template ID in response:", createResponse);
                setNameError("Šablonas sukurtas, bet nepavyko nukreipti į jo puslapį");
                setDialogStatus("idle");
            }
        } catch (error) {
            setNameError("Nepavyko išsaugoti šablono");
            console.error("Unexpected error saving template:", error);
            setDialogStatus("idle");
        }
    };
    return (
        <div style={{ '--header-height': '70px' } as React.CSSProperties} className="flex justify-between sticky top-0 left-0  w-full flex-row p-4 bg-white border-b-2 z-[100] ">
            <div>
                <Link href={"/email"}>
                    <Button>
                        <ArrowBigLeftDash />
                        Atgal
                    </Button>
                </Link>
            </div>
            <div className="flex gap-5 justify-center items-center">
                <div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 text-base bg-gray-200"
                        disabled
                    >
                        {isDirty ? (
                            <>
                                <CheckCircle size={18} className="text-green-600" />
                                <span>Changes Saved</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={18} className="text-amber-500" />
                                <span>Unsaved Changes</span>
                            </>
                        )}
                    </Button>
                </div>
                <div>
                    <Button

                        variant="default2"
                        className="text-base bg-dcoffe text-db hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <SendHorizonal size={18} />
                        Send Test Email
                    </Button>
                </div>
                <div>
                    <Button
                        onClick={openNameDialog}
                        className="text-base flex items-center gap-2"
                    >
                        <PlusCircle size={18} />
                        Create New Template
                    </Button>
                </div>
            </div>

            <CreateTemplateModal
                isOpen={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                templateName={templateName}
                onTemplateNameChange={handleTemplateNameChange}
                nameError={nameError}
                dialogStatus={dialogStatus}
                onSubmit={handleCreateTemplate}
            />
        </div>
    )
}

export default EmailBuilderHeader