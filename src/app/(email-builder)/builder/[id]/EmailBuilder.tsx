/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ComponentPanelSkeleton from "@/app/(main)/email/components/skeletons/ComponentPanelSkeleton";
import React, { Suspense, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useEmailBuilderStore, {
    useEmailBuilderUI,
} from "@/app/store/emailBuilderStore";
import { Template } from "@/app/types/emailTemplates";
import { getEmailTemplate } from "@/app/lib/actions/s3Actions/getEmailTemplate";
import EmailCanvasWrapper from "../new-template/EmailCanvasWrapper";
import DraggableCodePanel from "../new-template/components/CodePanel";


const ComponentPanelWrapper = React.lazy(
    () => import("../new-template/ComponentPanelWrapper")
);

interface EmailUpdateBuilderProps {
    template: Template;
}

const UpdateEmailBuilder: React.FC<EmailUpdateBuilderProps> = ({ template }) => {
    const { setEmailComponents } =
        useEmailBuilderStore();
    const draggableRef = useRef<HTMLDivElement>(null);

    const { panelRef, canvasRef } = useEmailBuilderUI();

    useEffect(() => {
        const loadTemplateFromUrl = async () => {
            
            try {
                if (template?.jsonUrl) {
                    console.log("Renders");
                    const response = await getEmailTemplate(template.templateName);
                    setEmailComponents(JSON.parse(response.jsonData));

                }
            } catch (error) {
                console.error("Error loading template from URL:", error);
            }
        };

        loadTemplateFromUrl();
    }, [template]);

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <div
                    className="flex flex-row h-full max-h-[calc(100vh-70px)] relative"
                    ref={draggableRef}
                >
                    {/* Left Panel - Component Palette */}
                    <Suspense fallback={<ComponentPanelSkeleton />}>
                        <ComponentPanelWrapper panelRef={panelRef} />
                    </Suspense>

                    {/* Middle Panel - Email Canvas */}

                    <EmailCanvasWrapper canvasRef={canvasRef} />

                </div>
                <DraggableCodePanel canvasRef={draggableRef} />
            </DndProvider>
        </>
    );
};

export default UpdateEmailBuilder;
