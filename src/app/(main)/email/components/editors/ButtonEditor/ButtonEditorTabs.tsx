import React from "react";
import { motion } from "framer-motion";

interface ButtonEditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ButtonEditorTabs: React.FC<ButtonEditorTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  // Calculate the position based on the active tab
  const getUnderlinePosition = () => {
    switch (activeTab) {
      case "content":
        return "0%";
      case "styles":
        return "33.33%";
      case "text":
        return "66.66%";
      default:
        return "0%";
    }
  };

  return (
    <div className="flex flex-row gap-4 mb-6">
      <div className="border-b relative">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium relative z-10 text-lg flex-1 text-center ${
              activeTab === "content" ? "text-vdcoffe" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("content")}
          >
            Content
          </button>
          <button
            className={`py-2 px-4 font-medium relative text-lg z-10 flex-1 text-center ${
              activeTab === "styles" ? "text-vdcoffe" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("styles")}
          >
            Styles
          </button>
          <button
            className={`py-2 px-4 font-medium relative text-lg z-10 flex-1 text-center ${
              activeTab === "text" ? "text-vdcoffe" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("text")}
          >
            Text
          </button>
        </div>
        <motion.div
          className="absolute bottom-0 h-0.5 bg-vdcoffe z-0"
          initial={false}
          animate={{
            left: getUnderlinePosition(),
            width: "33.33%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>
    </div>
  );
};

export default ButtonEditorTabs;
