/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ComponentPanelSkeleton from "@/app/(main)/email/components/skeletons/ComponentPanelSkeleton";
import { useEmailBuilder } from "@/app/(main)/email/hooks/useEmailBuilder";
import React, { Suspense, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EmailCanvasWrapper from "./EmailCanvasWrapper";
const ComponentPanelWrapper = React.lazy(() => import('../new-template/ComponentPanelWrapper'))



const NewEmailBuilder: React.FC = () => {
    const {
        selectedComponent,
        setSelectedComponent,
        panelRef,
        handleContentUpdate,
        handleSelectComponent,
        canvasRef,
        moveComponent,
        markAsSaved,
        removeComponent,
        emailComponents,
        setEmailComponents,
        handleAddComponent,
        handleUpdateComponent,
    } = useEmailBuilder([]);

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-row min-h-screen relative">
                    {/* Left Panel - Component Palette */}
                    <Suspense fallback={<ComponentPanelSkeleton />}>
                        <ComponentPanelWrapper
                            panelRef={panelRef}
                            selectedComponent={selectedComponent}
                            handleUpdateComponent={handleUpdateComponent}
                            handleAddComponent={handleAddComponent}
                            setSelectedComponent={setSelectedComponent}
                        />
                    </Suspense>

                    <div className="min-h-[300vh]"></div>

                    {/* Middle Panel - Email Canvas */}

                    <EmailCanvasWrapper
                        onUpdateComponent={handleContentUpdate}
                        canvasRef={canvasRef}
                        emailComponents={emailComponents}
                        setEmailComponents={setEmailComponents}
                        moveComponent={moveComponent}
                        removeComponent={removeComponent}
                        handleSelectComponent={handleSelectComponent}
                        selectedComponentId={selectedComponent?.id}
                    />
                </div>
            </DndProvider >
        </>
    );
};

export default NewEmailBuilder;
