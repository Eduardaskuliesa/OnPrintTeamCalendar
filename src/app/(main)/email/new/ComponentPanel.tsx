"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import ButtonEditor from "../components/editors/ButtonEditor/ButtonEditor";
import HeaderEditor from "../components/editors/HeaderEditor/HeaderEditor";
import ImageEditor from "../components/editors/ImageEditor/ImageEditor";
import TextEditor from "../components/editors/TextEditor/TextEditor";
import ComponentPalette from "../components/palette/ComponentPalette";
import SpacerEditor from "../components/editors/SpaceEditor/SpacerEditor";
import useEmailBuilderStore from "@/app/store/emailBuilderStore";

interface ComponentPanelProps {
  onBackToComponentPalette: () => void;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({
  onBackToComponentPalette,
}) => {
  const { selectedComponent, handleAddComponent, handleUpdateComponent } =
    useEmailBuilderStore();
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
            updateComponent={handleUpdateComponent}
          />
        );
      case "image":
        return (
          <ImageEditor
            component={selectedComponent}
            updateComponent={handleUpdateComponent}
          />
        );
      case "header":
        return (
          <HeaderEditor
            component={selectedComponent}
            updateComponent={handleUpdateComponent}
          />
        );
      case "spacer":
        return (
          <SpacerEditor
            component={selectedComponent}
            updateComponent={handleUpdateComponent}
          />
        );
      case "text":
        return (
          <TextEditor
            component={selectedComponent}
            updateComponent={handleUpdateComponent}
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
            className="p-4 max-w-lg w-full "
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
            <ComponentPalette onAddComponent={handleAddComponent} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentPanel;
