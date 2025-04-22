/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ComponentPanelSkeleton from "@/app/(main)/email/components/skeletons/ComponentPanelSkeleton";
import React, { Suspense, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmailCanvasWrapper from "./EmailCanvasWrapper";
import useEmailBuilderStore, {
  useEmailBuilderUI,
} from "@/app/store/emailBuilderStore";
import DraggableCodePanel from "../../components/CodePanel";
import ConstantPanel from "../../components/ConstantPanel";


const ComponentPanelWrapper = React.lazy(
  () => import("../new-template/ComponentPanelWrapper")
);

const NewEmailBuilder: React.FC = () => {
  const { setEmailComponents, markAsSaved } =
    useEmailBuilderStore();
  const draggableRef = useRef<HTMLDivElement>(null);

  const { panelRef, canvasRef, } = useEmailBuilderUI();

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
        <ConstantPanel canvasRef={draggableRef} />
      </DndProvider>
    </>
  );
};

export default NewEmailBuilder;
