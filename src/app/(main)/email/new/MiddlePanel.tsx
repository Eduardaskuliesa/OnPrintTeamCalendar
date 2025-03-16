"use client";
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import DraggableEmailCanvas from "../DragableEmailCanvas";

interface MiddlePanelProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  emailComponents: any[];
  setEmailComponents: (components: any[]) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  removeComponent: (id: string) => void;
  handleSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  openNameDialog: () => void;
}

const MiddlePanel: React.FC<MiddlePanelProps> = ({
  canvasRef,
  emailComponents,
  setEmailComponents,
  moveComponent,
  removeComponent,
  handleSelectComponent,
  selectedComponentId,
  openNameDialog,
}) => {
  return (
    <div ref={canvasRef} className="max-w-2xl w-full">
      <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            New Email Template
          </h2>
          <Button onClick={openNameDialog}>
            <div className="flex items-center">
              <Save className="h-5 w-5 mr-2" />
              Create Template
            </div>
          </Button>
        </div>
        <DraggableEmailCanvas
          components={emailComponents}
          setComponents={setEmailComponents}
          moveComponent={moveComponent}
          removeComponent={removeComponent}
          onSelectComponent={handleSelectComponent}
          selectedComponentId={selectedComponentId}
        />
      </div>
    </div>
  );
};

export default MiddlePanel;
