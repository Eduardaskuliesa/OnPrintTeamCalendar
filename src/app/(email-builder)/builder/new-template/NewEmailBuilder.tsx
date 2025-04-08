/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ComponentPanelSkeleton from "@/app/(main)/email/components/skeletons/ComponentPanelSkeleton";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmailCanvasWrapper from "./EmailCanvasWrapper";
import useEmailBuilderStore, {
  useEmailBuilderUI,
} from "@/app/store/emailBuilderStore";
import DraggableCodePanel from "./components/CodePanel";
import ViewModeToggle from "@/app/(main)/email/ViewModeToggle";
import EmailPreview from "@/app/(main)/email/EmailPreview";
import EmailTemplate from "@/app/(main)/email/EmailTemplate";
import { render } from "@react-email/render";

const ComponentPanelWrapper = React.lazy(
  () => import("../new-template/ComponentPanelWrapper")
);

const NewEmailBuilder: React.FC = () => {
  const [viewMode, setViewMode] = useState("dekstop");
  const [emailHtml, setEmailHtml] = useState();
  const { setEmailComponents, markAsSaved, emailComponents } =
    useEmailBuilderStore();
  const draggableRef = useRef<HTMLDivElement>(null);

  const { panelRef, canvasRef } = useEmailBuilderUI();

  useEffect(() => {
    const savedComponents = localStorage.getItem("emailBuilderComponents");
    if (savedComponents) {
      try {
        markAsSaved();
        setEmailComponents(JSON.parse(savedComponents));
        markAsSaved();
      } catch (error) {
        console.error("Error parsing saved components:", error);
      }
    }
  }, [setEmailComponents]);

  // useEffect(() => {
  //   const updateEmailHtml = async () => {
  //     try {
  //       const template = <EmailTemplate emailComponents={emailComponents} />;
  //       const html = await render(template);
  //       setEmailHtml(html);
  //       console.log("Generated HTML:", html);
  //     } catch (error) {
  //       console.error("Error rendering email:", error);
  //     }
  //   };

  //   if (emailComponents.length) {
  //     updateEmailHtml();
  //   }
  // }, [emailComponents]);
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

          {/* <div className="w-full max-w-2xl">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-[#E4E4E7] overflow-visible">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Email Preview
              </h2>
              <EmailPreview emailHtml={emailHtml} viewMode={viewMode} />
            </div>
          </div> */}
        </div>
        <DraggableCodePanel canvasRef={draggableRef} />
      </DndProvider>
    </>
  );
};

export default NewEmailBuilder;
