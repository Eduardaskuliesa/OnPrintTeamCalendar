"use client";
import React, { Suspense } from "react";
import ComponentPanelSkeleton from "../components/skeletons/ComponentPanelSkeleton";
const ComponentPanel = React.lazy(() => import("../../../(email-builder)/components/ComponentPanel"));

interface LeftPanelProps {
  panelRef: React.RefObject<HTMLDivElement>;
  selectedComponent: any;
  handleUpdateComponent: (id: string, updates: any) => void;

  handleAddComponent: (type: string) => void;
  setSelectedComponent: (component: any) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  panelRef,
  selectedComponent,
  handleUpdateComponent,
  handleAddComponent,

  setSelectedComponent,
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
            onAddComponent={handleAddComponent}
            onBackToComponentPalette={() => setSelectedComponent(null)}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default LeftPanel;
