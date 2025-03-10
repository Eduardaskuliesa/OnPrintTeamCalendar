/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getDefaultProps } from "./utils/componentRegistry";
const ComponentPanel = React.lazy(() => import('./ComponentPanel'));
import DraggableEmailCanvas from "./DragableEmailCanvas";
import ComponentPanelSkeleton from "./components/skeletons/ComponentPanelSkeleton";
// import EmailPreview from "./EmailPreview";
// import EmailTemplate from "./EmailTemplate";
// import ViewModeToggle from "./ViewModeToggle";
// import { render } from '@react-email/render';

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

const EmailBuilderPage = () => {
  const [emailComponents, setEmailComponents] = useState<EmailComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<EmailComponent | null>(null);
  // const [viewMode, setViewMode] = useState("dekstop")
  // const [emailHtml, setEmailHtml] = useState()

  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddComponent = (type: string) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
    };

    setEmailComponents([...emailComponents, newComponent]);
    setSelectedComponent(newComponent);
  };

  const handleUpdateComponent = (
    id: string,
    updates: Partial<EmailComponent>
  ) => {
    setEmailComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, ...updates } : component
      )
    );
  };

  const moveComponent = (dragIndex: number, hoverIndex: number) => {
    const newComponents = [...emailComponents];
    const draggedItem = newComponents[dragIndex];

    newComponents.splice(dragIndex, 1);
    newComponents.splice(hoverIndex, 0, draggedItem);

    setEmailComponents(newComponents);
  };

  const handleSelectComponent = (id: string) => {
    const component = emailComponents.find((c) => c.id === id);
    if (component) {
      setSelectedComponent(component);
    }
  };

  // useEffect(() => {
  //   const updateEmailHtml = async () => {
  //     try {
  //       const template = <EmailTemplate emailComponents={emailComponents} />;
  //       const html = await render(template);
  //       setEmailHtml(html);
  //     } catch (error) {
  //       console.error("Error rendering email:", error);
  //     }
  //   };

  //   updateEmailHtml();
  // }, [emailComponents]);

  const clickOutsideHandler = (e: MouseEvent) => {
    if (!selectedComponent) return;
    const closestKeepElement =
      e.target instanceof Element
        ? e.target.closest('[data-keep-component="true"]')
        : null;

    if (closestKeepElement) return;

    const isClickInCriticalArea =
      panelRef.current?.contains(e.target as Node) ||
      canvasRef.current?.contains(e.target as Node);

    if (!isClickInCriticalArea) {
      setSelectedComponent(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [selectedComponent, panelRef, canvasRef]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row min-h-screen w-full p-2 gap-6">
        {/* Left Panel - Component Palette */}
        <div className="w-full max-w-md sticky top-5 h-fit">
          <Suspense fallback={<ComponentPanelSkeleton />}>
            <div ref={panelRef} className="max-h-[calc(95vh-120px)] min-h-[400px] overflow-y-auto custom-scrollbar">
              <ComponentPanel
                selectedComponent={selectedComponent}
                updateComponent={handleUpdateComponent}
                onAddComponent={handleAddComponent}
                onBackToComponentPalette={() => setSelectedComponent(null)}
              />
            </div>
          </Suspense>
        </div>

        {/* Middle - Email Canvas */}
        <div ref={canvasRef} className="max-w-2xl w-full">
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Email Canvas
              </h2>
            </div>
            <DraggableEmailCanvas
              components={emailComponents}
              setComponents={setEmailComponents}
              moveComponent={moveComponent}
              removeComponent={(id) => {
                setEmailComponents(emailComponents.filter((c) => c.id !== id));
                if (selectedComponent?.id === id) setSelectedComponent(null);
              }}
              onSelectComponent={handleSelectComponent}
              selectedComponentId={selectedComponent?.id}
            />
          </div>
        </div>

        {/* Right Side - Email Preview */}
        {/* <div className="w-full max-w-2xl">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-[#E4E4E7]">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Email Preview</h2>
            <EmailPreview emailHtml={emailHtml} viewMode={viewMode} />
          </div>
        </div> */}
      </div>
    </DndProvider>
  );
};

export default EmailBuilderPage;