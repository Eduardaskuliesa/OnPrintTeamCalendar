import ComponentPanel from '@/app/(email-builder)/components/ComponentPanel';
import ComponentPanelSkeleton from '@/app/(main)/email/components/skeletons/ComponentPanelSkeleton';
import React, { Suspense } from 'react'


interface ComponentPanelWrapperProps {
    panelRef: React.RefObject<HTMLDivElement>;
    selectedComponent: any;
    handleUpdateComponent: (id: string, updates: any) => void;
    handleAddComponent: (type: string) => void;
    setSelectedComponent: (component: any) => void;
}

const ComponentPanelWrapper: React.FC<ComponentPanelWrapperProps> = ({ panelRef,
    selectedComponent,
    handleUpdateComponent,
    handleAddComponent,
    setSelectedComponent }) => {
    return (
        <div className="w-full max-w-md sticky top-[var(--header-height,70px)] h-[calc(100vh-var(--header-height,70px))] bg-slate-50 border-r-4 border-blue-50">
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
    )
}

export default ComponentPanelWrapper