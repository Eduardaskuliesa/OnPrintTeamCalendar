"use client";
import React, { useEffect, useState } from "react";
import DraggableEmailCanvas from "@/app/(main)/email/DragableEmailCanvas";
import ViewModeToggle from "./components/ViewModeToggle";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import FormattingToolbar from "../../components/FormattingToolbar";
import useToolbarStore from "@/app/store/toolbarStore";
import { Mail } from "lucide-react";
import { Template } from "@/app/types/emailTemplates";
import { Button } from "@/components/ui/button";
import UpdateTypeButtons from "./UpdateTypeButtons";

interface EmailCanvasWrapperProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  template?: Template;
}

const EmailCanvasWrapper: React.FC<EmailCanvasWrapperProps> = ({
  template,
  canvasRef,
}) => {
  const [viewMode, setViewMode] = useState("desktop");


  const emailComponents = useEmailBuilderStore(
    (state) => state.emailComponents
  );

  const selectedComponentId = useEmailBuilderStore(
    (state) => state.selectedComponent?.id
  );
  const handleContentUpdate = useEmailBuilderStore(
    (state) => state.handleContentUpdate
  );
  const setEmailComponents = useEmailBuilderStore(
    (state) => state.setEmailComponents
  );
  const moveComponent = useEmailBuilderStore((state) => state.moveComponent);
  const removeComponent = useEmailBuilderStore(
    (state) => state.removeComponent
  );
  const handleSelectComponent = useEmailBuilderStore(
    (state) => state.handleSelectComponent
  );

  useEffect(() => {
    console.log(emailComponents);
    console.log(template);
  }, [emailComponents, template]);

  const { isVisible } = useToolbarStore();



  return (
    <div className="w-full overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="bg-slate-50 shadow-sm border-b-4 border-blue-50 w-full h-auto sticky top-0 z-[50] flex flex-col justify-center items-center">
        <div className="flex w-full justify-between items-center py-2">
          {template && (
            <UpdateTypeButtons template={template} />
          )}

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          <div className="mr-4 invisible">
            <Button variant="outline">
              <Mail size={16} />
              <span>Placeholder</span>
            </Button>
          </div>
        </div>

        {isVisible ? (
          <FormattingToolbar />
        ) : (
          <div className="h-[40px] mt-2 mb-1 p-1"></div>
        )}
      </div>

      <div className="flex justify-center">
        <div
          ref={canvasRef}
          className={`w-full ${viewMode === "desktop" ? "max-w-2xl" : "max-w-[375px]"
            } transition-all custom-scrollbar bg-white`}
        >
          <DraggableEmailCanvas
            onUpdateComponent={handleContentUpdate}
            components={emailComponents}
            setComponents={setEmailComponents}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            onSelectComponent={handleSelectComponent}
            selectedComponentId={selectedComponentId}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailCanvasWrapper;