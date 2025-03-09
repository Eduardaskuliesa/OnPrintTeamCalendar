"use client";
import React from "react";
import ComponentPalette from "./components/palette/ComponentPalette";
import ButtonEditor from "./components/editors/ButtonEditor/ButtonEditor";
import ImageEditor from "./components/editors/ImageEditor";
import { FiArrowLeft } from "react-icons/fi";

interface ComponentPanelProps {
  selectedComponent: any | null;
  updateComponent: (id: string, updates: any) => void;
  onAddComponent: (type: string) => void;
  onBackToComponentPalette: () => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({
  selectedComponent,
  updateComponent,
  onAddComponent,
  onBackToComponentPalette,
}) => {
  const renderEditor = () => {
    if (!selectedComponent) return null;

    switch (selectedComponent.type) {
      case "button":
        return (
          <ButtonEditor
            component={selectedComponent}
            updateComponent={updateComponent}
          />
        );
      case "image":
        return (
          <ImageEditor
            component={selectedComponent}
            updateComponent={updateComponent}
          />
        );
      default:
        return <div>No editor available for this component type.</div>;
    }
  };

  return (
    <div className="flex flex-row gap-6 w-full">
      {selectedComponent ? (
        <div className="p-4 bg-slate-50 border-2 border-blue-50 shadow-md rounded-lg max-w-lg w-full">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              Edit{" "}
              {selectedComponent.type.charAt(0).toUpperCase() +
                selectedComponent.type.slice(1)}
            </h2>
            <button
              onClick={onBackToComponentPalette}
              className="flex px-2 py-0.5 bg-white hover:bg-slate-50 border-2 rounded-md items-center text-gray-900 font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Atgal
            </button>
          </div>
          {renderEditor()}
        </div>
      ) : (
        <ComponentPalette onAddComponent={onAddComponent} />
      )}
    </div>
  );
};

export default ComponentPanel;
