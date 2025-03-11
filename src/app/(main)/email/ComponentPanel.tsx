"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComponentPalette from "./components/palette/ComponentPalette";
import ButtonEditor from "./components/editors/ButtonEditor/ButtonEditor";
import ImageEditor from "./components/editors/ImageEditor/ImageEditor";
import { FiArrowLeft } from "react-icons/fi";
import HeaderEditor from "./components/editors/HeaderEditor/HeaderEditor";
import SpaceEditor from "./components/editors/SpaceEditor/SpacerEditor";

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
  const [prevComponentId, setPrevComponentId] = useState<string | null>(null);
  const editorKey = selectedComponent ? selectedComponent.id : "no-component";

  useEffect(() => {
    if (selectedComponent && selectedComponent.id !== prevComponentId) {
      setPrevComponentId(selectedComponent.id);
    }
  }, [selectedComponent, prevComponentId]);

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
      case "header":
        return (
          <HeaderEditor
            component={selectedComponent}
            updateComponent={updateComponent}
          />
        );
      case "spacer":
        return (
          <SpaceEditor
            component={selectedComponent}
            updateComponent={updateComponent}
          />
        );

      default:
        return <div>No editor available for this component type.</div>;
    }
  };

  return (
    <div className="flex flex-row gap-6 w-full relative ">
      <AnimatePresence mode="wait">
        {selectedComponent ? (
          <motion.div
            key={`editor-${editorKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-4 bg-slate-50 border-2 border-blue-50 shadow-md rounded-lg max-w-lg w-full "
          >
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
            <AnimatePresence mode="wait">
              <motion.div
                key={editorKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderEditor()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="palette"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full "
          >
            <ComponentPalette onAddComponent={onAddComponent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentPanel;
