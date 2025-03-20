import React, { useState } from "react";
import SimpleComponents from "./SimpleComponents";
import PrebuiltComponents from "./PrebuiltComponents";

interface ComponentPaletteProps {
  onAddComponent: (type: string) => void;
}

const ComponentPalette = ({ onAddComponent }: ComponentPaletteProps) => {
  const [activeTab, setActiveTab] = useState("simple");

  return (
    <div className="p-6 max-w-md w-full">
      <h2 className="text-lg font-bold mb-4">Email Components</h2>

      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "simple" ? "text-vdcoffe border-b-2 border-vdcoffe" : "text-gray-500"}`}
          onClick={() => setActiveTab("simple")}
        >
          Simple Components
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "prebuilt" ? "text-vdcoffe border-b-2 border-vdcoffe" : "text-gray-500"}`}
          onClick={() => setActiveTab("prebuilt")}
        >
          Prebuilt Components
        </button>
      </div>

      {activeTab === "simple" ? (
        <SimpleComponents onAddComponent={onAddComponent} />
      ) : (
        <PrebuiltComponents onAddComponent={onAddComponent} />
      )}
    </div>
  );
};

export default ComponentPalette;
