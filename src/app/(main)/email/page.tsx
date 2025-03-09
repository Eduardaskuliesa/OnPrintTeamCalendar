"use client";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getDefaultProps } from "./utils/componentRegistry";
import ComponentPanel from "./ComponentPanel";
import DraggableEmailCanvas from "./DragableEmailCanvas";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

const EmailBuilderPage = () => {
  const [emailComponents, setEmailComponents] = useState<EmailComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<EmailComponent | null>(null);
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

    console.log("Added component:", type);
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
      console.log("Selected component props:", component.props);
    }
  };

  const clickOutsideHandler = (e: MouseEvent) => {
    if (!selectedComponent) return;

    const clickedInsidePanel =
      panelRef.current && panelRef.current.contains(e.target as Node);
    const clickedInsideCanvas =
      canvasRef.current && canvasRef.current.contains(e.target as Node);

    if (!clickedInsidePanel && !clickedInsideCanvas) {
      setSelectedComponent(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [selectedComponent]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row min-h-screen w-full p-6 gap-6">
        <div className="w-full max-w-md sticky top-5 h-fit">
          <div
            ref={panelRef}
            className="max-h-[calc(95vh-120px)] min-h-[400px] overflow-y-auto custom-scrollbar"
          >
            <ComponentPanel
              selectedComponent={selectedComponent}
              updateComponent={handleUpdateComponent}
              onAddComponent={handleAddComponent}
              onBackToComponentPalette={() => setSelectedComponent(null)}
            />
          </div>
          {/* Implement later reset button */}
          {/* <div className="mt-4 border-t border-gray-200 pt-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              Restore default styles
            </Button>
          </div> */}
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
      </div>
    </DndProvider>
  );
};

export default EmailBuilderPage;
