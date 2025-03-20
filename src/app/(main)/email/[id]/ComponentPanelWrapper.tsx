"use client";
import React, { Suspense, useRef } from "react";
import ComponentPanelSkeleton from "../components/skeletons/ComponentPanelSkeleton";

const ComponentPanel = React.lazy(() => import("../new/ComponentPanel"));

interface ComponentPanelWrapperProps {
  selectedComponent: any;
  handleUpdateComponent: (id: string, updates: any) => void;
  onAddComponent: (type: string) => void;
  onBackToComponentPalette: () => void;
  panelRef: React.RefObject<HTMLDivElement>;
}

const ComponentPanelWrapper: React.FC<ComponentPanelWrapperProps> = ({
  selectedComponent,
  handleUpdateComponent,
  onAddComponent,
  onBackToComponentPalette,
  panelRef,
}) => {
  return (
    <div className="w-full max-w-md sticky top-5 h-fit">
      <Suspense fallback={<ComponentPanelSkeleton />}>
        <div
          ref={panelRef}
          className="max-h-[calc(95vh-50px)] min-h-[400px] overflow-y-auto custom-scrollbar"
        >
          <ComponentPanel
            selectedComponent={selectedComponent}
            updateComponent={handleUpdateComponent}
            onAddComponent={onAddComponent}
            onBackToComponentPalette={onBackToComponentPalette}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default ComponentPanelWrapper;
