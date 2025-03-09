"use client";
import React, { useState } from "react";
import { getDefaultProps } from "./utils/componentRegistry";
import ComponentPanel from "./ComponentPanel";

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

const EmailBuilderPage = () => {
  const [emailComponents, setEmailComponents] = useState<EmailComponent[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<EmailComponent | null>(null);

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

  // Function to update a component
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

  return (
    <div className="flex flex-row p-6">
      {/* Right sidebar - ComponentPanel */}
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Builder</h1>

        <ComponentPanel
          selectedComponent={selectedComponent}
          updateComponent={handleUpdateComponent}
          onAddComponent={handleAddComponent}
          onBackToComponentPalette={() => setSelectedComponent(null)}
        />
      </div>
    </div>
  );
};

export default EmailBuilderPage;
