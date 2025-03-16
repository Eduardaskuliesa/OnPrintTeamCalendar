"use client";
import React, { Suspense } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Template } from "@/app/types/emailTemplates";

const DraggableEmailCanvas = React.lazy(() => import("../DragableEmailCanvas"));

interface EmailCanvasWrapperProps {
  template: Template;
  emailComponents: any[];
  handleSaveTemplate: () => void;
  setEmailComponents: (components: any[]) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  removeComponent: (id: string) => void;
  handleSelectComponent: (component: any) => void;
  selectedComponentId: string | undefined;
  markAsSaved: () => void;
  isDirty: boolean;
  isSaving: boolean;
  canvasRef: React.RefObject<HTMLDivElement>;
}

const EmailCanvasWrapper: React.FC<EmailCanvasWrapperProps> = ({
  template,
  emailComponents,
  setEmailComponents,
  moveComponent,
  removeComponent,
  handleSaveTemplate,
  handleSelectComponent,
  selectedComponentId,
  markAsSaved,
  isDirty,
  isSaving,
  canvasRef,
}) => {
  return (
    <div ref={canvasRef} className="max-w-2xl w-full">
      <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            {template.templateName}
          </h2>
          <Button
            onClick={() => {
              markAsSaved();
              handleSaveTemplate();
            }}
            disabled={!isDirty}
            className={!isDirty ? "bg-gray-400" : ""}
          >
            <div className="flex">
              <Save className="h-5 w-5 mr-2"></Save>{" "}
              {isSaving
                ? "Atnaujinama..."
                : !isDirty
                  ? "Išsaugota"
                  : "Atnaujinti šabloną"}
            </div>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-col w-full p-4 gap-2 items-center justify-center">
              <Skeleton className="w-full h-10 "></Skeleton>
              <Skeleton className="w-full min-h-[350px] rounded-md"></Skeleton>
              <Skeleton className="w-full h-20 rounded-md "></Skeleton>
              <Skeleton className="w-full h-10 rounded-full "></Skeleton>
              <Skeleton className="w-full min-h-[350px]"></Skeleton>
              <Skeleton className="w-full h-20 rounded-md"></Skeleton>
            </div>
          }
        >
          <DraggableEmailCanvas
            components={emailComponents}
            setComponents={setEmailComponents}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            onSelectComponent={handleSelectComponent}
            selectedComponentId={selectedComponentId}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default EmailCanvasWrapper;
