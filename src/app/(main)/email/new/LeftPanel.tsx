"use client";
import React, { Suspense } from "react";
import ComponentPanelSkeleton from "../components/skeletons/ComponentPanelSkeleton";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
const ComponentPanel = React.lazy(() => import("./ComponentPanel"));

interface LeftPanelProps {
  panelRef: React.RefObject<HTMLDivElement>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ panelRef }) => {
  const { setSelectedComponent } = useEmailBuilderStore();
  return (
    <div className="w-full max-w-md sticky top-5 h-fit">
      <Suspense fallback={<ComponentPanelSkeleton />}>
        <div
          ref={panelRef}
          className="max-h-[calc(95vh-50px)] min-h-[400px] overflow-y-auto custom-scrollbar"
        >
          <ComponentPanel
            onBackToComponentPalette={() => setSelectedComponent(null)}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default LeftPanel;
