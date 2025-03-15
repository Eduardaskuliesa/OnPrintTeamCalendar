"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { render } from "@react-email/render";
import { storeEmailTemplate } from "@/app/lib/actions/s3Actions/storeEmailTemplate";
import { toast } from "react-toastify";
import { tempalteActions } from "@/app/lib/actions/templates";
import { TemplateData } from "@/app/lib/actions/templates/createTemplate";
import LeftPanel from "./LeftPanel";
import MiddlePanel from "./MiddlePanel";
import { useEmailBuilder } from "../hooks/useEmailBuilder";
import CreateTemplateModal from "./CreateTemplateModal";
import EmailTemplate from "../EmailTemplate";

const NewEmailBuilder: React.FC = () => {
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
      localStorage.removeItem('emailBuilderComponents')
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
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row min-h-screen w-full p-2 gap-6">
          {/* Left Panel - Component Palette */}
          <LeftPanel
            panelRef={panelRef}
            selectedComponent={selectedComponent}
            handleUpdateComponent={handleUpdateComponent}
            handleAddComponent={handleAddComponent}
            setSelectedComponent={setSelectedComponent}
          />

          {/* Middle Panel - Email Canvas */}
          <MiddlePanel
            canvasRef={canvasRef}
            emailComponents={emailComponents}
            setEmailComponents={setEmailComponents}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            handleSelectComponent={handleSelectComponent}
            selectedComponentId={selectedComponent?.id}
            openNameDialog={openNameDialog}
          />
        </div>
      </DndProvider>

      {/* Template Name Dialog */}
      <CreateTemplateModal
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        templateName={templateName}
        onTemplateNameChange={handleTemplateNameChange}
        nameError={nameError}
        dialogStatus={dialogStatus}
        onSubmit={handleCreateTemplate}
      />
    </>
  );
};

export default NewEmailBuilder;
