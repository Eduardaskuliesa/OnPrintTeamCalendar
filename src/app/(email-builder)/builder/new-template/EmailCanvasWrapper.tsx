"use client";
import React, { useState } from "react";
import DraggableEmailCanvas from "@/app/(main)/email/DragableEmailCanvas";
import ViewModeToggle from "./components/ViewModeToggle";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import FormattingToolbar from "../../components/FormattingToolbar";
import useToolbarStore from "@/app/store/toolbarStore";

interface EmailCanvasWrapperProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

const EmailCanvasWrapper: React.FC<EmailCanvasWrapperProps> = ({
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

  const { isEditing, isVisible } = useToolbarStore();

  console.log(isEditing);

  return (
    <div className="w-full overflow-y-auto custom-scrollbar bg-gray-100">
      <div className="bg-slate-50 shadow-sm border-b-4 border-blue-50 w-full h-[100px] sticky top-0 z-[50] flex flex-col justify-center items-center">
        {isVisible && <FormattingToolbar></FormattingToolbar>}
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      <div></div>
      <div className="flex justify-center">
        <div
          ref={canvasRef}
          className={`w-full ${viewMode === "desktop" ? "max-w-2xl" : "max-w-[375px]"} transition-all custom-scrollbar bg-white`}
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
