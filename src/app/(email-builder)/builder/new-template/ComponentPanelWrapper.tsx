import ComponentPanel from "@/app/(email-builder)/components/ComponentPanel";
import ComponentPanelSkeleton from "@/app/(main)/email/components/skeletons/ComponentPanelSkeleton";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";
import React, { Suspense } from "react";

interface ComponentPanelWrapperProps {
  panelRef: React.RefObject<HTMLDivElement>;
}

const ComponentPanelWrapper: React.FC<ComponentPanelWrapperProps> = ({
  panelRef,
}) => {
  const { setSelectedComponent } = useEmailBuilderStore();
  return (
    <div className="w-full max-w-md h-[calc(100vh-72px)] bg-slate-50 border-r-4 border-blue-50">
      <Suspense fallback={<ComponentPanelSkeleton />}>
        <div
          ref={panelRef}
          className="max-h-[calc(100vh-72px)] min-h-[400px] overflow-y-auto custom-scrollbar"
        >
          <ComponentPanel
            onBackToComponentPalette={() => setSelectedComponent(null)}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default ComponentPanelWrapper;
