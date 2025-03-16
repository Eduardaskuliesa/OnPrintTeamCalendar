/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Template } from "@/app/types/emailTemplates";
import { getEmailTemplate } from "@/app/lib/actions/s3Actions/getEmailTemplate";
import { useEmailBuilder } from "../hooks/useEmailBuilder";
import ComponentPanelWrapper from "./ComponentPanelWrapper";
import EmailCanvasWrapper from "./EmailCanvasWrapper";
import { storeEmailTemplate } from "@/app/lib/actions/s3Actions/storeEmailTemplate";
import { render } from "@react-email/render";
import EmailTemplate from "../EmailTemplate";
import { toast } from "react-toastify";

interface EmailUpdateBuilderProps {
  template: Template;
}

const EmailUpdateBuilder: React.FC<EmailUpdateBuilderProps> = ({
  template,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const {
    emailComponents,
    setEmailComponents,
    selectedComponent,
    setSelectedComponent,
    handleAddComponent,
    handleUpdateComponent,
    moveComponent,
    handleSelectComponent,
    removeComponent,
    markAsSaved,
    isDirty,
    setIsNew,
    panelRef,
    canvasRef,
  } = useEmailBuilder([]);

  useEffect(() => {
    const loadTemplateFromUrl = async () => {
      try {
        if (template?.jsonUrl) {
          console.log("Renders");
          const response = await getEmailTemplate(template.templateName);
          setEmailComponents(JSON.parse(response.jsonData));
          setIsNew(false);
        }
      } catch (error) {
        console.error("Error loading template from URL:", error);
      }
    };

    loadTemplateFromUrl();
  }, [template]);

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
      setIsSaving(false);
    }
  }, [emailComponents, isSaving]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row min-h-screen w-full p-2 gap-6">
        {/* Left Panel - Component Palette */}
        <ComponentPanelWrapper
          panelRef={panelRef}
          selectedComponent={selectedComponent}
          handleUpdateComponent={handleUpdateComponent}
          onAddComponent={handleAddComponent}
          onBackToComponentPalette={() => setSelectedComponent(null)}
        />

        {/* Middle - Email Canvas */}
        <EmailCanvasWrapper
          handleSaveTemplate={handleSaveTemplate}
          canvasRef={canvasRef}
          template={template}
          emailComponents={emailComponents}
          setEmailComponents={setEmailComponents}
          moveComponent={moveComponent}
          removeComponent={removeComponent}
          handleSelectComponent={handleSelectComponent}
          selectedComponentId={selectedComponent?.id}
          markAsSaved={markAsSaved}
          isDirty={isDirty}
          isSaving={isSaving}
        />
      </div>
    </DndProvider>
  );
};

export default EmailUpdateBuilder;
